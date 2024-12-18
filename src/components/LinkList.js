export class Node {
    constructor(data) {
      this.data = data;
      this.next = null;
    }
  }
  
  export default class LinkList {
    constructor() {
      this.head = null;
    }
  
    insertAtHead(data) {
      if (this.head === null) {
        this.head = new Node(data);
      } else {
        let node = new Node(data);
        node.next = this.head;
        this.head = node;
      }
    }
  
    inserAtEnd(data) {
      let newNode = new Node(data);
      if (this.head === null) {
        this.head = newNode;
      } else if (this.head.next === null) {
        this.head.next = newNode;
      } else {
        let current = this.head;
        while (current.next !== null) {
          current = current.next;
        }
        current.next = newNode;
      }
    }
  
    insertAtIndex(data, index) {
     
      if (index < 0) return null;
      if (index === 0) {
        return this.insertAtHead(data);
      } else {
        let newNode = new Node(data);
        let current = this.head;
        let count = 0;
        while (current.next !== null && count < index - 1) {
          current = current.next;
          count++;
        }
        if (current !== null) {
          newNode.next = current.next;
          current.next = newNode;
        }
      }
    }
  
    deleteFromHead() {
      if (this.head === null) {
        return null;
      } else {
        this.head = this.head.next;
      }
    }
  
    deleteFromEnd() {
      if (this.head.next === null) {
        return this.deleteFromHead();
      } else {
        let current = this.head;
        while (current.next.next !== null) {
          current = current.next;
        }
        current.next = null;
      }
    }
  
    deleteFromIndex(index) {
      if (index === 0) {
        return this.deleteFromHead();
      } else {
        let current = this.head;
        let count = 0;
        while (current !== null && count < index - 1) {
          current = current.next;
          count++;
        }
        if (current !== null) {
          current.next = current.next.next;
        }
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
  