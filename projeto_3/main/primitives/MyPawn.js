/**
 * MyQuad
 * @constructor
 */
class MyPawn extends CGFobject {

    constructor(scene, texture) {
        super(scene);

        this.body = new MyCylinder2(scene, 0.02, 0.05, 0.2, 40, 40);
        this.head = new MySphere(scene, 0.05, 40, 40);


        this.appearance = new CGFappearance(this.scene);
        this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
        this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
        this.appearance.setSpecular(0.0, 0.0, 0.0, 1);	
        this.appearance.setShininess(120);

        this.appearance.setTexture(texture);
        
        this.initBuffers();
    }
    
        
    display(){

        var degToRad = Math.PI / 180.0;
        this.scene.pushMatrix();
            this.scene.rotate(90 * degToRad, 1, 0, 0);
            this.scene.scale(0.5, 0.5, 0.5);
            this.scene.translate(0, 0, -0.2);

            this.appearance.apply();
            this.scene.pushMatrix();
                this.body.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.head.display();
            this.scene.popMatrix();
        this.scene.popMatrix();
    }
}