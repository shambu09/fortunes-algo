import "jest";
import PriorityQueue from "../src/PriorityQueue";

describe("Priority Queue", () => {
    it("can be constructed", () => {
        const pq = new PriorityQueue(
            (node: { priority: number }) => node.priority
        );
    });

    it("can push and pop from the internal container", () => {
        interface INode {
            value: number;
            priority: number;
        }

        let nodes: Array<INode> = [
            { value: 1, priority: 15 },
            { value: 2, priority: 11 },
            { value: 3, priority: 5 },
            { value: 4, priority: 25 },
        ];

        const pq = new PriorityQueue((node: INode) => node.priority);
        pq.push(nodes[0]);
        pq.push(nodes[1]);
        pq.push(nodes[2]);

        expect(pq.container.length).toBe(3);
        pq.pop();

        expect(pq.container.length).toBe(2);
        pq.pop();
        pq.pop();
        expect(pq.container.length).toBe(0);

        expect(pq.pop()).toBeUndefined();
        expect(pq.container.length).toBe(0);
    });

    it("pops node based on its priority", () => {
        interface INode {
            value: number;
            priority: number;
        }

        let nodes: Array<INode> = [
            { value: 1, priority: 15 },
            { value: 2, priority: 11 },
            { value: 3, priority: 5 },
            { value: 4, priority: 8 },
            { value: 5, priority: 8 },
        ];

        const pq = new PriorityQueue((node: INode) => node.priority);

        pq.push(nodes[0]);
        pq.push(nodes[1]);
        pq.push(nodes[2]);
        pq.push(nodes[3]);
        pq.push(nodes[4]);

        expect(pq.container.length).toBe(5);
        expect(pq.pop()).toStrictEqual(nodes[2]);
        expect(pq.pop()?.priority).toStrictEqual(nodes[3].priority);
        expect(pq.pop()?.priority).toStrictEqual(nodes[3].priority);
        expect(pq.pop()).toStrictEqual(nodes[1]);
        expect(pq.pop()).toStrictEqual(nodes[0]);
        expect(pq.pop()).toBeUndefined();
        expect(pq.container.length).toBe(0);
    });
});
