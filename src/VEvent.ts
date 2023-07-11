import VParabola from "./VParabola";
import VPoint from "./VPoint";

export default class VEvent {
    point: VPoint;
    isSiteEvent: boolean;
    y: number;
    arc: VParabola | undefined; // If circle event then the corresponding arc which is going to be removed

    constructor(point: VPoint, isSiteEvent: boolean) {
        this.point = point;
        this.isSiteEvent = isSiteEvent;
        this.y = point.y;
        this.arc = undefined;
    }
}
