import VPoint from "./VPoint";

//                        (start)
//                           |<-------------------(y = mx + c)
//                           |
//          (right site)-->. | .<--(left site)
//                           |
//                           |
//                           V<-------------------(direction)
//                         (end)

export default class VEdge {
    start: VPoint;
    end: VPoint | undefined;
    direction: VPoint;
    left: VPoint;
    right: VPoint;
    m: number;
    c: number;
    neighbour: VEdge | undefined;

    constructor(start: VPoint, left: VPoint, right: VPoint) {
        this.start = start;
        this.left = left;
        this.right = right;

        this.end = undefined;
        this.neighbour = undefined;

        this.m = (-1 * (right.x - left.x)) / (right.y - left.y);
        this.c = start.y - this.m * start.x;
        this.direction = new VPoint(right.y - left.y, -1 * (right.x - left.x));
    }
}
