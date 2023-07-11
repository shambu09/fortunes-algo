import PriorityQueue from "./PriorityQueue";
import VEdge from "./VEdge";
import VEvent from "./VEvent";
import VParabola from "./VParabola";
import VPoint from "./VPoint";

interface IQueue {
    clear: () => void;
    empty: () => boolean;
    pop: () => VEvent;
    push: (event: VEvent) => void;
}

type Vertices = Array<VPoint>;
type Edges = Array<VEdge>;

export default class Voronoi {
    private width: number = 0;
    private height: number = 0;
    private ly: number = 0;
    private places: Vertices = [];
    private edges: Edges = [];

    private queue: IQueue | undefined;
    private root: VParabola | undefined;
    private deleted: Set<VEvent> | undefined;
    private vertices: Array<VPoint> | undefined;

    constructor(queue?: IQueue) {
        if (queue !== undefined) this.queue = queue;
    }

    getEdges(places: Vertices, width: number, height: number): Edges {
        this.height = height;
        this.width = width;
        this.ly = 0;
        this.places = places;
        this.edges = [];
        this.root = undefined;
        this.deleted = new Set();
        this.vertices = [];

        if (this.queue !== undefined) this.queue.clear();
        else
            this.queue = new PriorityQueue(
                (event: VEvent) => event.y
            ) as IQueue;

        // Push all the site events into the Queue
        for (let place of this.vertices) {
            this.queue.push(new VEvent(place, true));
        }

        let eventIter: VEvent;

        // Iterate through all the events:
        // If the current event is a site event, add a arc to the beachline and process accordingly
        // If its a circle event, remove the corresponding arc and process accordingly
        while (!this.queue.empty()) {
            eventIter = this.queue.pop();
            this.ly = eventIter.y;

            if (this.deleted.has(eventIter)) {
                this.deleted.delete(eventIter);
                continue;
            }

            if (eventIter.isSiteEvent) this.insertArc(eventIter.point);
            else this.removeArc(eventIter);
        }

        // Complete any unfinished edges
        this.finishEdge(this.root!);
        for (let edge of this.edges) {
            if (edge.neighbour !== undefined) {
                edge.start = edge.neighbour.end!;
                edge.neighbour = undefined;
            }
        }

        return this.edges;
    }

    insertArc(sitePoint: VPoint) {
        //If the encountered site is the first one to be processed, just add to the beachline as a arc
        if (this.root === undefined) {
            this.root = new VParabola(sitePoint);
            return;
        }

        //Corner case -> If the encountered site is the second site and is on the same height as the first one
        if (this.root.isLeaf && this.root.site!.y - sitePoint.y < 1) {
            let rootSite = this.root.site!;

            let edgeStart = new VPoint(
                (sitePoint.x + rootSite.x) / 2,
                this.height
            );

            this.vertices!.push(edgeStart);

            this.root.isLeaf = false;

            //(rootSite)-->. | .<--(sitePoint)
            if (rootSite.x < sitePoint.x) {
                this.root.left = new VParabola(rootSite);
                this.root.right = new VParabola(sitePoint);
                this.root.edge = new VEdge(edgeStart, rootSite, sitePoint);
            }
            //(sitePoint)-->. | .<--(rootSite)
            else {
                this.root.left = new VParabola(sitePoint);
                this.root.right = new VParabola(rootSite);
                this.root.edge = new VEdge(edgeStart, sitePoint, rootSite);
            }

            this.edges.push(this.root.edge);
            return;
        }

        //Get the arc under/above the site event
        let arcUnderSite = this.getArcByX(sitePoint.x);

        //Delete any circle events of the arc, it will be split anyways and child arcs will be tested for circle events later
        if (arcUnderSite.circleEvent !== undefined) {
            this.deleted!.add(arcUnderSite.circleEvent);
            arcUnderSite.circleEvent = undefined;
        }

        let edgeStart = new VPoint(
            sitePoint.x,
            this.getY(arcUnderSite.site!, sitePoint.x)
        );
        this.vertices!.push(edgeStart);

        let edgeLeft = new VEdge(edgeStart, arcUnderSite.site!, sitePoint);
        let edgeRight = new VEdge(edgeStart, sitePoint, arcUnderSite.site!);

        edgeLeft.neighbour = edgeRight;
        this.edges.push(edgeLeft);

        //Build the SubTree, considering right edge as the parent edge of the SubTree
        arcUnderSite.isLeaf = false;
        arcUnderSite.edge = edgeRight;

        let arcLeft = new VParabola(arcUnderSite.site!);
        let arcMiddle = new VParabola(sitePoint);
        let arcRight = new VParabola(arcUnderSite.site!);

        arcUnderSite.right = arcRight;
        arcUnderSite.left = new VParabola();
        arcUnderSite.left.edge = edgeLeft;

        arcUnderSite.left.left = arcLeft;
        arcUnderSite.left.right = arcMiddle;

        this.checkCircleEvent(arcLeft);
        this.checkCircleEvent(arcRight);
    }

