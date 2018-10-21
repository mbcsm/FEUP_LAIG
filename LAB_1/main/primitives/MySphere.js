/**
 * MyQuad
 * @constructor
 */
class MySphere extends CGFobject {

    constructor(scene, radius, slices, stacks) {
        super(scene);

        this.angleTotal = 0;
        this.sideAngle = 2*(Math.PI / slices);
        this.highAngle = Math.PI / stacks;

        this.slices = slices;
        this.stacks = stacks;
        this.radius = radius;

        this.initBuffers();
    }


    initBuffers() {
        this.indices = [];
        this.vertices = [];
        this.normals = [];
        this.texCoords = [];

        var ind = 0;
        var theta = 0;
        for (var i = 0; i <= this.stacks*2; i++) {
            var alpha = 0;
            var yCoord = Math.sin(theta);
            this.texCoords.push(0,j / this.stacks);
            for (var j = 0; j <= this.slices*2; j++) {
                var xCoord = Math.cos(alpha) * Math.cos(theta);
                var zCoord = Math.sin(alpha) * Math.cos(theta);
                this.vertices.push(xCoord, yCoord, zCoord);
                this.normals.push(xCoord, yCoord, zCoord);
                this.texCoords.push(i / this.slices, j / this.stacks);
                ++ind;
                alpha += this.sideAngle;
            }
            theta += this.highAngle;
        }

        var indice = 0;
        for (var i = 0; i < this.stacks*2; i++) {
            for (var j = 0; j < this.slices*2; j++) {
                this.indices.push(indice, indice + this.slices + 1, indice + this.slices + 2);
                this.indices.push(indice, indice + this.slices + 2, indice + 1);
                this.indices.push(indice + this.slices + 2, indice + this.slices + 1, indice);
                this.indices.push(indice + 1, indice + this.slices + 2, indice);
                ++indice;
            }
            ++indice;
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
};