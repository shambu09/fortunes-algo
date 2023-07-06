import "jest";
import Parabola from "../src/Parabola";
import Point from "../src/Point";

describe("Parabola", () => {
    it("can be initialised to be a Arc", () => {
        const focus = new Point(1, 2);
        const arc = new Parabola(focus);
        expect(arc).toBeDefined();
        expect(arc.isLeaf).toBeTruthy();
        expect(arc.focus).toBeDefined();
        expect(arc.focus).toStrictEqual(focus);
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
});
