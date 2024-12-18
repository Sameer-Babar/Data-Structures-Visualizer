class Node {
    constructor(data) {
      this.data = data;
      this.next = null;
      this.prev = null;
    }
  }
  
  class DoublyLinkedList {
    constructor() {
      this.head = null;
    }
  
    // Insert a new node at the head
    insertAtHead(data) {
      if (this.head === null) {
        this.head = new Node(data);
      } else {
        let newNode = new Node(data);
        newNode.next = this.head;
        this.head.prev = newNode;
        this.head = newNode;
      }
    }
  
    // Insert a new node at the end
    insertAtEnd(data) {
      if (this.head === null) {
        return this.insertAtHead(data);
      } else {
        let newNode = new Node(data);
        let current = this.head;
        while (current.next !== null) {
          current = current.next;
        }
        current.next = newNode;
        newNode.prev = current;
      }
    }
  
    // Insert a new node at a specific index
    insertAtIndex(data, index) {
      if (index < 0) {
        throw new Error("Index cannot be negative");
      }
  
      if (index === 0) {
        return this.insertAtHead(data);
      }
  
      let current = this.head;
      let count = 0;
  
      // Traverse the list to find the correct index
      while (current !== null && count < index - 1) {
        current = current.next;
        count++;
      }
  
      if (current === null) {
        throw new Error("Index out of bounds");
      }
  
      let newNode = new Node(data);
      newNode.next = current.next;
  
      if (current.next !== null) {
        current.next.prev = newNode;
      }
  
      current.next = newNode;
      newNode.prev = current;
    }
  
    // Delete a node from the head
    deleteFromHead() {
      if (this.head === null) {
        throw new Error("List is empty");
      }
      if (this.head.next === null) {
        this.head = null;
      } else {
        this.head = this.head.next;
        this.head.prev = null;
      }
    }
  
    // Delete a node from the end
    deleteFromEnd() {
      if (this.head === null) {
        throw new Error("List is empty");
      }
      if (this.head.next === null) {
        this.head = null;
      } else {
        let current = this.head;
        while (current.next !== null) {
          current = current.next;
        }
        current.prev.next = null;
      }
    }
  
    // Delete a node from a specific index
    deleteFromIndex(index) {
      if (index < 0) {
        throw new Error("Index cannot be negative");
      }
  
      if (this.head === null) {
        throw new Error("List is empty");
      }
  
      if (index === 0) {
        return this.deleteFromHead();
      }
  
      let current = this.head;
      let count = 0;
  
      // Traverse the list to find the correct index
      while (current !== null && count < index) {
        current = current.next;
        count++;
      }
  
      if (current === null) {
        throw new Error("Index out of bounds");
      }
  
      if (current.next !== null) {
        current.next.prev = current.prev;
      }
      if (current.prev !== null) {
        current.prev.next = current.next;
      }
    }
  
   getSize(){
    let current = this.head
    let count = 0
    while(current!==null){
      current = current.next
      count++
    }
    return count
   }
   
  }
  
  export default DoublyLinkedList;
  