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

export default class Voronoi {
    private width: number = 0;
    private height: number = 0;
    private ly: number = 0;
    private places: Array<VPoint> = [];
    private edges: Array<VEdge> = [];

    private queue: IQueue | undefined;
    private root: VParabola | undefined;
    private deleted: Set<VEvent> | undefined;
    private vertices: Array<VPoint> | undefined;

    constructor(queue?: IQueue) {
        if (queue !== undefined) this.queue = queue;
    }

    getEdges(
        places: Array<VPoint>,
        width: number,
        height: number
    ): Array<VEdge> {
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
                (leftEvent: VEvent, rightEvent: VEvent) =>
                    leftEvent.y > rightEvent.y
            ) as IQueue;

        // Push all the site events into the Queue
        for (const place of this.places) {
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
        for (const edge of this.edges) {
            if (edge.neighbour !== undefined) {
                edge.start = edge.neighbour.end!;
                edge.neighbour = undefined;
            }
        }

        return this.edges;
    }

    private insertArc(sitePoint: VPoint) {
        // If the encountered site is the first one to be processed, just add to the beachline as a arc
        if (this.root === undefined) {
            this.root = new VParabola(sitePoint);
            return;
        }

        // Corner case -> If the encountered site is the second site and is on the same height as the first one
        if (this.root.isLeaf && this.root.site!.y - sitePoint.y < 1) {
            const rootSite = this.root.site!;

            const edgeStart = new VPoint(
                (sitePoint.x + rootSite.x) / 2,
                this.height
            );

            this.vertices!.push(edgeStart);

            this.root.isLeaf = false;

            // (rootSite)-->. | .<--(sitePoint)
            if (rootSite.x < sitePoint.x) {
                this.root.left = new VParabola(rootSite);
                this.root.right = new VParabola(sitePoint);
                this.root.edge = new VEdge(edgeStart, rootSite, sitePoint);
            }
            // (sitePoint)-->. | .<--(rootSite)
            else {
                this.root.left = new VParabola(sitePoint);
                this.root.right = new VParabola(rootSite);
                this.root.edge = new VEdge(edgeStart, sitePoint, rootSite);
            }

            this.edges.push(this.root.edge);
            return;
        }

        // Get the arc under/above the site event
        const arcUnderSite = this.getArcByX(sitePoint.x);

        // Delete any circle events of the arc, it will be split anyways and child arcs will be tested for circle events later
        if (arcUnderSite.circleEvent !== undefined) {
            this.deleted!.add(arcUnderSite.circleEvent);
            arcUnderSite.circleEvent = undefined;
        }

        const edgeStart = new VPoint(
            sitePoint.x,
            this.getY(arcUnderSite.site!, sitePoint.x)
        );

        this.vertices!.push(edgeStart);

        const edgeLeft = new VEdge(edgeStart, arcUnderSite.site!, sitePoint);
        const edgeRight = new VEdge(edgeStart, sitePoint, arcUnderSite.site!);

        edgeLeft.neighbour = edgeRight;
        this.edges.push(edgeLeft);

        // Build the SubTree, considering right edge as the parent edge of the SubTree
        arcUnderSite.isLeaf = false;
        arcUnderSite.edge = edgeRight;

        const arcLeft = new VParabola(arcUnderSite.site!);
        const arcMiddle = new VParabola(sitePoint);
        const arcRight = new VParabola(arcUnderSite.site!);

        arcUnderSite.right = arcRight;
        arcUnderSite.left = new VParabola();
        arcUnderSite.left.edge = edgeLeft;

        arcUnderSite.left.left = arcLeft;
        arcUnderSite.left.right = arcMiddle;

        this.checkCircleEvent(arcLeft);
        this.checkCircleEvent(arcRight);
    }

