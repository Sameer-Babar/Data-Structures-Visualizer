class AVLTree {
    constructor() {
        this.root = null;
        this.rotationEvents = [];
    }

    insertValue(value) {
        this.rotationEvents = [];
        this.root = this.insert(this.root, value);
    }

    insertValueWithRotations(value) {
        this.rotationEvents = [];
        this.root = this.insert(this.root, value, this.rotationEvents);
        return this.rotationEvents; // Return rotation events for animation
    }

    deleteValue(value) {
        this.rotationEvents = [];
        this.root = this.delete(this.root, value, this.rotationEvents);
        return this.rotationEvents; // Return rotation events for animation
    }

    insert(node, value, traversalSequence = []) {
        if (!node) {
            traversalSequence.push({
                type: "inserted",
                node: value,
                affectedNodes: [value],
            });
            return new Node(value);
        }

        traversalSequence.push({
            type: "visited",
            node: node.value,
            affectedNodes: [node.value],
        });

        if (value < node.value) {
            node.left = this.insert(node.left, value, traversalSequence);
        } else if (value > node.value) {
            node.right = this.insert(node.right, value, traversalSequence);
        } else {
            return node; // Duplicate values not allowed
        }

        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));

        const balance = this.getBalance(node);

        // Left heavy
        if (balance > 1 && value < node.left.value) {
            traversalSequence.push({
                type: "right-rotation",
                node: node.value,
                affectedNodes: [node.value, node.left.value],
            });
            return this.rightRotate(node);
        }

        // Right heavy
        if (balance < -1 && value > node.right.value) {
            traversalSequence.push({
                type: "left-rotation",
                node: node.value,
                affectedNodes: [node.value, node.right.value],
            });
            return this.leftRotate(node);
        }

        // Left-right
        if (balance > 1 && value > node.left.value) {
            traversalSequence.push({
                type: "left-right-rotation",
                node: node.value,
                affectedNodes: [node.value, node.left.value, node.left.right.value],
            });
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }

        // Right-left
        if (balance < -1 && value < node.right.value) {
            traversalSequence.push({
                type: "right-left-rotation",
                node: node.value,
                affectedNodes: [node.value, node.right.value, node.right.left.value],
            });
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    delete(node, value, traversalSequence = []) {
        // Step 1: Perform normal BST delete
        if (!node) return node;

        traversalSequence.push({
            type: "visited",
            node: node.value,
            affectedNodes: [node.value],
        });

        if (value < node.value) {
            node.left = this.delete(node.left, value, traversalSequence);
        } else if (value > node.value) {
            node.right = this.delete(node.right, value, traversalSequence);
        } else {
            // Node to be deleted found
            if (!node.left || !node.right) {
                const temp = node.left ? node.left : node.right;
                node = temp; // Copy the non-null child or null
            } else {
                // Node with two children: Get the inorder successor
                const temp = this.minValueNode(node.right);

                // Copy the inorder successor's content to this node
                node.value = temp.value;

                // Delete the inorder successor
                node.right = this.delete(node.right, temp.value, traversalSequence);
            }
        }

        if (!node) return node;

        // Step 2: Update height and balance the tree
        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));

        const balance = this.getBalance(node);

        // Left heavy
        if (balance > 1 && this.getBalance(node.left) >= 0) {
            traversalSequence.push({
                type: "right-rotation",
                node: node.value,
                affectedNodes: [node.value, node.left.value],
            });
            return this.rightRotate(node);
        }

        // Right heavy
        if (balance < -1 && this.getBalance(node.right) <= 0) {
            traversalSequence.push({
                type: "left-rotation",
                node: node.value,
                affectedNodes: [node.value, node.right.value],
            });
            return this.leftRotate(node);
        }

        // Left-right
        if (balance > 1 && this.getBalance(node.left) < 0) {
            traversalSequence.push({
                type: "left-right-rotation",
                node: node.value,
                affectedNodes: [node.value, node.left.value, node.left.right.value],
            });
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }

        // Right-left
        if (balance < -1 && this.getBalance(node.right) > 0) {
            traversalSequence.push({
                type: "right-left-rotation",
                node: node.value,
                affectedNodes: [node.value, node.right.value, node.right.left.value],
            });
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    minValueNode(node) {
        let current = node;
        while (current.left) {
            current = current.left;
        }
        return current;
    }

    leftRotate(z) {
        const y = z.right;
        const T2 = y.left;

        y.left = z;
        z.right = T2;

        z.height = 1 + Math.max(this.getHeight(z.left), this.getHeight(z.right));
        y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right));

        return y;
    }

    rightRotate(z) {
        const y = z.left;
        const T3 = y.right;

        y.right = z;
        z.left = T3;

        z.height = 1 + Math.max(this.getHeight(z.left), this.getHeight(z.right));
        y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right));

        return y;
    }

    getHeight(node) {
        return node ? node.height : 0;
    }

    getBalance(node) {
        return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
    }
}

class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

export { AVLTree };
