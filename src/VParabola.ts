import VEdge from "./VEdge";
import VPoint from "./VPoint";
import VEvent from "./VEvent";

// Parabola class
// Could be a Arc or Edge
// Edges are internal nodes and Arcs are leaf nodes

export default class VParabola {
    isLeaf: boolean;
    focus: VPoint | undefined; // If Parabola is a Arc then focus will be the site which has constructed the Arc
    edge: VEdge | undefined;
    circleEvent: VEvent | undefined;
    parent: VParabola | undefined;

    private _left: VParabola | undefined;
    private _right: VParabola | undefined;

    constructor(focus?: VPoint) {
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

    get left(): VParabola | undefined {
        return this._left;
    }

    set left(leftChild: VParabola) {
        leftChild.parent = this as VParabola;
        this._left = leftChild;
    }

    get right(): VParabola | undefined {
        return this._right;
    }

    set right(rightChild: VParabola) {
        this._right = rightChild;
        rightChild.parent = this;
    }

    ArcGetPreviousArc(): VParabola | undefined {
        return this.ArcGetPreviousEdge()?.EdgeGetPreviousArc();
    }

    ArcGetNextArc(): VParabola | undefined {
        return this.ArcGetNextEdge()?.EdgeGetNextArc();
    }

    ArcGetPreviousEdge(): VParabola | undefined {
        if (!this.isLeaf) return undefined;
        let parentParabola = this.parent!;
        let currentParabola: VParabola = this;

        while (parentParabola.left === currentParabola) {
            if (parentParabola.parent === undefined) return undefined;
            currentParabola = parentParabola;
            parentParabola = parentParabola.parent!;
        }

        return parentParabola;
    }

    ArcGetNextEdge(): VParabola | undefined {
        if (!this.isLeaf) return undefined;
        let parentParabola = this.parent!;
        let currentParabola: VParabola = this;

        while (parentParabola.right === currentParabola) {
            if (parentParabola.parent === undefined) return undefined;
            currentParabola = parentParabola;
            parentParabola = parentParabola.parent!;
        }

        return parentParabola;
    }

    EdgeGetPreviousArc(): VParabola | undefined {
        if (this.isLeaf) return undefined;
        let currentParabola = this.left!;

        while (!currentParabola.isLeaf)
            currentParabola = currentParabola.right!;

        return currentParabola;
    }

    EdgeGetNextArc(): VParabola | undefined {
        if (this.isLeaf) return undefined;
        let currentParabola = this.right!;

        while (!currentParabola.isLeaf) currentParabola = currentParabola.left!;

        return currentParabola;
    }
}
