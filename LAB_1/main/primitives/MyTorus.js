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
                var x = (this.iRadius + (this.radius * Math.cos(loops * 2 * Math.PI / this.loops))) * Math.cos(slice * 2 * Math.PI / this.slices);
                var y = (this.iRadius + (this.radius * Math.cos(loops * 2 * Math.PI / this.loops))) * Math.sin(slice * 2 * Math.PI / this.slices)
                var z = this.radius * Math.sin(loops * 2 * Math.PI / this.loops);
                var s = 1 - (loops / this.loops);
                var t = 1 - (slice / this.slices);
    
                this.vertices.push(x, y, z);
                this.normals.push(x, y, z);
                this.texCoords.push(s, t);
            }
        }

        for (var loops = 0; loops < this.loops; loops++) {
            for (var slice = 0; slice < this.slices; slice++) {
                var first = (loops * (this.slices + 1)) + slice;
                var second = first + this.slices + 1;

                this.indices.push(first, second + 1, second);
                this.indices.push(first, first + 1, second + 1);
            }
        }


        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
};
