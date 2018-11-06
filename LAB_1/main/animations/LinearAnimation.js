class LinearAnimation extends Animation{

    constructor(scene, controlPoints, time) {
        super(scene);

        this.scene = scene;
        this.time = time;
        this.controlPoints = controlPoints;
        this.distance = 0;

        this.segment = [];

        for (var i = 0; i < controlPoints.length - 1; i++) {
            this.distance += vec3.dist(vec3.fromValues(controlPoints[i][0], controlPoints[i][1], controlPoints[i][2]), vec3.fromValues(controlPoints[i + 1][0], controlPoints[i + 1][1], controlPoints[i + 1][2]));
            this.segment.push(this.distance);
        }
        this.velocity = this.distance / time;
        console.log([this.velocity, this.distance, this.time, this.segment])
        this.previousAngle = 0;
    }


    apply(currentTime) {
        
        if(currentTime > this.time){

            this.scene.translate(this.controlPoints[this.controlPoints.length-1][0], this.controlPoints[this.controlPoints.length-1][1], this.controlPoints[this.controlPoints.length-1][2]);
            return;  
        }

        console.log([this.currentDistance, currentTime]);

        this.currentDistance = this.velocity * currentTime;

        var i = 0;
        while (this.currentDistance > this.segment[i] && i < this.segment.length)
            i++;

        var controlPointStart = this.controlPoints[i];
        var controlPointEnd = this.controlPoints[i + 1];

        var lastDistance;
        if (i == 0)
            lastDistance = 0;
        else
            lastDistance = this.segment[i - 1];

        var delta = (this.currentDistance - lastDistance) / (this.segment[i] - lastDistance);
        var x = (controlPointEnd[0] - controlPointStart[0]) * delta + controlPointStart[0];
        var y = (controlPointEnd[1] - controlPointStart[1]) * delta + controlPointStart[1];
        var z = (controlPointEnd[2] - controlPointStart[2]) * delta + controlPointStart[2];
        //console.log([x,y,z]);
        this.scene.translate(x, y, z);

    }
}
