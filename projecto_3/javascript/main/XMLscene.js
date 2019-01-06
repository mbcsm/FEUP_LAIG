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
        this.cameraPositions= [[vec3.fromValues(5, 5, 0),vec3.fromValues(0, 0, 0)],[vec3.fromValues(-5, 5, 0),vec3.fromValues(0, 0, 0)]];
    }

    /**plane
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.cameras = [new CGFcamera(0.4, 0.1, 1000, vec3.fromValues(5, 5, 0), vec3.fromValues(0, 0, 0)), new CGFcamera(0.4, 0.1, 1000, vec3.fromValues(0, 50, 1), vec3.fromValues(0, 0, 0))];

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
        this.unitedStatesScore = 0;
        this.shitScore = 0;
        this.menu = true;
        this.sceneDisplay = false;
        this.gameState = 0;

        this.tempGameBoard;
        this.cameraMoving = false;
        this.cameraAngle = 0;
        this.cameraAngleMoved = 0;
        this.cameraMovementStarted = 0;

        this.scores = [new CGFtexture(this, "scenes/images/0.png")
                        , new CGFtexture(this, "scenes/images/1.png")
                        , new CGFtexture(this, "scenes/images/2.png")
                        , new CGFtexture(this, "scenes/images/3.png")
                        , new CGFtexture(this, "scenes/images/4.png")
                        , new CGFtexture(this, "scenes/images/5.png")
                        , new CGFtexture(this, "scenes/images/6.png")
                        , new CGFtexture(this, "scenes/images/7.png")
                        , new CGFtexture(this, "scenes/images/8.png")
                        , new CGFtexture(this, "scenes/images/9.png")];
        this.unitedStatesTexture = new CGFtexture(this, "scenes/images/united_states.png");
        this.shitTexture = new CGFtexture(this, "scenes/images/shit.jpg");
        this.cameraTexture = new CGFtexture(this, "scenes/images/camera.png");
        
        this.wallTexture1 = new CGFtexture(this, "scenes/images/wall.jpg");
        this.floorTexture1 = new CGFtexture(this, "scenes/images/floor.jpeg");
        this.grassTexture1 = new CGFtexture(this, "scenes/images/grass.jpg");
        
        this.wallTexture2 = new CGFtexture(this, "scenes/images/wall2.jpg");
        this.floorTexture2 = new CGFtexture(this, "scenes/images/floor2.jpg");
        this.grassTexture2 = new CGFtexture(this, "scenes/images/lava.png");

        this.blackTexture = new CGFtexture(this, "scenes/images/black.png");
        this.scoreAppearance = new CGFappearance(this);
        this.scoreAppearance.setAmbient(0.3, 0.3, 0.3, 1);
        this.scoreAppearance.setDiffuse(0.7, 0.7, 0.7, 1);
        this.scoreAppearance.setSpecular(0.0, 0.0, 0.0, 1);	
        this.scoreAppearance.setShininess(120);
        this.defaultAppearance = new CGFappearance(this);
        this.defaultAppearance.setAmbient(0.3, 0.3, 0.3, 1);
        this.defaultAppearance.setDiffuse(0.7, 0.7, 0.7, 1);
        this.defaultAppearance.setSpecular(0.0, 0.0, 0.0, 1);	
        this.defaultAppearance.setShininess(120);

        this.play = new CGFOBJModel(this, 'scenes/objects/s-play.obj');
        this.chair = new CGFOBJModel(this, 'scenes/objects/chair.obj');
        this.score = new MyQuad(this, 0, 0, 5, 5, 0.0, 1.0, 0.0, 1.0);
        this.flag = new MyQuad(this, 0, 0, 2.5, 5, 0.0, 1.0, 0.0, 1.0);
        this.cameraObj = new MyQuad(this, 0, 0, 1, 1, 0.0, 1.0, 0.0, 1.0);
        this.quadObj = new MyQuad(this, 0, 0, 1, 1, 0.0, 1.0, 0.0, 1.0);

        this.displayMenu();

        this.mat = 1;

        window.addEventListener("keydown", this.checkKeyPressed.bind(this), false);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = this.cameras[1];
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0));
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(1, 4, 1), vec3.fromValues(0, 0, 0));
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
        //this.camera = this.cameras[0];
        
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
                        
                        if(customId == 67){return;}
                        
                        if(this.gameState == 2){
                            this.menu = true;
                            this.gameState = 0;
                            return;
                        }

                        switch(customId){
                            case 65:
                                this.menu = false;
                                this.gameStart();
                                break;
                            case 66:
                                this.sceneDisplay = true;
                                this.camera = new CGFcamera(0.4, 0.1, 1000, vec3.fromValues(20, 20, 20), vec3.fromValues(0, 0, 0));
                                break;
                        }
                        

                        
                        this.selectedColumn = this.getYForProlog(customId);
                        this.selectedLine = this.getXForProlog(customId);

                        if(this.graph.game[this.selectedLine][this.selectedColumn] != 0){
                            this.selectedPiece = null;
                            for(let piece of this.graph.pieces){
                                if(piece.y == this.selectedColumn && piece.x == this.selectedLine){
                                    if((piece.pieceVal == 1 || piece.pieceVal == 2) && this.playerTurn != 2){return;}
                                    if((piece.pieceVal == 3 || piece.pieceVal == 4) && this.playerTurn != 1){return;}
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

        if(!this.displayScene)
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

            this.displayRoom();
            if(this.menu){this.displayMenu()};

            this.moveCameraToNextPlayer();

        }
        else {
            // Draw axis
            this.axis.display();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    movePiece(){
        this.hasAnyPlayerDied(this.selectedLine, this.selectedColumn, this.selectedPiece);

        var x = 0.15*(this.selectedLine - this.selectedPiece.x);
        var y = 0;
        var z = 0.15*(this.selectedPiece.y - this.selectedColumn);

        var controlPointsArray = [];
        controlPointsArray.push(new vec3.fromValues(0, 0, 0));
        controlPointsArray.push(new vec3.fromValues(x, y, z));

        this.selectedPiece.animation = new LinearAnimation(this, controlPointsArray, 1 * 1000, new Date().getTime() - this.startTime);

        this.selectedPiece.x = this.selectedLine;
        this.selectedPiece.y = this.selectedColumn;
        this.selectedPiece.selected = false;
        this.selectedPiece.transformationAfterAnim = [this.selectedPiece.transformation[0] + x, this.selectedPiece.transformation[1] + y, this.selectedPiece.transformation[2] + z];

        this.selectedPiece = null;
        this.counter++;

        if(this.playerTurn == 1){this.playerTurn = 2;}
        else{this.playerTurn = 1;}

        this.cameraMovementStarted = new Date().getTime();
        this.cameraMoving = true;
    }

    killKing(kingTeam){
        if(this.gameState != 2){return;}
        var kingVal = 0;

        if(kingTeam == 1){kingVal = 2}
        if(kingTeam == 2){kingVal = 4}

        for(let piece of this.graph.pieces){
            if(piece.pieceVal == kingVal){
                piece.died = true;

                var controlPointsArray = [];
                var x = 0;
                var y = 10;
                var z = 0;

                controlPointsArray.push(new vec3.fromValues(0, 0, 0));
                controlPointsArray.push(new vec3.fromValues(x, y, z));
                piece.animation = new LinearAnimation(this, controlPointsArray, 2 * 1000, new Date().getTime() - this.startTime);
                piece.transformationAfterAnim = [piece.transformation[0] + x, piece.transformation[1] + y, piece.transformation[2] + z];                            
            }
        }
    }
    //TODO: Make this shit Work
    hasAnyPlayerDied(selectedColumn, selectedLine, piece){
        if(this.gameState == 2){return;}

        for(var i=0; i< this.graph.game.length; i++){
            for(var j=0; j< this.graph.game.length; j++){
                if((selectedColumn == j && selectedLine == i) || (piece.x == i && piece.y == j)){continue;}
                if(this.tempGameBoard[i][j] != this.graph.game[i][j]){
                    for(let piece of this.graph.pieces){
                        if(piece.y == j && piece.x == i && !piece.died){
                            piece.died = true;

                            var controlPointsArray = [];
                            var x = 0;
                            var y = 0;
                            var z = 0;
                            if(piece.team == 0){
                                z = 0.15*(piece.y + 2);
                                x = 0.15*(this.graph.unitedStatesDeadPiecesIndex - piece.x);
                                this.graph.unitedStatesDeadPiecesIndex++;
                            }else{
                                z = -0.15*(8 - piece.y + 1);
                                x = 0.15*(this.graph.shitDeadPiecesIndex - piece.x);
                                this.graph.shitDeadPiecesIndex++;
                            }
                            controlPointsArray.push(new vec3.fromValues(0, 0, 0));
                            controlPointsArray.push(new vec3.fromValues(x, y, z));
                            piece.animation = new LinearAnimation(this, controlPointsArray, 2 * 1000, new Date().getTime() - this.startTime);
                            piece.transformationAfterAnim = [piece.transformation[0] + x, piece.transformation[1] + y, piece.transformation[2] + z];                            
                        }
                    }
                    
                }
            }
        }
    }

    getRequestString(selectedX, selectedY) {
        var plList = "novoMovimento([";

        var xInit = this.selectedPiece.x + 1;
        var yInit = this.selectedPiece.y + 1;
        var xFinal = selectedX + 1;
        var yFinal = selectedY + 1;
       
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
       
        plList += ',' + xInit;
        plList += ',' + yInit;
        plList += ',' + xFinal;
        plList += ',' + yFinal;
    
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
        if(str == "Bad Request"){
            this.selectedPiece = null;
            this.selectedX = null;
            this.selectedY = null;
            this.gameState = 0;
            return;

        }
        if(str == "2"){
            this.gameState = 2;
            this.movePiece();
            this.shitScore++;
            return;
        }
        if(str == "3"){
            this.gameState = 2;
            this.movePiece();
            this.unitedStatesScore++;
            return;
        }
        this.tempGameBoard = this.duplicateArray( this.graph.game );
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
    duplicateArray( arr ) {
        var i, copy;
    
        if( Array.isArray( arr ) ) {
            copy = arr.slice( 0 );
            for( i = 0; i < copy.length; i++ ) {
                copy[ i ] = this.duplicateArray( copy[ i ] );
            }
            return copy;
        } else if( typeof arr === 'object' ) {
            throw 'Cannot clone array containing an object!';
        } else {
            return arr;
        }
    
    }
    

    getXForProlog(pos){
        var y = 0;
        if(pos <= 8){y = 0;}
        else if(pos > 8 && pos <= 16 ){y = 1;}
        else if(pos > 16 && pos <= 24 ){y = 2;}
        else if(pos > 24 && pos <= 32 ){y = 3;}
        else if(pos > 32 && pos <= 40 ){y = 4;}
        else if(pos > 40 && pos <= 48 ){y = 5;}
        else if(pos > 48 && pos <= 56 ){y = 6;}
        else if(pos > 56 && pos <= 64 ){y = 7;}
        return y;
        
    }   
    getYForProlog(y){
        if(y<=8){return y - 1;}
        y = (y % 8);
        if(y==0){y=7;}
        else{y--;}
        return y;
        
    }
    getYForMovement(x){
        switch(x){
            case 0:
                return 7;
            case 1:
                return 6;
            case 2:
                return 5;
            case 3:
                return 4;
            case 4:
                return 3;
            case 5:
                return 2;
            case 6:
                return 1;
            case 7:
                return 0;

        }
    }
    moveCameraToNextPlayer(){
        if(!this.cameraMoving){return;}
        

        if(this.cameraAngleMoved >= Math.PI){

            this.camera.orbit(CGFcamera.X, Math.PI - this.cameraAngleMoved);  
            this.cameraAngleMoved = 0;
            this.cameraMoving = false;
            return;
        }

        var currentTime = new Date().getTime();

        this.elapsedTime = currentTime - this.cameraMovementStarted;

        var degree =  this.elapsedTime / 1000000 * 180 / 2;
        this.camera.orbit(CGFcamera.X, degree);  
        
        this.cameraAngleMoved += degree;
    }

    gameStart(){
        this.playerTurn = 1;
        this.counter = 0;
        this.pc1 = 0;
        this.pc2 = 0;
        this.menu = false;
        this.gameState = 1;
        this.camera = this.cameras[0];
        
        this.graph.game = [[1,1,1,1,1,1,1,1],
                    [0,0,0,2,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,4,0,0,0],
                    [3,3,3,3,3,3,3,3]];

        this.graph.createPieces();
    }

    displayMenu(){
        if(this.playerTurn == 2){
            this.camera.orbit(CGFcamera.X, Math.PI);  
            this.playerTurn = 1;
        }
        this.camera = new CGFcamera(0.4, 0.1, 1000, vec3.fromValues(0, 50, 1), vec3.fromValues(0, 0, 0));

		this.pushMatrix();
        this.rotate( Math.PI, 0, 1, 1);
        this.translate(0.64, -0.68, 20);
        this.scale(3, 3, 3);
        this.translate(0.41, -0.41, 5);
        if(this.pickMode){
            this.registerForPick(65, this.play);
            this.play.display();
        }
        this.play.display(); 
        this.popMatrix();

        this.pushMatrix();
        this.scoreAppearance.setTexture(this.scores[this.unitedStatesScore]);
        this.scoreAppearance.apply();
        this.rotate( Math.PI, 0, 1, 1);
        this.translate(0.64, -0.68, 20);
        this.translate(1.5, 0, 15);
        this.scale(0.5, 0.5, 0.5);
        if(!this.pickMode){this.score.display();}
        this.popMatrix();

        this.pushMatrix();
        this.scoreAppearance.setTexture(this.scores[this.shitScore]);
        this.scoreAppearance.apply();
        this.rotate( Math.PI, 0, 1, 1);
        this.translate(0.64, -0.68, 20);
        this.translate(-5.5, 0, 15);
        this.scale(0.5, 0.5, 0.5);
        if(!this.pickMode){this.score.display();}
        this.popMatrix();

        this.pushMatrix();
        this.scoreAppearance.setTexture(this.unitedStatesTexture);
        this.scoreAppearance.apply();
        this.rotate( Math.PI, 0, 1, 1);
        this.translate(0.64, -0.68, 20);
        this.translate(4, 0, 15);
        this.scale(0.5, 0.5, 0.5);
        if(!this.pickMode){this.flag.display();}
        this.popMatrix();

        this.pushMatrix();
        this.scoreAppearance.setTexture(this.shitTexture);
        this.scoreAppearance.apply();
        this.rotate( Math.PI, 0, 1, 1);
        this.translate(0.64, -0.68, 20);
        this.translate(-6.3, 0, 15.5);
        this.scale(0.5, 0.5, 0.5);
        if(!this.pickMode){this.flag.display();}
        this.popMatrix();
        
        this.pushMatrix();
        this.scoreAppearance.setTexture(this.cameraTexture);
        this.scoreAppearance.apply();
        this.rotate( Math.PI, 0, 1, 1);
        this.translate(-0.3, 3, 20);
        this.translate(0, 0, 15.5);
        this.scale(0.5, 0.5, 0.5);
        if(this.pickMode){
            this.registerForPick(66, this.cameraObj);
            this.cameraObj.display();
        }else{this.cameraObj.display();}
        this.popMatrix();

        this.pushMatrix();
        this.defaultAppearance.setTexture(this.blackTexture);
        this.defaultAppearance.apply();
        this.rotate( Math.PI, 0, 1, 1);
        this.translate(-20, -20, 20);
        this.scale(60, 60, 60);
        if(this.pickMode){
            this.registerForPick(67, this.quadObj);
            this.quadObj.display();
        }else{this.quadObj.display();}
        this.popMatrix();
    }
   
    displayRoom(){
        //Wall1
        this.pushMatrix();
        if(this.mat == 1){this.defaultAppearance.setTexture(this.wallTexture1);}
        else{this.defaultAppearance.setTexture(this.wallTexture2);}
        this.defaultAppearance.apply();
        this.translate(-2.5, -2.5, -2.5);
        this.scale(5, 5, 5);
        if(!this.pickMode){this.quadObj.display();}
        this.popMatrix();
        //wall2
        this.pushMatrix();
        if(this.mat == 1){this.defaultAppearance.setTexture(this.wallTexture1);}
        else{this.defaultAppearance.setTexture(this.wallTexture2);}
        this.defaultAppearance.apply();
        this.rotate( Math.PI, 1, 0, 1);
        this.translate(-2.5, -2.5, -2.5);
        this.scale(5, 5, 5);
        if(!this.pickMode){this.quadObj.display();}
        this.popMatrix();
        //floor
        this.pushMatrix();
        if(this.mat == 1){this.defaultAppearance.setTexture(this.floorTexture1);}
        else{this.defaultAppearance.setTexture(this.floorTexture2);}
        this.defaultAppearance.apply();
        this.rotate( Math.PI, 0, 1, 1);
        this.translate(-2.5, -2.5, -2.5);
        this.scale(5, 5, 5);
        if(!this.pickMode){this.quadObj.display();}
        this.popMatrix();
        //grass
        this.pushMatrix();
        if(this.mat == 1){this.defaultAppearance.setTexture(this.grassTexture1);}
        else{this.defaultAppearance.setTexture(this.grassTexture2);}
        this.defaultAppearance.apply();
        this.rotate( Math.PI, 0, 1, 1);
        this.translate(-15, -25, -2.6);
        this.scale(40, 40, 1);
        if(!this.pickMode){this.quadObj.display();}
        this.popMatrix();
    }

    checkKeyPressed(e) {
        if (e.key == "m") {
            if(this.mat == 1){this.mat = 2;}
            else{this.mat = 1;}
        }
        if (e.key == "q") {
            this.sceneDisplay = false;
            this.menu = true;
            this.displayMenu();
        }
    }
}