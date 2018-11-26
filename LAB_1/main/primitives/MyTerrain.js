/**
 * Terrain
 * @constructor
 */
class MyTerrain extends CGFobject {
    
    constructor(scene, texture, heightmap, parts, heightscale) {
        super(scene);

        this.scene = scene;

        this.texture = texture;
        this.heightmap =  heightmap;
        this.heightscale =  heightscale;

        this.shader = new CGFshader(this.scene.gl, 'shaders/terrain.vert', 'shaders/terrain.frag');
        this.shader.setUniformsValues({
            normScale: heightscale,
            uSampler: heightmap,
            uSampler2: texture
        });

        this.appearance = new CGFappearance(this.scene);
        this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
        this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
        this.appearance.setSpecular(0.0, 0.0, 0.0, 1);	
        this.appearance.setShininess(120);

        this.appearance.setTexture(this.texture);
        this.appearance.setTextureWrap('REPEAT', 'REPEAT');

        this.plane = new MyPlane(this.scene,parts, parts);
    }

    display() {
        this.appearance.apply();
        this.scene.setActiveShader(this.shader);

        this.heightmap.bind();
        this.texture.bind(1);
      
        this.plane.display();

        this.scene.setActiveShader(this.scene.defaultShader);

    }
}