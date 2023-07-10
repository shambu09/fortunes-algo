import VParabola from "./VParabola";
import VPoint from "./VPoint";

export default class VEvent {
    point: VPoint;
    isSiteEvent: boolean;
    y: number;
    arc: VParabola | undefined; // If site event then the corresponding arc which is split due to the event

    constructor(point: VPoint, isSiteEvent: boolean) {
        this.point = point;
        this.isSiteEvent = isSiteEvent;
        this.y = point.y;
        this.arc = undefined;
    }
}
