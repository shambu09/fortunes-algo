import Parabola from "./Parabola";
import Point from "./Point";

export default class Event {
    point: Point;
    isSiteEvent: boolean;
    y: number;
    arc: Parabola | undefined; // If site event then the corresponding arc which is split due to the event

    constructor(point: Point, isSiteEvent: boolean) {
        this.point = point;
        this.isSiteEvent = isSiteEvent;
        this.y = point.y;
        this.arc = undefined;
    }
}
