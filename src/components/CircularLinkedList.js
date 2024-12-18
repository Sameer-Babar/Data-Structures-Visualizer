class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class CircularLinkedList {
    constructor() {
        this.head = null;
    }

    insertAtHead(data) {
        const newNode = new Node(data);
        if (this.head === null) {
            this.head = newNode;
            newNode.next = this.head; // Point to itself
        } else {
            let current = this.head;
            while (current.next !== this.head) {
                current = current.next;
            }
            newNode.next = this.head;
            current.next = newNode; // Close the circle
            this.head = newNode;
        }
    }

    insertAtEnd(data) {
        if (this.head === null) {
            this.insertAtHead(data);
        } else {
            const newNode = new Node(data);
            let current = this.head;
            while (current.next !== this.head) {
                current = current.next;
            }
            current.next = newNode;
            newNode.next = this.head; // Close the circle
        }
    }

    insertAtIndex(data, index) {
        if (index < 0) return; // Invalid index

        if (index === 0) {
            this.insertAtHead(data);
            return;
        }

        const newNode = new Node(data);
        let current = this.head;
        let count = 0;

        // Traverse the list to find the node before the desired index
        while (current.next !== this.head && count < index - 1) {
            current = current.next;
            count++;
        }

        if (count === index - 1) {
            newNode.next = current.next;
            current.next = newNode;
        } else {
            console.log("Index out of bounds");
        }
    }

    deleteFromHead() {
        if (this.head === null) return;

        if (this.head.next === this.head) {
            this.head = null;
        } else {
            let current = this.head;
            while (current.next !== this.head) {
                current = current.next;
            }
            current.next = this.head.next; // Close the circle after deleting head
            this.head = this.head.next;
        }
    }

    deleteFromEnd() {
        if (this.head === null) return;

        if (this.head.next === this.head) {
            this.head = null;
        } else {
            let current = this.head;
            while (current.next.next !== this.head) {
                current = current.next;
            }
            current.next = this.head; // Remove last node and close the circle
        }
    }

    deleteFromIndex(index) {
        if (index < 0 || this.head === null) return;

        if (index === 0) {
            this.deleteFromHead();
            return;
        }

        let current = this.head;
        let count = 0;

        // Traverse the list to find the node before the desired index
        while (current.next !== this.head && count < index - 1) {
            current = current.next;
            count++;
        }

        if (current.next !== this.head && count === index - 1) {
            current.next = current.next.next; // Remove the node at the index
        }
    }

    toArray() {
        const result = [];
        if (this.head === null) return result;

        let current = this.head;
        do {
            result.push(current.data);
            current = current.next;
        } while (current !== this.head);
        return result;
    }
}

export default CircularLinkedList;
