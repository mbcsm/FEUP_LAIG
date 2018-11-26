/**
 * Patch
 * @constructor
 */
class MyPatch extends CGFobject {

    constructor(scene, orderU, orderV, partsU, partsV, controlPointsTemp) {
        super(scene);
        this.orderU = orderU;
        this.orderV = orderV;
        this.partsU = partsU;
        this.partsV = partsV;
        this.controlPoints = [];
        this.controlPointsTemp = controlPointsTemp;


        var pos = 0;
        for(var i = 0; i < orderU + 1; i++) {
            var group = [];
            for(var j = 0; j < orderV + 1; j++) {
                group.push(controlPointsTemp[pos]);
                pos++;
            }
            this.controlPoints.push(group);
        }

    

        //Create Surface
        this.nurbsSurface = new CGFnurbsSurface(this.orderU, this.orderV, this.controlPoints);



        //Create Object
        this.surface = new CGFnurbsObject(this.scene, 
                                            this.partsU, 
                                            this.partsV, 
                                            this.nurbsSurface);
    }


    
    display() {
        this.surface.display();
    };
}