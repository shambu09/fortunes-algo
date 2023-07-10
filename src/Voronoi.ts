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
    private points: Array<VPoint> | undefined;

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
        this.points = [];

        if (this.queue !== undefined) this.queue.clear();
        else
            this.queue = new PriorityQueue(
                (event: VEvent) => event.y
            ) as IQueue;

        // Push all the site events into the Queue
        for (let place of this.points) {
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

    insertParabola(sitePoint: VPoint) {}

    removeParabola(event: VEvent) {}
    finishEdge(parabola: VParabola) {}
    getXOfEdge(parabola: VParabola, y: number): number {
        return 0;
    }
    getParabolaByX(x: number): VParabola {
        return new VParabola();
    }
    getY(point: VPoint, x: number): number {
        return 0;
    }
    checkCircle(parabola: VParabola) {}
    getEdgeIntersection(edge1: VEdge, edge2: VEdge): VPoint {
        return new VPoint(0, 0);
    }
}
