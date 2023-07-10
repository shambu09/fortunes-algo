// Class PriorityQueue
// Implements Priority Queue - Internally uses a Min Heap.

export default class PriorityQueue<T> {
    private readonly container: Array<T>;
    private readonly getPriorityOfNode;

    constructor(key: (_: T) => number) {
        this.container = [];
        this.getPriorityOfNode = key;
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

    private getPriorityAtIndex(index: number): number {
        return this.getPriorityOfNode(this.container[index]);
    }

    private swap(index1: number, index2: number) {
        let temp = this.container[index1];
        this.container[index1] = this.container[index2];
        this.container[index2] = temp;
    }

    private heapifyUp() {
        let currentIndex = this.container.length - 1;

        while (currentIndex > 0) {
            const parentindex = this.getParentIndex(currentIndex);

            if (
                this.getPriorityAtIndex(currentIndex) <
                this.getPriorityAtIndex(parentindex)
            ) {
                this.swap(currentIndex, parentindex);
                currentIndex = parentindex;
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
            let smallerChildIndex = leftChildIndex;

            if (
                rightChildIndex < this.container.length &&
                this.getPriorityAtIndex(leftChildIndex) >
                    this.getPriorityAtIndex(rightChildIndex)
            )
                smallerChildIndex = rightChildIndex;

            if (
                this.getPriorityAtIndex(currentIndex) >
                this.getPriorityAtIndex(smallerChildIndex)
            ) {
                this.swap(currentIndex, smallerChildIndex);
                currentIndex = smallerChildIndex;
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
}
