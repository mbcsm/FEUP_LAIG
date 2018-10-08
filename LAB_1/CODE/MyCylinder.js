/**
 * MyQuad
 * @constructor
 */
class MyCylinder extends CGFobject {

    constructor(scene, base, top, height, slices = 150, stacks = 5) {
        super(scene);

        this.height = height;

        this.side = new MyCylinderSide(scene, base, top, height, slices, stacks);
       
		this.top = new MyCylinderBase(this.scene, slices, height);
        this.bottom = new MyCylinderBase(this.scene, slices, 0);
        
        this.initBuffers();
    }
    
        
    display(){
        this.scene.pushMatrix();
            this.scene.scale(1, 1, this.height);
            this.side.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.top.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.bottom.display();
        this.scene.popMatrix();
    }
}