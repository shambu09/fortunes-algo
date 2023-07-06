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
            { value: 0, priority: 99999 },
            { value: 1, priority: 15 },
            { value: 2, priority: 11 },
            { value: 3, priority: 5 },
            { value: 4, priority: 8 },
            { value: 5, priority: 1 },
            { value: 6, priority: 1 },
            { value: 7, priority: 21379182 },
            { value: 8, priority: 3 },
            { value: 9, priority: 77 },
            { value: 10, priority: 1002 },
            { value: 11, priority: 901 },
            { value: 12, priority: 0 },
        ];

        const pq = new PriorityQueue((node: INode) => node.priority);

        for (let node of nodes) {
            pq.push(node);
        }

        expect(pq.container.length).toBe(13);
        expect(pq.pop()).toStrictEqual(nodes[12]);
        expect(pq.pop()?.priority).toStrictEqual(nodes[5].priority);
        expect(pq.pop()?.priority).toStrictEqual(nodes[6].priority);
        expect(pq.pop()).toStrictEqual(nodes[8]);
        expect(pq.pop()).toStrictEqual(nodes[3]);

        for (let i = 5; i < 13; i++) {
            pq.pop();
        }

        expect(pq.pop()).toBeUndefined();
        expect(pq.container.length).toBe(0);
    });
});
