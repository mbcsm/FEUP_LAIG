/**
 * MyQuad
 * @constructor
 */
class MyTorus extends CGFobject {

    constructor(scene, inner, outer, slices, loops) {
        super(scene);

        this.inner = inner;
        this.outer = outer;
        this.slices = slices;
        this.loops = loops;

        this.radius = (this.outer - this.inner) / 2;
        this.iRadius = this.inner + ((this.outer - this.inner) / 2);
    
        this.initBuffers();
    }
    
        
    initBuffers(){
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        for (var loops = 0; loops <= this.loops; loops++) {    
            for (var slice = 0; slice <= this.slices; slice++) {
                var xCoord = (this.iRadius + (this.radius * Math.cos(loops * 2 * Math.PI / this.loops))) * Math.cos(slice * 2 * Math.PI / this.slices);
                var yCoord = (this.iRadius + (this.radius * Math.cos(loops * 2 * Math.PI / this.loops))) * Math.sin(slice * 2 * Math.PI / this.slices)
                var zCoord = this.radius * Math.sin(loops * 2 * Math.PI / this.loops);
    
                this.vertices.push(xCoord, yCoord, zCoord);
                this.normals.push(xCoord, yCoord, zCoord);
                this.texCoords.push(1 - (loops / this.loops), 1 - (slice / this.slices));
            }
        }

        for (var loops = 0; loops < this.loops; loops++) {
            for (var slice = 0; slice < this.slices; slice++) {
                var ind = (loops * (this.slices + 1)) + slice;

                this.indices.push(ind, ind + this.slices + 2, ind + this.slices + 1);
                this.indices.push(ind, ind + 1, ind + this.slices + 2);
            }
        }


        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
};
