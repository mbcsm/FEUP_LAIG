/**
 * Patch
 * @constructor
 */
class MyCylinder2 extends CGFobject {

    constructor(scene, bradius, tradius, height, slices, stacks) {
        super(scene);
        this.height = height;
        this.bradius = bradius;
        this.tradius = tradius;
        this.slices = slices;
        this.stacks = stacks;

        this.points = [
            [
                [0.0, -this.bradius, 0.0, 1.0],
                [-this.bradius, -this.bradius, 0.0, Math.sqrt(2) / 2.0],
                [-this.bradius, 0.0, 0.0, 1.0],
                [-this.bradius, this.bradius, 0.0, Math.sqrt(2) / 2.0],
                [0.0, this.bradius, 0.0, 1.0],
                [this.bradius, this.bradius, 0.0, Math.sqrt(2) / 2.0],
                [this.bradius, 0.0, 0.0, 1.0],
                [this.bradius, -this.bradius, 0.0, Math.sqrt(2) / 2.0],
                [0.0, -this.bradius, 0.0, 1.0],
            ],
            [
                [0.0, -this.tradius, this.height, 1.0],
                [-this.tradius, -this.tradius, this.height, Math.sqrt(2) / 2.0],
                [-this.tradius, 0.0, this.height, 1.0],
                [-this.tradius, this.tradius, this.height, Math.sqrt(2) / 2.0],
                [0.0, this.tradius, this.height, 1.0],
                [this.tradius, this.tradius, this.height, Math.sqrt(2) / 2.0],
                [this.tradius, 0.0, this.height, 1.0],
                [this.tradius, -this.tradius, this.height, Math.sqrt(2) / 2.0],
                [0.0, -this.tradius, this.height, 1.0],
            ]
        ];

        var nurbPlane = new CGFnurbsSurface(1, 8, this.points);

        this.patch = new CGFnurbsObject(this.scene, this.slices, this.stacks, nurbPlane);
    };

    display() {
        this.patch.display();
    }

}