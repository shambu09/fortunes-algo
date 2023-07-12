// Class PriorityQueue
// Implements Priority Queue - Internally uses a Heap with the optional custom comparator.
// By default pops out nodes with the lowest priority value.

export default class PriorityQueue<T = number> {
    readonly container: Array<T>;
    private readonly comparator;

    constructor(comparator: (_: T, __: T) => boolean = (l, r) => l < r) {
        this.container = [];
        this.comparator = comparator;
    }

    get length(): number {
        return this.container.length;
    }

    private getParentIndex(index: number): number {
        return Math.floor((index - 1) / 2);
    }

    private getLeftChildIndex(index: number): number {
        return 2 * index + 1;
    }

    private getRightChildIndex(index: number): number {
        return 2 * index + 2;
    }

    private compareUsingIndex(index1: number, index2: number): boolean {
        return this.comparator(this.container[index1], this.container[index2]);
    }

    private swap(index1: number, index2: number) {
        const temp = this.container[index1];
        this.container[index1] = this.container[index2];
        this.container[index2] = temp;
    }

    private heapifyUp() {
        let currentIndex = this.container.length - 1;

        while (currentIndex > 0) {
            const parentIndex = this.getParentIndex(currentIndex);

            if (this.compareUsingIndex(currentIndex, parentIndex)) {
                this.swap(currentIndex, parentIndex);
                currentIndex = parentIndex;
            } else {
                break;
            }
        }
    }

    private heapifyDown() {
        let currentIndex = 0;

        while (this.getLeftChildIndex(currentIndex) < this.container.length) {
            const leftChildIndex = this.getLeftChildIndex(currentIndex);
            const rightChildIndex = this.getRightChildIndex(currentIndex);
            let swappableChildIndex = leftChildIndex;

            if (
                rightChildIndex < this.container.length &&
                this.compareUsingIndex(rightChildIndex, leftChildIndex)
            )
                swappableChildIndex = rightChildIndex;

            if (this.compareUsingIndex(swappableChildIndex, currentIndex)) {
                this.swap(currentIndex, swappableChildIndex);
                currentIndex = swappableChildIndex;
            } else {
                break;
            }
        }
    }

    pop(): T | undefined {
        if (this.container.length <= 1) return this.container.pop();

        const result = this.container[0];
        this.container[0] = this.container.pop()!;
        this.heapifyDown();

        return result;
    }

    push(newNode: T) {
        this.container.push(newNode);
        this.heapifyUp();
    }

    clear() {
        this.container.length = 0;
    }

    empty(): boolean {
        return this.length === 0;
    }
}
