/**
 * MyQuad
 * @constructor
 */
class MyCylinder extends CGFobject {

    constructor(scene, slices = 150, stacks = 5) {
        super(scene);

        this.angleTotal = 0;
        this.angle = 2*(Math.PI / slices);

        this.cos = Math.cos(Math.PI/2 - this.angle/2);
        this.sin = Math.sin(Math.PI/2 - this.angle/2);

        this.slices = slices;
        this.stacks = stacks;
        this.myCylinderBase = new MyCylinderBase(this.scene, this.cos, this.sin);
		this.quad = new MyCylinderQuad(this.scene, this.cos, this.sin);

    }

    display(){



        this.scene.pushMatrix();

        for(this.i = 0; this.i< this.slices; this.i++){

            this.scene.pushMatrix();
            this.scene.rotate(this.angleTotal, 0, 0, 1);

            this.scene.pushMatrix();
            this.scene.translate(0, 0, 0.5);
            this.myCylinderBase.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.scene.translate(0, 0, 0.5);
            this.myCylinderBase.display();
            this.scene.popMatrix();



            for(this.j = 0; this.j< this.stacks; this.j++){

                this.scene.pushMatrix();

                this.scene.translate(0, 0,  0.5 - (this.j/this.stacks));
                this.scene.scale(2*this.cos, 1, 1/this.stacks);
                this.scene.translate(0, 0,  -0.5);

                this.scene.rotate(-Math.PI/2, 1, 0, 0);
                this.scene.translate(0, 0, this.sin);
                this.quad.display();
                this.scene.popMatrix();

            }


            this.scene.popMatrix();
            this.angleTotal += this.angle;
        }

        this.scene.popMatrix();

    }
};
