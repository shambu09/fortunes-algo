import Edge from "./Edge";
import Point from "./Point";

// Arc class
// Could be a Parabola or Edge
// Edges are internal nodes and Arcs are leaf nodes

export default class Parabola {
    isLeaf: boolean;
    focus: Point | undefined; // Parabola is the arc and focus is the site
    edge: Edge | undefined;
    circleEvent: Event | undefined;
    parent: Parabola | undefined;

    private _left: Parabola | undefined;
    private _right: Parabola | undefined;

    constructor(focus?: Point) {
        if (focus === undefined) {
            this.focus = undefined;
            this.isLeaf = false;
            this.edge = undefined;
            this.circleEvent = undefined;
            this.parent = undefined;
        } else {
            this.focus = focus;
            this.isLeaf = true;
            this.edge = undefined;
            this.circleEvent = undefined;
            this.parent = undefined;
        }
    }
}
