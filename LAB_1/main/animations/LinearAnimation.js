class LinearAnimation extends Animation{

    constructor(scene, controlPoints, time) {
        super(scene);
        
        this. controlPoints = controlPoints;
        this.time = time; 
        
        this.initBuffers();
    }
}
    