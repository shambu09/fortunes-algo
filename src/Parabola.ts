import Edge from "./Edge";
import Point from "./Point";

// Parabola class
// Could be a Arc or Edge
// Edges are internal nodes and Arcs are leaf nodes

export default class Parabola {
    isLeaf: boolean;
    focus: Point | undefined; // If Parabola is a Arc then focus will be the site which has constructed the Arc
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

    get left(): Parabola | undefined {
        return this._left;
    }

    set left(leftChild: Parabola) {
        leftChild.parent = this as Parabola;
        this._left = leftChild;
    }

    get right(): Parabola | undefined {
        return this._right;
    }

    set right(rightChild: Parabola) {
        this._right = rightChild;
        rightChild.parent = this;
    }

    ArcGetPreviousArc(): Parabola | undefined {
        return this.ArcGetPreviousEdge()?.EdgeGetPreviousArc();
    }

    ArcGetNextArc(): Parabola | undefined {
        return this.ArcGetNextEdge()?.EdgeGetNextArc();
    }

    ArcGetPreviousEdge(): Parabola | undefined {
        if (!this.isLeaf) return undefined;
        let parentParabola = this.parent!;
        let currentParabola: Parabola = this;

        while (parentParabola.left === currentParabola) {
            if (parentParabola.parent === undefined) return undefined;
            currentParabola = parentParabola;
            parentParabola = parentParabola.parent!;
        }

        return parentParabola;
    }

    ArcGetNextEdge(): Parabola | undefined {
        if (!this.isLeaf) return undefined;
        let parentParabola = this.parent!;
        let currentParabola: Parabola = this;

        while (parentParabola.right === currentParabola) {
            if (parentParabola.parent === undefined) return undefined;
            currentParabola = parentParabola;
            parentParabola = parentParabola.parent!;
        }

        return parentParabola;
    }

    EdgeGetPreviousArc(): Parabola | undefined {
        if (this.isLeaf) return undefined;
        let currentParabola = this.left!;

        while (!currentParabola.isLeaf)
            currentParabola = currentParabola.right!;

        return currentParabola;
    }

    EdgeGetNextArc(): Parabola | undefined {
        if (this.isLeaf) return undefined;
        let currentParabola = this.right!;

        while (!currentParabola.isLeaf) currentParabola = currentParabola.left!;

        return currentParabola;
    }
}
