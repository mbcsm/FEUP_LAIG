/**
 * Plane
 * @constructor
 */
class MyPlane extends CGFobject {

    constructor(scene, dimX, dimY, partsX, partsY) {
        super(scene);

        this.dimX = dimX;
        this.dimY = dimY;
        this.partsX = partsX;
        this.partsY = partsY;
        this.controlPoints =[
                [this.dimX/2, this.dimY/2, 0],
                [this.dimX/2, -this.dimY/2, 0],
                [-this.dimX/2, this.dimY/2, 0],
                [-this.dimX/2, -this.dimY/2, 0]
        ];
    
        this.plane = new MyPatch(this.scene, 1 , 1, this.partsX, this.partsY, this.controlPoints);
    }
    display(){
        this.plane.display();
    }
}