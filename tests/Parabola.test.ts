import "jest";
import Parabola from "../src/Parabola";
import Point from "../src/Point";

describe("Parabola", () => {
    const beachline = new Parabola();
    let currentNode = beachline;

    currentNode.left = new Parabola(new Point(1, 1));
    currentNode.right = new Parabola();
    currentNode = currentNode.right;

    currentNode.left = new Parabola(new Point(2, 2));
    currentNode.right = new Parabola();
    currentNode = currentNode.right;

    const subTree = new Parabola();
    subTree.left = new Parabola(new Point(3, 3));
    subTree.right = new Parabola();
    subTree.right.left = new Parabola(new Point(4, 4));
    subTree.right.right = new Parabola(new Point(5, 5));

    currentNode.left = subTree;
    currentNode.right = new Parabola();
    currentNode = currentNode.right;

    currentNode.left = new Parabola(new Point(6, 6));
    currentNode.right = new Parabola(new Point(7, 7));

    it("can be initialised to be a Arc", () => {
        const focus = new Point(1, 2);
        const arc = new Parabola(focus);
        expect(arc).toBeDefined();
        expect(arc.isLeaf).toBeTruthy();
        expect(arc.focus).toBeDefined();
        expect(arc.focus).toEqual(focus);
        expect(arc.circleEvent).toBeUndefined();
        expect(arc.parent).toBeUndefined();
        expect(arc.edge).toBeUndefined();
    });

    it("can be initialised to be a Edge", () => {
        const edge = new Parabola();
        expect(edge).toBeDefined();
        expect(edge.isLeaf).toBeFalsy();
        expect(edge.focus).toBeUndefined();
        expect(edge.circleEvent).toBeUndefined();
        expect(edge.parent).toBeUndefined();
        expect(edge.edge).toBeUndefined();
    });

    it("works as a beachline data structure, can get next arc from an edge", () => {
        const edge2 = beachline.right!;
        const arc = edge2.EdgeGetNextArc()!;
        expect(arc.focus!.x).toEqual(3);
    });

    it("works as a beachline data structure, can get previous arc from an edge #1", () => {
        const edge2 = beachline.right!;
        const arc = edge2.EdgeGetPreviousArc()!;
        expect(arc.focus!.x).toEqual(2);
    });

    it("works as a beachline data structure, can get previous arc from an edge #2", () => {
        const edge3 = beachline.right!.right!;
        const arc = edge3.EdgeGetPreviousArc()!;
        expect(arc.focus!.x).toEqual(5);
    });

    it("works as a beachline data structure, can get next edge from an arc #1", () => {
        const arc2 = beachline.right!.left!;
        const edge = arc2.ArcGetNextEdge()!;
        expect(edge).toEqual(beachline.right);
    });

    it("works as a beachline data structure, can get next edge from an arc #2", () => {
        const arc5 = subTree.right!.right!;
        const edge = arc5.ArcGetNextEdge()!;
        expect(edge).toEqual(beachline.right!.right);
    });

    it("works as a beachline data structure, can get previous edge from an arc", () => {
        const arc4 = beachline.right!.right!.right!.left!;
        const edge = arc4.ArcGetPreviousEdge()!;
        expect(edge).toEqual(beachline.right!.right);
    });

    it("works as a beachline data structure, can get next arc from an arc", () => {
        const arc5 = subTree.right!.right!;
        const arc = arc5.ArcGetNextArc()!;
        expect(arc.focus!.x).toEqual(6);
    });

    it("works as a beachline data structure, can get previous arc from an arc", () => {
        const arc3 = subTree.left!;
        const arc = arc3.ArcGetPreviousArc()!;
        expect(arc.focus!.x).toEqual(2);
    });
});
