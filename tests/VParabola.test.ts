import "jest";
import VParabola from "../src/VParabola";
import VPoint from "../src/VPoint";

describe("VParabola", () => {
    //       _____________________________Root_____________________________
    //      /                                                              \
    //     A1                                                ______________E1______________
    //                                                      /                              \
    //                                                     A2                        ______E2______
    //                                                                              /             \
    //                                                                           __E3__          __E5__
    //                                                                          /      \        /      \
    //                                                                         A3      E4      A6       A7
    //                                                                                 / \
    //                                                                                A4  A5

    const beachline = new VParabola();
    let currentNode = beachline;

    currentNode.left = new VParabola(new VPoint(1, 1));
    currentNode.right = new VParabola();
    currentNode = currentNode.right;

    currentNode.left = new VParabola(new VPoint(2, 2));
    currentNode.right = new VParabola();
    currentNode = currentNode.right;

    const subTree = new VParabola();
    subTree.left = new VParabola(new VPoint(3, 3));
    subTree.right = new VParabola();
    subTree.right.left = new VParabola(new VPoint(4, 4));
    subTree.right.right = new VParabola(new VPoint(5, 5));

    currentNode.left = subTree;
    currentNode.right = new VParabola();
    currentNode = currentNode.right;

    currentNode.left = new VParabola(new VPoint(6, 6));
    currentNode.right = new VParabola(new VPoint(7, 7));

    it("can be initialised to be a Arc", () => {
        const focus = new VPoint(1, 2);
        const arc = new VParabola(focus);
        expect(arc).toBeDefined();
        expect(arc.isLeaf).toBeTruthy();
        expect(arc.site).toBeDefined();
        expect(arc.site).toEqual(focus);
        expect(arc.circleEvent).toBeUndefined();
        expect(arc.parent).toBeUndefined();
        expect(arc.edge).toBeUndefined();
    });

    it("can be initialised to be a Edge", () => {
        const edge = new VParabola();
        expect(edge).toBeDefined();
        expect(edge.isLeaf).toBeFalsy();
        expect(edge.site).toBeUndefined();
        expect(edge.circleEvent).toBeUndefined();
        expect(edge.parent).toBeUndefined();
        expect(edge.edge).toBeUndefined();
    });

    it("works as a beachline data structure, can get next arc from an edge", () => {
        const edge2 = beachline.right!;
        const arc = edge2.EdgeGetNextArc()!;
        expect(arc.site!.x).toEqual(3);
    });

    it("works as a beachline data structure, can get previous arc from an edge #1", () => {
        const edge2 = beachline.right!;
        const arc = edge2.EdgeGetPreviousArc()!;
        expect(arc.site!.x).toEqual(2);
    });

    it("works as a beachline data structure, can get previous arc from an edge #2", () => {
        const edge3 = beachline.right!.right!;
        const arc = edge3.EdgeGetPreviousArc()!;
        expect(arc.site!.x).toEqual(5);
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

    it("works as a beachline data structure, can get next arc from an arc #1", () => {
        const arc5 = subTree.right!.right!;
        const arc = arc5.ArcGetNextArc()!;
        expect(arc.site!.x).toEqual(6);
    });

    it("works as a beachline data structure, can get previous arc from an arc #2", () => {
        const arc3 = subTree.left!;
        const arc = arc3.ArcGetPreviousArc()!;
        expect(arc.site!.x).toEqual(2);
    });
});
