var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.lightValues = {};
        this.viewsEnabled = 0;
    }

    /**plane
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearColor(0,0,0, 1.0);
        this.gl.clearDepth(10000.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);

        this.startTime = new Date().getTime();

        this.views = 0;

        this.gameState = 0;
        this.selectedPiece;
        this.selectedLine;
        this.selectedColumn;

        this.playerTurn = 1;
        this.counter = 0;
        this.pc1 = 0;
        this.pc2 = 0;
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 1000, vec3.fromValues(5, 5, 5), vec3.fromValues(0, 0, 0));
        //this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0));
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {

        var i = 0;
        // Lights index.

        // Reads the omni lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.


            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                if(light.type == 'omni'){

                    //lights are predefined in cgfscene
                this.lights[i].setPosition(light.location.wCoord, light.location.xCoord, light.location.yCoord, light.location.zCoord);
                this.lights[i].setAmbient(light.ambient.r, light.ambient.g, light.ambient.b, light.ambient.a);
                this.lights[i].setDiffuse(light.diffuse.r, light.diffuse.g, light.diffuse.b, light.diffuse.a);
                this.lights[i].setSpecular(light.specular.r, light.specular.g, light.specular.b, light.specular.a);

                this.lights[i].setVisible(true);
                if (light.enabled)
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();
                i++;

                }else if(light.type == 'spot'){
                    this.lights[i].setPosition(light.location.wCoord, light.location.xCoord, light.location.yCoord, light.location.zCoord);
                    this.lights[i].setAmbient(light.ambient.r, light.ambient.g, light.ambient.b, light.ambient.a);
                    this.lights[i].setDiffuse(light.diffuse.r, light.diffuse.g, light.diffuse.b, light.diffuse.a);
                    this.lights[i].setSpecular(light.specular.r, light.specular.g, light.specular.b, light.specular.a);
                    this.lights[i].setSpotCutOff(light.angle);
                    this.lights[i].setSpotDirection(light.target.xCoord - light.location.xCoord, light.target.yCoord - light.location.yCoord, light.target.zCoord - light.location.zCoord);
                    this.lights[i].setSpotExponent(light.exponent);
    
                    this.lights[i].setVisible(true);
                    if (light.enabled)
                        this.lights[i].enable();
                    else
                        this.lights[i].disable();
    
                    this.lights[i].update();
    
                    i++;
                }

                                
            }
        }

        
    }


    /* Handler called when the graph is finally loaded.
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        //this.camera = this.graph.views[0].camera;
        
        //TODO: Change reference length according to parsed graph
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        // TODO: Change ambient and background details according to parsed graph

        var ambient = this.graph.ambient;
        var background = this.graph.background;
        this.gl.clearColor(background.r,background.g,background.b,background.a);
        this.setGlobalAmbientLight(ambient.r,ambient.g,ambient.b,ambient.a);

        this.initLights();

        this.viewsEnabled = this.graph.views[0].id;

        // Adds lights group.
        this.interface.addLightsGroup(this.graph.lights);
       // this.interface.addLightsGroup(this.graph.spot);
        this.interface.addViewsGroup(this.graph.views);

        this.sceneInited = true;

        this.graph.createPieces();
    }

    updateViews(id) {
        for(var i = 0 ; i < this.graph.views.length ; i++) {
            if(this.graph.views[i].id == id) {
                this.camera = this.graph.views[i].camera;
            }
        }
    }

    logPicking(){
        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i=0; i< this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj)
                    {
                        var customId = this.pickResults[i][1];				
                        console.log("Picked object: " + obj + ", with pick id " + customId);

                        this.selectedColumn = 8 - customId % 8;
                        this.selectedLine = Math.floor(customId / 8);
                        

                        
                        


                        if(this.graph.game[this.selectedLine][this.selectedColumn] != 0 && this.gameState == 0){
                            this.selectedPiece = null;
                            for(let piece of this.graph.pieces){
                                if(piece.y == this.selectedColumn && piece.x == this.selectedLine){
                                    this.selectedPiece = piece;
                                    piece.selected = true;
                                    this.gameState = 1;
                                    
                                }
                                else{piece.selected = false;}
                            }
                        }else if(this.graph.game[this.selectedLine][this.selectedColumn] == 0 && this.gameState == 1){
                            this.makeRequest(this.selectedLine, this.selectedColumn);
                        }
                    }
                }
                this.pickResults.splice(0,this.pickResults.length);
            }		
        }
    }
    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        this.logPicking();
        this.clearPickRegistration();

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        if (this.sceneInited) {
            // Draw axis
            //this.axis.display();

            var i = 0;

            for (var key in this.lightValues) {
                if (this.lightValues.hasOwnProperty(key)) {
                    if (this.lightValues[key]) {
                        this.lights[i].setVisible(true);
                        this.lights[i].enable();
                    }
                    else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }


            // Displays the scene (MySceneGraph function).
            this.graph.displayScene(this.startTime);
        }
        else {
            // Draw axis
            this.axis.display();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    movePiece(){
        var x = 0.15*(this.selectedLine - this.selectedPiece.x);
        var y = 0;
        var z = 0.15*(this.selectedColumn - this.selectedPiece.y);

        var controlPointsArray = [];
        controlPointsArray.push(new vec3.fromValues(0, 0, 0));
        controlPointsArray.push(new vec3.fromValues(x, y, z));

        this.selectedPiece.animation = new LinearAnimation(this, controlPointsArray, 2 * 1000, new Date().getTime() - this.startTime);
        this.gameState = 0;

        this.graph.game[this.selectedPiece.x][this.selectedPiece.y] = 0;
        this.graph.game[this.selectedLine][this.selectedColumn] = this.selectedPiece.pieceVal;
        this.selectedPiece.x = this.selectedLine;
        this.selectedPiece.y = this.selectedColumn;
        this.selectedPiece.selected = false;
        this.selectedPiece.transformationAfterAnim = [this.selectedPiece.transformation[0] + x, this.selectedPiece.transformation[1] + y, this.selectedPiece.transformation[2] + z];
    }

    getRequestString(selectedX, selectedY) {
        var plList = "novoMovimento([";
       
        for (var y = 0; y < this.graph.game.length; y++) {
            plList += "[";
            for (var x = 0; x < this.graph.game[y].length; x++) {
                switch(this.graph.game[y][x]){
                    case 0:
                        plList += 'vazio,';
                        break;
                    case 1:
                        plList += 'peao-branco,';
                        break;
                    case 2:
                        plList += 'rei-branco,';
                        break;
                    case 3:
                        plList += 'peao-preto,';
                        break;  
                    case 4:
                        plList += 'rei-preto,';
                        break;
                    default:break;
                }
            }
            plList = plList.slice(0, -1);
            plList += "],";
        }
        plList = plList.slice(0, -1);
        plList += "]";
        plList += ',' + this.playerTurn;
        plList += ',' + this.counter;
        plList += ',0';
        plList += ',0';
       
        plList += ',' + (this.selectedPiece.x+1);
        plList += ',' + ((this.selectedPiece.y+1) % 8 + 1);
        plList += ',' + (selectedX + 1);
        plList += ',' + ((selectedY+1) % 8 + 1);
        /*
        plList += ',8';
        plList += ',1';
        plList += ',8';
        plList += ',5';
        */
        plList += ')';

        console.log(plList);
        return plList;
    }

    getPrologRequest( requestString, onSuccess, onError, port)
    {
        var requestPort = port || 8081
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

        request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
        request.onerror = onError || function(){console.log("Error waiting for response");};

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    makeRequest(selectedX, selectedY)
    {
        // Get Parameter Values
        var requestString = this.getRequestString(selectedX, selectedY);				
        
        // Make Request
        this.getPrologRequest(requestString, this.handleReply.bind(this));
    }
    
    //Handle the Reply
    handleReply(data){
        var str = data.target.response;
        str = str.split(',');
        var i = 0;
        var j = 0;
        for(var it = 0; it < str.length; it++){
            var strTemp = str[it];
            strTemp = strTemp.replace("[", "");
            strTemp = strTemp.replace("[", "");
            strTemp = strTemp.replace("]", "");
            strTemp = strTemp.replace("]", "");
            
            switch(strTemp){
                case "vazio":
                    this.graph.game[j][i] = 0;
                    break;
                case "peao-branco":
                    this.graph.game[j][i] = 1;
                    break;
                case "rei-branco":
                    this.graph.game[j][i] = 2;
                    break;
                case "peao-preto":
                    this.graph.game[j][i] = 3;
                    break;  
                case "rei-preto":
                    this.graph.game[j][i] = 4;
                    break;
                default:break;
            }
            if(i<7){i++;}
            else{
                i = 0;
                j++;
            }
        }
        this.movePiece();
        console.log(this.graph.game);
    }
   
}