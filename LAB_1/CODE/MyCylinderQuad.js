/**
 * MyQuad
 * @constructor
 */
class MyCylinderQuad extends CGFobject
{
	constructor(scene, cos, sin)
	{
		super(scene);
        this.cos = cos;
        this.sin = sin;
		this.initBuffers();
	};

	initBuffers()
	{
		this.vertices = [
			-0.5, -0.5, 0,
			0.5, -0.5, 0,
			-0.5, 0.5, 0,
			0.5, 0.5, 0
		];

		this.indices = [
			0, 1, 2,
			3, 2, 1
		];
		
		this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
		];

		//position irrelevant
		//couse of specific texture
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