    private removeArc(circleEvent: VEvent) {
        const arcToBeRemoved = circleEvent.arc!;

        // Get left and right edges
        const edgeLeft = arcToBeRemoved.ArcGetPreviousEdge()!;
        const edgeRight = arcToBeRemoved.ArcGetNextEdge()!;

        // Get left and right arcs
        const arcLeft = edgeLeft.EdgeGetPreviousArc()!;
        const arcRight = edgeRight.EdgeGetNextArc()!;

        if (arcLeft === arcRight)
            console.log("error - the left and right arcs have the same focus!");

        // Remove circle events of left and right arc because now they are subtended by a new edge
        if (arcLeft.circleEvent !== undefined) {
            this.deleted!.add(arcLeft.circleEvent);
            arcLeft.circleEvent = undefined;
        }
        if (arcRight.circleEvent !== undefined) {
            this.deleted!.add(arcRight.circleEvent);
            arcRight.circleEvent = undefined;
        }

        const endEdge = new VPoint(
            circleEvent.point.x,
            this.getY(arcToBeRemoved.site!, circleEvent.point.x)
        );

        this.vertices!.push(endEdge);

        // Complete the left and right edges
        edgeLeft.edge!.end = endEdge;
        edgeRight.edge!.end = endEdge;

        // Find the edge which is higher in the beachline tree
        let higher: VParabola;
        let parent = arcToBeRemoved;

        while (parent !== this.root) {
            parent = parent.parent!;
            if (parent === edgeLeft) higher = edgeLeft;
            if (parent === edgeRight) higher = edgeRight;
        }

        higher!.edge = new VEdge(endEdge, arcLeft.site!, arcRight.site!);
        this.edges.push(higher!.edge);

        // Remove the arc from the beachline tree and process accordingly
        const grandParent = arcToBeRemoved.parent!.parent!;
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

    private finishEdge(parabola: VParabola) {
        if (parabola.isLeaf) {
            parabola.delete();
            return;
        }

        const endEdge = this.getEdgeIntersectBoundary(parabola.edge!);
        parabola.edge!.end = endEdge;
        this.vertices?.push(endEdge);

        this.finishEdge(parabola.left!);
        this.finishEdge(parabola.right!);

        parabola.delete();
    }

    private getEdgeIntersectBoundary(edge: VEdge): VPoint {
        // More info --> https://math.stackexchange.com/questions/2738250/intersection-of-ray-starting-inside-square-with-that-square

        let x, y;
        let x_intersect,
            y_intersect,
            t_x = 0,
            t_y = 0;
        const x_d = edge.direction.x;
        const y_d = edge.direction.y;
        const x_0 = edge.start.x;
        const y_0 = edge.start.y;
        const x_min = 0;
        const y_min = 0;
        const x_max = this.width;
        const y_max = this.height;

        if (x_d > 0) {
            x_intersect = "RIGHT";
            t_x = (x_max - x_0) / x_d;
        } else if (x_d < 0) {
            x_intersect = "LEFT";
            t_x = (x_min - x_0) / x_d;
        } else {
            x_intersect = "NONE";
        }

        if (y_d > 0) {
            y_intersect = "TOP";
            t_y = (y_max - y_0) / y_d;
        } else if (y_d < 0) {
            y_intersect = "BOTTOM";
            t_y = (y_min - y_0) / y_d;
        } else {
            y_intersect = "NONE";
        }

        if (x_intersect === "NONE") {
            x = x_0;
            y = y_0 + t_y * y_d;
        } else if (y_intersect === "NONE") {
            x = x_0 + t_x * x_d;
            y = y_0;
        } else {
            if (t_x < t_y) {
                x = x_0 + t_x * x_d;
                y = y_0 + t_x * y_d;
            } else if (t_y < t_x) {
                x = x_0 + t_y * x_d;
                y = y_0 + t_y * y_d;
            } else {
                x = x_0 + t_x * x_d;
                y = y_0 + t_x * y_d;
            }
        }

        return new VPoint(x, y);
    }

    private getXOfEdge(edge: VParabola, y: number): number {
        const arcLeft = edge.EdgeGetPreviousArc()!;
        const arcRight = edge.EdgeGetNextArc()!;

        const arcLeftSite = arcLeft.site!;
        const arcRightSite = arcRight.site!;

        // Calculate coefficients for the quadratic equation that represents the parabola
        // equation of each site
        let t = 2.0 * (arcLeftSite.y - y);
        const a1 = 1.0 / t;
        const b1 = (-2.0 * arcLeftSite.x) / t;
        const c1 = (arcLeftSite.x * arcLeftSite.x) / t + t / 4.0 + y;

        t = 2.0 * (arcRightSite.y - y);
        const a2 = 1.0 / t;
        const b2 = (-2.0 * arcRightSite.x) / t;
        const c2 = (arcRightSite.x * arcRightSite.x) / t + t / 4.0 + y;

        // Calculate coefficients for the quadratic equation that represents the
        // difference between the parabolas of the left and right sites
        const a = a1 - a2;
        const b = b1 - b2;
        const c = c1 - c2;

        let res;

        if (a === 0) {
            res = -c / b;
        } else {
            const discriminant = b * b - 4.0 * a * c;
            const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);

            // Choose the maximum or minimum x-coordinate based on the relative y-coordinates
            // Check more on intersection of two like parabolas
            if (arcLeftSite.y < arcRightSite.y) res = Math.max(x1, x2);
            else res = Math.min(x1, x2);
        }

        return res;
    }

