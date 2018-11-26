/**
 * Plane
 * @constructor
 */
class MyPlane extends CGFobject {

    constructor(scene, partsX, partsY) {
        super(scene);

        this.partsX = partsX;
        this.partsY = partsY;
        this.controlPoints =[
                [0.5, 0.5, 0, 1],
                [0.5, -0.5, 0, 1],
                [-0.5, 0.5, 0, 1],
                [-0.5, -0.5, 0, 1]
        ];
    
        this.plane = new MyPatch(this.scene, 1 , 1, this.partsX, this.partsY, this.controlPoints);
    }
    display(){
        this.plane.display();
    }
}