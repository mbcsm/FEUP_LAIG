/**
 * MyQuad
 * @constructor
 */
class MyCylinderSide extends CGFobject {

    constructor(scene, base, top, height, slices = 150, stacks = 5) {
        super(scene);

        this.slices = slices;
        this.stacks = stacks;
        this.height = height;
        
        this.initBuffers();
    }
    
        
    initBuffers(){
        this.indices = [];
        this.vertices = [];
        this.normals = [];
        this.texCoords = [];
    
        var ang = 0;
        var verts = 0;

        for(var j = 0; j <= this.stacks; j++)
        {
            this.vertices.push(1, 0, j / this.stacks);
            this.normals.push(1, 0, 0);
            this.texCoords.push(0,j / this.stacks);
            verts++;
    
            for(var i = 1; i <= this.slices; i++)
            {
                ang += Math.PI*2/this.slices;
                verts++;

                this.vertices.push(Math.cos(ang), Math.sin(ang), j / this.stacks);
                this.normals.push(Math.cos(ang), Math.sin(ang), 0);
                this.texCoords.push(i / this.slices, j / this.stacks);
    
                if(j > 0 && i > 0)
                {
                    this.indices.push(verts-1, verts-2, verts-this.slices-2);
                    this.indices.push(verts-this.slices-3, verts-this.slices-2, verts-2);
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}