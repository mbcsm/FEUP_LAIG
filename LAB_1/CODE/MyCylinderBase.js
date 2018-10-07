/**
 * MyQuad
 * @constructor
 */
class MyCylinderBase extends CGFobject {

    constructor(scene, cos, sin) {
        super(scene);
        this.cos = cos;
        this.sin = sin;
        this.initBuffers();
    }


    initBuffers() {
        
        this.vertices = [
            0,  0,  0,
           this.cos, this.sin, 0,
            -this.cos, this.sin, 0,
        ];

        this.indices = [
            0, 1, 2,
        ];

        this.normals = [
            0, 0, 1,
            this.cos, this.sin, 1,
            -this.cos, this.sin, 1,
        ];
        this.texCoords = [
			0, 0,
			1, 0,
			0, 1,
			1, 1
		];
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
};
