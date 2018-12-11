class CircularAnimation extends Animation{

    constructor(scene, center, radius, startang, rotang, time, startTime) {
        super(scene);

        this.scene = scene;

        var degToRad = Math.PI /180;

        this.distance = (startang - rotang)*2*Math.PI*radius/360;
        this.velocity = this.distance / time;

        this.center = center;
        this.radius = radius;
        this.startang = startang*degToRad;
        this.rotang = rotang*degToRad;
    
        this.time = time;
        this.endTime = time + startTime;
        this.startTime = startTime;
        this.lastDelta;
    
        this.w = this.velocity / radius;
        this.ended = false;
    }


    apply(currentTime) {
        
        if(currentTime <= this.startTime){
            console.log("do Nothing");
            return;  
        }

        if(currentTime >= this.endTime){
            console.log("ended");
            this.ended = true;
            this.scene.rotate(90, 0, 1, 0);
            this.scene.translate(this.radius, 0 , 0);
            this.scene.rotate(this.lastDelta, 0, 1, 0);
            this.scene.translate(this.center[0], this.center[1], this.center[2]);
            return;
        }
        console.log("do stuff");

        var deltaTime = (currentTime-this.startTime);

        var delta = this.startang + this.w * deltaTime;
        this.lastDelta = delta;

        this.scene.rotate(90, 0, 1, 0);
        this.scene.translate(this.radius, 0 , 0);
        this.scene.rotate(delta, 0, 1, 0);
        this.scene.translate(this.center[0], this.center[1], this.center[2]);
    }
}
