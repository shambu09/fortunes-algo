import Point from "./Point";

//                        (start)
//                           |<-------------------(y = mx + c)
//                           |
//          (right site)-->. | .<--(left site)
//                           |
//                           |
//                           V<-------------------(direction)
//                         (end)

export default class Edge {
    start: Point;
    end: Point | undefined;
    direction: Point;
    left: Point;
    right: Point;
    m: number;
    c: number;
    neighbour: Edge | undefined;

    constructor(start: Point, left: Point, right: Point) {
        this.start = start;
        this.left = left;
        this.right = right;

        this.end = undefined;
        this.neighbour = undefined;

        this.m = (-1 * (right.x - left.x)) / (right.y - left.y);
        this.c = start.y - this.m * start.x;
        this.direction = new Point(right.y - left.y, -1 * (right.x - left.x));
    }
}
