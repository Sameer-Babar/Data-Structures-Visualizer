class Stack {
    constructor() {
        this.items = [];
    }

    // Push a new element onto the stack
    push(item) {
        this.items.push(item);
    }

    // Pop the top element off the stack
    pop() {
        if (this.isEmpty()) return null;
        return this.items.pop();
    }




    
    // Peek at the top element without removing it
    peek() {
        if (this.isEmpty()) return null;
        return this.items[this.items.length - 1];
    }

    // Check if the stack is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Get the size of the stack
    size() {
        return this.items.length;
    }

    // Clear the stack
    clear() {
        this.items = [];
    }

    // Get all items in the stack
    getItems() {
        return [...this.items];
    }
}

export default Stack;
