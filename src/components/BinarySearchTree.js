class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(data) {
    const newNode = new Node(data);
  
    if (this.root === null) {
      this.root = newNode;
      return true; // Successfully inserted at the root
    } else {
      return this.insertNode(this.root, newNode); // Handle insertion and return result
    }
  }
  

  insertNode(node, newNode) {
    // If the new node's value is a duplicate, return null
    if (newNode.data === node.data) {
      return null; // Duplicate value, do nothing
    }
  
    if (newNode.data < node.data) {
      if (node.left === null) {
        node.left = newNode;
        newNode.parent = node; // Update parent pointer
        return true; // Successfully inserted
      } else {
        return this.insertNode(node.left, newNode); // Recursively insert in the left subtree
      }
    } else {
      if (node.right === null) {
        node.right = newNode;
        newNode.parent = node; // Update parent pointer
        return true; // Successfully inserted
      } else {
        return this.insertNode(node.right, newNode); // Recursively insert in the right subtree
      }
    }
  }
  
  
  

  delete(data) {
    this.root = this.deleteNode(this.root, data);
  }

  deleteNode(node, data) {
    if (node === null) {
      return null;
    }

    if (data < node.data) {
      node.left = this.deleteNode(node.left, data);
      return node;
    } else if (data > node.data) {
      node.right = this.deleteNode(node.right, data);
      return node;
    } else {
      if (node.left === null && node.right === null) {
        return null;
      }

      if (node.left === null) {
        return node.right;
      } else if (node.right === null) {
        return node.left;
      }

      const temp = this.findMinNode(node.right);
      node.data = temp.data;
      node.right = this.deleteNode(node.right, temp.data);
      return node;
    }
  }

  findMinNode(node) {
    while (node && node.left !== null) {
      node = node.left;
    }
    return node;
  }

  inorder(node = this.root, result = []) {
    if (node) {
      this.inorder(node.left, result);
      result.push(node.data);
      this.inorder(node.right, result);
    }
    return result;
  }
  preorder(node = this.root, result = []) {
    if (node) {
      result.push(node.data);         
      this.preorder(node.left, result); 
      this.preorder(node.right, result); 
    }
    return result;
  }
  
  postorder(node = this.root, result = []) {
    if (node) {
      this.postorder(node.left, result); 
      this.postorder(node.right, result); 
      result.push(node.data);         
    }
    return result;
  }

 // Left Rotation
leftRotate(x) {
  const y = x.right; 
  if (!y) return; 

  x.right = y.left; 
  if (y.left) y.left.parent = x; 

  y.parent = x.parent; 
  if (!x.parent) {
    this.root = y; 
  } else if (x === x.parent.left) {
    x.parent.left = y; 
  } else {
    x.parent.right = y; 
  }

  y.left = x; 
  x.parent = y; 
}

// Right Rotation
rightRotate(y) {
  const x = y.left; 
  if (!x) return; 

  y.left = x.right; 
  if (x.right) x.right.parent = y; 

  x.parent = y.parent; 
  if (!y.parent) {
    this.root = x; 
  } else if (y === y.parent.left) {
    y.parent.left = x; 
  } else {
    y.parent.right = x; 
  }

  x.right = y; 
  y.parent = x; 
}


  
  isRotationPossible(node, direction) {
    if (direction === 'left' && node.right) {
      return true;
    }
    if (direction === 'right' && node.left) {
      return true;
    }
    return false;
  }
}

class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
    this.parent = null; 
  }
}

export default BinarySearchTree;
