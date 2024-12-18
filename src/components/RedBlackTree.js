class RedBlackTree {
  constructor() {
    this.root = null;
    this.NULL_LEAF = new RedBlackTreeNode(null, "BLACK");
    this.log = [];
  }

  getLogs() {
    return this.log;
  }

  // Insert function
  insert(value) {
    // If the tree is empty, insert the value as the root node
    if (!this.root || this.root === this.NULL_LEAF) {
      const newNode = new RedBlackTreeNode(value, "RED", this.NULL_LEAF, this.NULL_LEAF);
      this.root = newNode;
      this.root.color = "BLACK"; // Root is always black in Red-Black Tree
      this.log.push("Tree was empty, inserted as root and colored BLACK.");
      return;
    }
  
    // Search for the correct position to insert the new node
    let parent = null;
    let current = this.root;
  
    while (current !== this.NULL_LEAF) {
      // If the value is already in the tree, log it and return
      if (current.data === value) {
        this.log.push(`Duplicate value detected: ${value}. Insertion aborted.`);
        return; // Do not insert duplicate values
      }
  
      parent = current;
      current = value < current.data ? current.left : current.right;
    }
  
    // Insert the new node
    const newNode = new RedBlackTreeNode(value, "RED", this.NULL_LEAF, this.NULL_LEAF);
    newNode.parent = parent;
    if (value < parent.data) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }
  
    this.log.push(`Inserted ${value} as ${value < parent.data ? "left" : "right"} child of ${parent.data}.`);
  
    // Fix any violations of the Red-Black Tree properties
    this.fixInsert(newNode);
  }
  

  fixInsert(node) {
    while (node.parent && node.parent.color === "RED") {
      const grandparent = node.parent.parent;

      if (node.parent === grandparent.left) {
        const uncle = grandparent.right;

        if (uncle && uncle.color === "RED") {
          this.log.push("Case 1: Uncle is RED. Recolor parent, uncle, and grandparent.");
          node.parent.color = "BLACK";
          uncle.color = "BLACK";
          grandparent.color = "RED";
          node = grandparent;
        } else {
          if (node === node.parent.right) {
            this.log.push("Case 2: Node is right child, rotate left.");
            node = node.parent;
            this.rotateLeft(node);
          }
          this.log.push("Case 3: Node is left child, rotate right and recolor.");
          node.parent.color = "BLACK";
          grandparent.color = "RED";
          this.rotateRight(grandparent);
        }
      } else {
        const uncle = grandparent.left;

        if (uncle && uncle.color === "RED") {
          this.log.push("Case 1: Uncle is RED. Recolor parent, uncle, and grandparent.");
          node.parent.color = "BLACK";
          uncle.color = "BLACK";
          grandparent.color = "RED";
          node = grandparent;
        } else {
          if (node === node.parent.left) {
            this.log.push("Case 2: Node is left child, rotate right.");
            node = node.parent;
            this.rotateRight(node);
          }
          this.log.push("Case 3: Node is right child, rotate left and recolor.");
          node.parent.color = "BLACK";
          grandparent.color = "RED";
          this.rotateLeft(grandparent);
        }
      }
    }
    this.root.color = "BLACK";
  }

  delete(value) {
    let node = this.searchNode(this.root, value);
    if (!node || node === this.NULL_LEAF) {
      this.log.push(`Value ${value} not found.`);
      return;
    }

    this.log.push(`Deleting node with value ${value}.`);
    let y = node;
    let yOriginalColor = y.color;
    let x;

    if (node.left === this.NULL_LEAF) {
      x = node.right;
      this.transplant(node, node.right);
      this.log.push("Node has no left child, transplant right child.");
    } else if (node.right === this.NULL_LEAF) {
      x = node.left;
      this.transplant(node, node.left);
      this.log.push("Node has no right child, transplant left child.");
    } else {
      y = this.minimum(node.right);
      yOriginalColor = y.color;
      x = y.right;
      if (y.parent === node) {
        x.parent = y;
      } else {
        this.transplant(y, y.right);
        y.right = node.right;
        y.right.parent = y;
      }
      this.transplant(node, y);
      y.left = node.left;
      y.left.parent = y;
      y.color = node.color;
      this.log.push("Node has two children, replaced with in-order successor.");
    }

    if (yOriginalColor === "BLACK") {
      this.log.push("Deleted node was BLACK, fixing tree properties.");
      this.fixDelete(x);
    }

    if (this.root === node) {
      this.root = null;
    }
  }

  fixDelete(node) {
    while (node !== this.root && node.color === "BLACK") {
      if (node === node.parent.left) {
        let sibling = node.parent.right;

        if (sibling.color === "RED") {
          this.log.push("Case 1: Sibling is RED, recolor and rotate left.");
          sibling.color = "BLACK";
          node.parent.color = "RED";
          this.rotateLeft(node.parent);
          sibling = node.parent.right;
        }

        if (
          sibling.left.color === "BLACK" &&
          sibling.right.color === "BLACK"
        ) {
          this.log.push("Case 2: Sibling's children are BLACK, recolor sibling.");
          sibling.color = "RED";
          node = node.parent;
        } else {
          if (sibling.right.color === "BLACK") {
            this.log.push("Case 3: Sibling's right child is BLACK, rotate right.");
            sibling.left.color = "BLACK";
            sibling.color = "RED";
            this.rotateRight(sibling);
            sibling = node.parent.right;
          }
          this.log.push("Case 4: Sibling's right child is RED, recolor and rotate left.");
          sibling.color = node.parent.color;
          node.parent.color = "BLACK";
          sibling.right.color = "BLACK";
          this.rotateLeft(node.parent);
          node = this.root;
        }
      } else {
        let sibling = node.parent.left;

        if (sibling.color === "RED") {
          this.log.push("Case 1: Sibling is RED, recolor and rotate right.");
          sibling.color = "BLACK";
          node.parent.color = "RED";
          this.rotateRight(node.parent);
          sibling = node.parent.left;
        }

        if (
          sibling.left.color === "BLACK" &&
          sibling.right.color === "BLACK"
        ) {
          this.log.push("Case 2: Sibling's children are BLACK, recolor sibling.");
          sibling.color = "RED";
          node = node.parent;
        } else {
          if (sibling.left.color === "BLACK") {
            this.log.push("Case 3: Sibling's left child is BLACK, rotate left.");
            sibling.right.color = "BLACK";
            sibling.color = "RED";
            this.rotateLeft(sibling);
            sibling = node.parent.left;
          }
          this.log.push("Case 4: Sibling's left child is RED, recolor and rotate right.");
          sibling.color = node.parent.color;
          node.parent.color = "BLACK";
          sibling.left.color = "BLACK";
          this.rotateRight(node.parent);
          node = this.root;
        }
      }
    }
    node.color = "BLACK";
  }

  // Utility methods
  rotateLeft(node) {
    const rightChild = node.right;
    node.right = rightChild.left;

    if (rightChild.left !== this.NULL_LEAF) {
      rightChild.left.parent = node;
    }

    rightChild.parent = node.parent;

    if (!node.parent) {
      this.root = rightChild;
    } else if (node === node.parent.left) {
      node.parent.left = rightChild;
    } else {
      node.parent.right = rightChild;
    }

    rightChild.left = node;
    node.parent = rightChild;
  }

  rotateRight(node) {
    const leftChild = node.left;
    node.left = leftChild.right;

    if (leftChild.right !== this.NULL_LEAF) {
      leftChild.right.parent = node;
    }

    leftChild.parent = node.parent;

    if (!node.parent) {
      this.root = leftChild;
    } else if (node === node.parent.right) {
      node.parent.right = leftChild;
    } else {
      node.parent.left = leftChild;
    }

    leftChild.right = node;
    node.parent = leftChild;
  }

  transplant(target, replacement) {
    if (!target.parent) {
      this.root = replacement;
    } else if (target === target.parent.left) {
      target.parent.left = replacement;
    } else {
      target.parent.right = replacement;
    }
    replacement.parent = target.parent;
  }

  minimum(node) {
    while (node.left !== this.NULL_LEAF) {
      node = node.left;
    }
    return node;
  }

  searchNode(node, value) {
    while (node !== this.NULL_LEAF && node.data !== value) {
      node = value < node.data ? node.left : node.right;
    }
    return node;
  }
}

class RedBlackTreeNode {
  constructor(data, color = "RED", left = null, right = null, parent = null) {
    this.data = data;
    this.color = color;
    this.left = left;
    this.right = right;
    this.parent = parent;
  }
}
export default RedBlackTree