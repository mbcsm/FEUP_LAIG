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


        var points = [];

        for (var j = 0; j <= this.orderU; j++) {
            var v = [];
            for (var i = 0; i <= this.orderV; i++) {
                var point=this.controlPointsTemp[i + (this.orderV+1)*j]
                v[i] = [point[0],point[1],point[2],1];
            }
            points[j]=v;
        }
       
        var knotsU = this.getKnots(this.orderU);
        var knotsV = this.getKnots(this.orderV);

        //Create Surface
        this.nurbsSurface = new CGFnurbsSurface(this.orderU, this.orderV, points);



        //Create Object
        this.surface = new CGFnurbsObject(this.scene, 
                                            this.partsU, 
                                            this.partsV, 
                                            this.nurbsSurface);
    }


    
    display() {
        this.surface.display();
    };

    getKnots(order) {
        var knots = [];

        for (var i = 0; i <= order; i++) {
            knots.push(0);
        }
        for (var i = 0; i <= order; i++) {
            knots.push(1);
        }
        return knots;
    };

}