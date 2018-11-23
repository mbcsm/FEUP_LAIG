/**
 * Terrain
 * @constructor
 */
class MyTerrain extends CGFobject {
    
    constructor(scene, texture, heightmap, parts, heightscale) {
        super(scene);

        this.scene = scene;
        this.heightmapPath = terrain.heightmap;
        this.texturePath = terrain.texture;

        this.shader = new CGFshader(this.scene.gl, 'shaders/terrain.vert', 'shaders/terrain.frag');
        this.shader.setUniformsValues({
            normScale: 1.0
        });

        this.texture = new CGFtexture(this.scene, this.texturePath);
        this.heightmap = new CGFtexture(this.scene, this.heightmapPath);


        var defaultControlPoints = [
            [-0.5, -0.5, 0.0, 1],
            [-0.5, 0.5, 0.0, 1],
            [0.5, -0.5, 0.0, 1],
            [0.5, 0.5, 0.0, 1]
        ];


        var defaultNurbs = new Nurbs('', 'patch', 1, 20, 20, defaultControlPoints);

        this.plane = new Patch(this.scene, defaultNurbs);
    }
    display() {

        this.scene.setActiveShader(this.shader);

        this.texture.bind();
        this.heightmap.bind(1);
        this.plane.display();

        this.scene.setActiveShader(this.scene.defaultShader);
    }
}