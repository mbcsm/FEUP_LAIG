/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
        this.matCounter=0;
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)
        this.setActiveCamera(null);

        return true;
    }

    /**
     * Adds a folder containing the IDs of the lights passed as parameter.
     * @param {array} lights
     */
    addLightsGroup(lights) {

        var group = this.gui.addFolder("Lights");
        group.open();

        // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
        // e.g. this.option1=true; this.option2=false;


        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                this.scene.lightValues[key] = lights[key].enabled;
                group.add(this.scene.lightValues, key);
            }
        }
    }

    addViewsGroup(views) {
        var viewsid = [];
        for(let key of views) { 
            viewsid.push(key.id);
        }

        var listbox = this.gui.add(this.scene, 'viewsEnabled', viewsid);
        var self = this;

        listbox.onChange(
            function() {
                self.scene.updateViews(listbox.getValue());
            }
        );
    }

    /*processKeyBoard(event){
        console.log('processKeyBoard');
        if(event.key=='m'){
            this.scene.graph.matCounter++;
            console.log('M pressed');
        }
    }*/


}