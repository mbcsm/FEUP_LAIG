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

    /**
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
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 1000, vec3.fromValues(500, 500, 500), vec3.fromValues(0, 0, 0));
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
    }

    updateViews(id) {
        for(var i = 0 ; i < this.graph.views.length ; i++) {
            if(this.graph.views[i].id == id) {
                this.camera = this.graph.views[i].camera;
            }
        }
    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup


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
            this.axis.display();

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
}