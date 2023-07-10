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

            if (eventIter.isSiteEvent) this.insertParabola(eventIter.point);
            else this.removeParabola(eventIter);
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

    insertParabola(sitePoint: VPoint) {
        //If the encountered site is the first one to be processed, just add to the beachline as a Arc
        if (this.root === undefined) {
            this.root = new VParabola(sitePoint);
            return;
        }

        //Corner case -> If the if the encountered site is the second site and is on the same height as the first one
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

        //Get arc under/above the site event
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

    removeParabola(event: VEvent) {}
    finishEdge(parabola: VParabola) {}
    getXOfEdge(parabola: VParabola, y: number): number {
        return 0;
    }
    getArcByX(x: number): VParabola {
        return new VParabola();
    }
    getY(arcSite: VPoint, eventX: number): number {
        return 0;
    }
    checkCircleEvent(arc: VParabola) {}
    getEdgeIntersection(edge1: VEdge, edge2: VEdge): VPoint {
        return new VPoint(0, 0);
    }
}
