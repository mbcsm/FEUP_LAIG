/**
 * Plane
 * @constructor
 */
class MyPlane extends CGFobject {

    constructor(scene, dimX, dimY, partsX, partsY) {
        super(scene);

        var knots1 = this.getKnotsVector(1);
        var knots2 = this.getKnotsVector(1);
    
        var controlPoints=[
                                        [
                                            [-dimX/2, -dimY/2, 0.0, 1 ],
                                            [-dimX/2,  dimY/2, 0.0, 1 ]
    
                                        ],
                                        [
                            [dimX/2, -dimY/2, 0.0, 1 ],
                            [dimX/2, dimY/2, 0.0, 1 ]
                                        ]
                                    ];
    
        var nurbsSurface = new CGFnurbsSurface(1, 1, knots1, knots2, controlPoints);
    
        var getSurfacePoint = function(u, v) {
            return nurbsSurface.getPoint(u, v);
        };
  
        CGFnurbsObject.call(this, scene, getSurfacePoint, partsX, partsY);
    }
  
  getKnotsVector(degree) { 
  
      var v = new Array();
      for (var i=0; i<=degree; i++) {
          v.push(0);
      }
      for (var i=0; i<=degree; i++) {
          v.push(1);
      }
      return v;
  }
}