/**
 * MyQuad
 * @constructor
 */
class MyKing extends CGFobject {

    constructor(scene, texture) {
        super(scene);

        this.body = new MyCylinder2(scene, 0.03, 0.2, 0.4, 40, 40);
        this.head = new MyTorus(scene, 0.02, 0.05, 40, 40);


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
            this.scene.scale(0.3, 0.3, 0.3);
            this.scene.translate(0, 0, -0.4);

            this.appearance.apply();
            this.scene.pushMatrix();
                this.scene.scale(1, 1, 1);
                this.body.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.rotate(90 * degToRad, 1, 0, 0);
                this.scene.rotate(90 * degToRad, 0, 1, 0);
                this.scene.translate(0, -0.1, 0);
                this.scene.scale(4, 4, 4);
                this.head.display();
            this.scene.popMatrix();
        this.scene.popMatrix();
    }
}