    private getArcByX(newSiteX: number): VParabola {
        let parent = this.root!;
        let currX = 0.0;

        // Traverse the tree till a arc is found which is nearest to the x position of the new site
        while (!parent.isLeaf) {
            currX = this.getXOfEdge(parent, this.ly);
            if (currX > newSiteX) parent = parent.left!;
            else parent = parent.right!;
        }

        return parent;
    }

    private getY(arcSite: VPoint, siteX: number): number {
        const t = 2.0 * (arcSite.y - this.ly);
        const a = 1.0 / t;
        const b = (-2.0 * arcSite.x) / t;
        const c = (arcSite.x * arcSite.x) / t + t / 4.0 + this.ly;
        return a * siteX * siteX + b * siteX + c;
    }

    private checkCircleEvent(arc: VParabola) {
        const edgeLeft = arc.ArcGetPreviousEdge();
        const edgeRight = arc.ArcGetNextEdge();

        const arcLeft = edgeLeft?.EdgeGetPreviousArc();
        const arcRight = edgeRight?.EdgeGetNextArc();

        if (
            arcLeft === undefined ||
            arcRight === undefined ||
            arcLeft.site === arcRight.site
        )
            return;

        const intersectionPoint = this.getEdgeIntersection(
            edgeLeft!.edge!,
            edgeRight!.edge!
        );

        if (intersectionPoint === undefined) return;

        const dx = arcLeft!.site!.x - intersectionPoint.x;
        const dy = arcLeft!.site!.y - intersectionPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // left arc site, right arc site and the sweep line are equidistant from the intersection point
        if (intersectionPoint.y - distance >= this.ly) return;

        const newCircleEvent = new VEvent(
            new VPoint(intersectionPoint.x, intersectionPoint.y - distance),
            false
        );
        this.vertices!.push(newCircleEvent.point);
        arc.circleEvent = newCircleEvent;
        newCircleEvent.arc = arc;

        this.queue!.push(newCircleEvent);
    }

    private getEdgeIntersection(
        leftEdge: VEdge,
        rightEdge: VEdge
    ): VPoint | undefined {
        const intersectionPoint = new VPoint(0, 0);
        if (
            !this.TryAndGetEdgeIntersection(
                leftEdge,
                rightEdge,
                intersectionPoint
            )
        )
            return undefined;

        this.vertices!.push(intersectionPoint);

        return intersectionPoint;
    }

    private TryAndGetEdgeIntersection(
        leftEdge: VEdge,
        rightEdge: VEdge,
        placeHolderPoint: VPoint
    ): boolean {
        let x, y;

        // left-->| |<--right (parallel edges)
        if (!isFinite(leftEdge.m) && !isFinite(rightEdge.m)) {
            return false;
        }

        // left-->| /<--right
        else if (!isFinite(leftEdge.m)) {
            x = leftEdge.start.x;
            y = rightEdge.m * x + rightEdge.c;
        }

        // left-->\ |<--right
        else if (!isFinite(rightEdge.m)) {
            x = rightEdge.start.x;
            y = leftEdge.m * x + leftEdge.c;
        }

        // left-->\ /<--right
        else {
            x = (rightEdge.c - leftEdge.c) / (leftEdge.m - rightEdge.m);
            y = leftEdge.m * x + leftEdge.c;
        }

        // Edges can never meet because of opposite direction from the intersection point
        if ((x - leftEdge.start.x) / leftEdge.direction.x < 0) return false;
        if ((y - leftEdge.start.y) / leftEdge.direction.y < 0) return false;
        if ((x - rightEdge.start.x) / rightEdge.direction.x < 0) return false;
        if ((y - rightEdge.start.y) / rightEdge.direction.y < 0) return false;

        placeHolderPoint.x = x;
        placeHolderPoint.y = y;
        return true;
    }
}
