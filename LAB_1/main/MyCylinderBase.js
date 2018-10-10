/**
 * MyQuad
 * @constructor
 */
class MyCylinderBase extends CGFobject {

    constructor(scene, slices, height) {
        super(scene);

        this.slices = slices;
        this.height = height,
        
        this.initBuffers();
    }


    initBuffers() {
        
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        this.ang = Math.PI*2/this.slices;

        this.vertices.push(0, 0, this.height);
        this.normals.push(0, 0, 1);
        this.texCoords.push(0.5, 0.5);

        if(this.height == 0)
            for(var i=this.slices; i > 0; i--){
                this.vertices.push(Math.cos(this.ang*i), Math.sin(this.ang*i), this.height);  	
                this.normals.push(0, 0, 1);
                this.texCoords.push((Math.cos(-this.ang*i)+1)/2, (Math.sin(-this.ang*i)+1)/2);

                this.indices.push(i, i%this.slices+1, 0);
            }
        else
            for(var i=0; i <= this.slices; i++){
                this.vertices.push(Math.cos(this.ang*i), Math.sin(this.ang*i), this.height);  	
                this.normals.push(0, 0, 1);
                this.texCoords.push((Math.cos(-this.ang*i)+1)/2, (Math.sin(-this.ang*i)+1)/2);

                this.indices.push(i, i%this.slices+1, 0);
            }
        
        

        this.primitiveType=this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
};
