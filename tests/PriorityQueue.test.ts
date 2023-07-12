import "jest";
import PriorityQueue from "../src/PriorityQueue";

describe("Priority Queue - Lower Priority First", () => {
    it("can be constructed", () => {
        new PriorityQueue(
            (node1: { priority: number }, node2: { priority: number }) =>
                node1.priority < node2.priority
        );
    });

    it("can push and pop from the internal container", () => {
        interface INode {
            value: number;
            priority: number;
        }

        const nodes: Array<INode> = [
            { value: 1, priority: 15 },
            { value: 2, priority: 11 },
            { value: 3, priority: 5 },
            { value: 4, priority: 25 },
        ];

        const pq = new PriorityQueue(
            (node1: INode, node2: INode) => node1.priority < node2.priority
        );

        pq.push(nodes[0]);
        pq.push(nodes[1]);
        pq.push(nodes[2]);

        expect(pq.length).toBe(3);
        pq.pop();

        expect(pq.length).toBe(2);
        pq.pop();
        pq.pop();
        expect(pq.length).toBe(0);

        expect(pq.pop()).toBeUndefined();
        expect(pq.length).toBe(0);
    });

    it("returns elements in the correct priority order #1", () => {
        interface INode {
            value: number;
            priority: number;
        }

        const nodes: Array<INode> = [
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

        const pq = new PriorityQueue(
            (node1: INode, node2: INode) => node1.priority < node2.priority
        );

        for (const node of nodes) {
            pq.push(node);
        }

        expect(pq.length).toBe(13);
        expect(pq.pop()).toStrictEqual(nodes[12]);
        expect(pq.pop()?.priority).toStrictEqual(nodes[5].priority);
        expect(pq.pop()?.priority).toStrictEqual(nodes[6].priority);
        expect(pq.pop()).toStrictEqual(nodes[8]);
        expect(pq.pop()).toStrictEqual(nodes[3]);

        for (let i = 5; i < 13; i++) {
            pq.pop();
        }

        expect(pq.pop()).toBeUndefined();
        expect(pq.length).toBe(0);
    });

    it("returns elements in the correct priority order #2", () => {
        interface INode {
            value: string;
            priority: number;
        }

        const nodes: INode[] = [
            { value: "A", priority: 5 },
            { value: "B", priority: 3 },
            { value: "C", priority: 7 },
            { value: "D", priority: 1 },
            { value: "E", priority: 4 },
        ];

        const pq = new PriorityQueue(
            (node1: INode, node2: INode) => node1.priority < node2.priority
        );

        for (const node of nodes) {
            pq.push(node);
        }

        let result = "";
        while (pq.length > 0) {
            result += pq.pop()!.value;
        }

        expect(result).toBe("DBEAC");
    });

    it("handles an empty priority queue correctly", () => {
        const pq = new PriorityQueue();

        expect(pq.length).toBe(0);
        expect(pq.pop()).toBeUndefined();
    });

    it("handles pushing and popping large number of elements", () => {
        const pq = new PriorityQueue();

        const n = 10000;
        for (let i = 0; i < n; i++) {
            pq.push(i);
        }

        expect(pq.length).toBe(n);

        let prev = -1;
        while (pq.length > 0) {
            const curr = pq.pop()!;
            expect(curr).toBeGreaterThan(prev);
            prev = curr;
        }

        expect(pq.length).toBe(0);
    });

    it("handles clearing of queue", () => {
        const pq = new PriorityQueue(
            (node1: { priority: number }, node2: { priority: number }) =>
                node1.priority < node2.priority
        );

        const n = 10;
        for (let i = 0; i < n; i++) {
            pq.push({ priority: i });
        }

        expect(pq.length).toBe(n);

        pq.clear();

        expect(pq.length).toBe(0);
        expect(pq.pop()).toBeUndefined();
        expect(pq.empty()).toBeTruthy();
    });

    it("can check for empty status of the queue", () => {
        const pq = new PriorityQueue();

        const n = 10000;
        for (let i = 0; i < n; i++) {
            pq.push(i);
        }

        expect(pq.length).toBe(n);

        let prev = -1;
        while (pq.length > 0) {
            const curr = pq.pop()!;
            expect(curr).toBeGreaterThan(prev);
            prev = curr;
        }

        expect(pq.empty()).toBeTruthy();
        expect(pq.pop()).toBeUndefined();
        expect(pq.length).toBe(0);
    });
});

describe("Priority Queue - Higher Priority First", () => {
    it("returns elements in the correct priority order - higher priority first", () => {
        interface INode {
            value: string;
            priority: number;
        }

        const nodes: INode[] = [
            { value: "A", priority: 5 },
            { value: "B", priority: 3 },
            { value: "C", priority: 7 },
            { value: "D", priority: 1 },
            { value: "E", priority: 4 },
        ];

        const pq = new PriorityQueue(
            (node1: INode, node2: INode) => node1.priority > node2.priority
        );

        for (const node of nodes) {
            pq.push(node);
        }

        let result = "";
        while (pq.length > 0) {
            result += pq.pop()!.value;
        }

        expect(result).toBe("CAEBD");
    });

    it("handles an empty priority queue correctly", () => {
        const pq = new PriorityQueue<{ value: string; priority: number }>(
            (node1, node2) => node1.priority > node2.priority
        );

        expect(pq.length).toBe(0);
        expect(pq.pop()).toBeUndefined();
    });

    it("handles pushing and popping large number of elements", () => {
        const pq = new PriorityQueue<number>((node1, node2) => node1 > node2);

        const n = 10000;
        for (let i = 0; i < n; i++) {
            pq.push(i);
        }

        expect(pq.length).toBe(n);

        let prev = n;
        while (pq.length > 0) {
            const curr = pq.pop()!;
            expect(curr).toBeLessThan(prev);
            prev = curr;
        }

        expect(pq.length).toBe(0);
    });

    it("handles clearing of queue", () => {
        const pq = new PriorityQueue<{ priority: number }>(
            (node1, node2) => node1.priority > node2.priority
        );

        const n = 10;
        for (let i = 0; i < n; i++) {
            pq.push({ priority: i });
        }

        expect(pq.length).toBe(n);

        pq.clear();

        expect(pq.length).toBe(0);
        expect(pq.pop()).toBeUndefined();
        expect(pq.empty()).toBeTruthy();
    });

    it("can check for empty status of the queue", () => {
        const pq = new PriorityQueue<number>((node1, node2) => node1 > node2);

        const n = 10000;
        for (let i = 0; i < n; i++) {
            pq.push(i);
        }

        expect(pq.length).toBe(n);

        let prev = n;
        while (pq.length > 0) {
            const curr = pq.pop()!;
            expect(curr).toBeLessThan(prev);
            prev = curr;
        }

        expect(pq.empty()).toBeTruthy();
        expect(pq.pop()).toBeUndefined();
        expect(pq.length).toBe(0);
    });
});
