import VPoint from "./VPoint";

const testPoints = (testCase: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7) => {
    const initialPoints: VPoint[] = [];

    switch (testCase) {
    case 0:
        // Example case: The points shown in the GIF of Fortune's algorithm on wikipedia
        initialPoints.push(new VPoint(155, 552));
        initialPoints.push(new VPoint(405, 552));
        initialPoints.push(new VPoint(624, 463));
        initialPoints.push(new VPoint(211, 419));
        initialPoints.push(new VPoint(458, 358));
        initialPoints.push(new VPoint(673, 299));
        initialPoints.push(new VPoint(261, 278));
        initialPoints.push(new VPoint(88, 196));
        initialPoints.push(new VPoint(497, 177));
        initialPoints.push(new VPoint(715, 118));
        initialPoints.push(new VPoint(275, 99));
        break;

    case 1:
        // Test case 1: Points with equal x
        initialPoints.push(new VPoint(300, 300));
        initialPoints.push(new VPoint(300, 400));
        initialPoints.push(new VPoint(400, 350));
        break;

    case 2:
        // Test case 2: Points with equal y (where those points are not the first points)
        initialPoints.push(new VPoint(300, 300));
        initialPoints.push(new VPoint(200, 200));
        initialPoints.push(new VPoint(400, 200));
        break;

    case 3:
        // Test case 3: Points with equal y (where those points are the first points)
        //              With a third point that is slightly off to one side.
        //              Requires a special case for the first points to prevent errors in finding the replaced arc
        initialPoints.push(new VPoint(320, 200));
        initialPoints.push(new VPoint(200, 300));
        initialPoints.push(new VPoint(400, 300));
        break;

    case 4:
        // Test case 3a: Points with equal y (where those points are the first points).
        //               With a third point that exactly lines up with the edge between the first 2.
        //               Requires the special case for edges that intersect at both of their starting points (they should not be counted as intersecting).
        initialPoints.push(new VPoint(300, 200));
        initialPoints.push(new VPoint(200, 300));
        initialPoints.push(new VPoint(400, 300));
        break;

    case 5:
        // Test case 3b: 3 points with equal y (and nothing else)
        initialPoints.push(new VPoint(300, 300));
        initialPoints.push(new VPoint(200, 300));
        initialPoints.push(new VPoint(400, 300));
        break;

    case 6:
        // Test case 4: A completely-surrounded site
        initialPoints.push(new VPoint(100, 100));
        initialPoints.push(new VPoint(500, 150));
        initialPoints.push(new VPoint(300, 300));
        initialPoints.push(new VPoint(100, 550));
        initialPoints.push(new VPoint(500, 500));
        break;

    case 7:
        // Test case 5: An arc gets squeezed by a later-created arc before it would be squeezed by its original edges.
        //              Requires handling of events that get "pre-empted" and are no longer required by the time they would execute.
        initialPoints.push(new VPoint(300, 500));
        initialPoints.push(new VPoint(200, 450));
        initialPoints.push(new VPoint(400, 450));
        initialPoints.push(new VPoint(300, 400));
        break;

    default:
        break;
    }

    return initialPoints;
};

export default testPoints;