    removeArc(circleEvent: VEvent) {
        let arcToBeRemoved = circleEvent.arc!;

        //Get left and right edges
        let edgeLeft = arcToBeRemoved.ArcGetPreviousEdge()!;
        let edgeRight = arcToBeRemoved.ArcGetNextEdge()!;

        //Get left and right arcs
        let arcLeft = edgeLeft.EdgeGetPreviousArc()!;
        let arcRight = edgeRight.EdgeGetNextArc()!;

        if (arcLeft === arcRight)
            console.log("error - the left and right arcs have the same focus!");

        //Remove circle events of left and right arc because now they are subtended by a new edge
        if (arcLeft.circleEvent !== undefined) {
            this.deleted!.add(arcLeft.circleEvent);
            arcLeft.circleEvent = undefined;
        }
        if (arcRight.circleEvent !== undefined) {
            this.deleted!.add(arcRight.circleEvent);
            arcRight.circleEvent = undefined;
        }

        let endEdge = new VPoint(
            circleEvent.point.x,
            this.getY(arcToBeRemoved.site!, circleEvent.point.x)
        );

        this.vertices!.push(endEdge);

        //Complete the left and right edges
        edgeLeft.edge!.end = endEdge;
        edgeRight.edge!.end = endEdge;

        //Find the edge which is higher in the beachline tree
        let higher: VParabola;
        let parent = arcToBeRemoved;

        while (parent !== this.root) {
            parent = parent.parent!;
            if (parent === edgeLeft) higher = edgeLeft;
            if (parent === edgeRight) higher = edgeRight;
        }

        higher!.edge = new VEdge(endEdge, arcLeft.site!, arcRight.site!);
        this.edges.push(higher!.edge);

        //Remove the arc from the beachline tree and process accordingly
        let grandParent = arcToBeRemoved.parent!.parent!;
        if (arcToBeRemoved.parent!.left === arcToBeRemoved) {
            if (grandParent.left === arcToBeRemoved.parent)
                grandParent.left = arcToBeRemoved.parent!.right!;
            if (grandParent.right === arcToBeRemoved.parent)
                grandParent.right = arcToBeRemoved.parent!.right!;
        } else {
            if (grandParent.left === arcToBeRemoved.parent)
                grandParent.left = arcToBeRemoved.parent!.left!;
            if (grandParent.right === arcToBeRemoved.parent)
                grandParent.right = arcToBeRemoved.parent!.left!;
        }

        arcToBeRemoved.parent!.delete();
        arcToBeRemoved.delete();

        this.checkCircleEvent(arcLeft);
        this.checkCircleEvent(arcRight);
    }

    finishEdge(parabola: VParabola) {
        if (parabola.isLeaf) {
            parabola.delete();
            return;
        }

        let x: number;

        if (parabola.edge!.direction.x > 0.0)
            x = Math.max(this.width, parabola.edge!.start.x + 10);
        else x = Math.min(0, parabola.edge!.start.x - 10);

        let endEdge = new VPoint(x, parabola.edge!.m * x + parabola.edge!.c);
        parabola.edge!.end = endEdge;
        this.vertices?.push(endEdge);

        this.finishEdge(parabola.left!);
        this.finishEdge(parabola.right!);

        parabola.delete();
    }

    getXOfEdge(edge: VParabola, y: number): number {
        let arcLeft = edge.EdgeGetPreviousArc()!;
        let arcRight = edge.EdgeGetNextArc()!;

        let arcLeftSite = arcLeft.site!;
        let arcRightSite = arcRight.site!;

        let t = 2.0 * (arcLeftSite.y - y);
        let a1 = 1.0 / t;
        let b1 = (-2.0 * arcLeftSite.x) / t;
        let c1 = (arcLeftSite.x * arcLeftSite.x) / t + t / 4.0 + y;

        t = 2.0 * (arcRightSite.y - y);
        let a2 = 1.0 / t;
        let b2 = (-2.0 * arcRightSite.x) / t;
        let c2 = (arcRightSite.x * arcRightSite.x) / t + t / 4.0 + y;

        let a = a1 - a2;
        let b = b1 - b2;
        let c = c1 - c2;

        let discriminant = b * b - 4.0 * a * c;
        let x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        let x2 = (-b - Math.sqrt(discriminant)) / (2 * a);

        let res;
        if (arcLeftSite.y < arcRightSite.y) res = Math.max(x1, x2);
        else res = Math.min(x1, x2);

        return res;
    }

    getArcByX(newSiteX: number): VParabola {
        let parent = this.root!;
        let currX = 0.0;

        //Traverse the tree till a arc is found which is nearest to the x position of the new site
        while (!parent.isLeaf) {
            currX = this.getXOfEdge(parent, this.ly);
            if (currX > newSiteX) parent = parent.left!;
            else parent = parent.right!;
        }

        return parent;
    }

    getY(arcSite: VPoint, siteX: number): number {
        let t = 2.0 * (arcSite.y - this.ly);
        let a = 1.0 / t;
        let b = (-2.0 * arcSite.x) / t;
        let c = (arcSite.x * arcSite.x) / t + t / 4.0 + this.ly;

        return a * siteX * siteX + b * siteX + c;
    }

    checkCircleEvent(arc: VParabola) {}
    getEdgeIntersection(edge1: VEdge, edge2: VEdge): VPoint {
        return new VPoint(0, 0);
    }
}
