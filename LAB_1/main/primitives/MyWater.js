/**
 * Terrain
 * @constructor
 */
class MyWater extends CGFobject {
    
    constructor(scene, texture, heightmap, parts, heightscale) {
        super(scene);

        this.scene = scene;

        this.texture = texture;
        this.heightmap =  heightmap;
        this.heightscale =  heightscale;
        this.heightscaleCurrent = 0;
        this.up = true;

        this.shader = new CGFshader(this.scene.gl, 'shaders/terrain.vert', 'shaders/terrain.frag');
        this.shader.setUniformsValues({
            normScale: 0,
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

        if(this.heightscaleCurrent >= this.heightscale){
            this.up = false;
        }else if(this.heightscaleCurrent <= -this.heightscale){
            this.up = true;
        }

        if(this.up){
            this.heightscaleCurrent += 0.05;
        }else{
            this.heightscaleCurrent -= 0.05;
        }

        this.shader.setUniformsValues({
            normScale: this.heightscaleCurrent,
            uSampler: this.heightmap,
            uSampler2: this.texture
        });

        this.heightmap.bind();
        this.texture.bind(1);
      
        this.plane.display();

        this.scene.setActiveShader(this.scene.defaultShader);

    }
}