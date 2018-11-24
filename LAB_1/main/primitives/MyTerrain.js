/**
 * Terrain
 * @constructor
 */
class MyTerrain extends CGFobject {
    
    constructor(scene, texture, heightmap, parts, heightscale) {
        super(scene);

        this.scene = scene;

        this.shader = new CGFshader(this.scene.gl, 'shaders/terrain.vert', 'shaders/terrain.frag');
        this.shader.setUniformsValues({
            normScale: heightscale
        });

        this.texture = texture;
        this.heightmap =  heightmap;

        this.appearance = new CGFappearance(this.scene);
        this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
        this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
        this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
        this.appearance.setShininess(120);
      
    

        this.appearance.setTexture(this.texture);
        this.appearance.setTextureWrap('REPEAT', 'REPEAT');

        this.plane = new MyPlane(this.scene, 1, 1, parts, parts);

    }
    display() {
        this.appearance.apply();
        this.scene.setActiveShader(this.shader);
      
        this.scene.pushMatrix();
      
        this.heightmap.bind(1);
        this.texture.bind();
      
        this.plane.display();
        this.scene.popMatrix();
      
        this.scene.setActiveShader(this.scene.defaultShader);

    }
}