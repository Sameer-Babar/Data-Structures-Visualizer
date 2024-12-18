import React, { useState, useEffect } from "react";
import DoublyLinkedList from "./DoublyLinkedList"; // Assume this contains the logic for the doubly linked list
import "./DoublyLinkedListVisualizer.css";

const DoublyLinkedListVisualizer = () => {
  const [linkedList] = useState(new DoublyLinkedList());
  const [inputValue, setInputValue] = useState("");
  const [indexValue, setIndexValue] = useState("");
  const [log, setLog] = useState("");
  const [listItems, setListItems] = useState([]);
  const [showIndexInput, setShowIndexInput] = useState(false);
  const [action, setAction] = useState(""); // Action can be "insert" or "delete"
  const [animatedIndex, setAnimatedIndex] = useState(null);

  // Update the visual representation of the linked list
  const updateListItems = () => {
    const items = [];
    let current = linkedList.head;
    while (current) {
      items.push(current.data);
      current = current.next;
    }
    setListItems(items);
  };

  const handleAnimation = (index) => {
    setAnimatedIndex(index);
    setTimeout(() => setAnimatedIndex(null), 500); // Remove the animation class after 500ms
  };

  // Handle insertion at the head
  const handleInsertAtHead = () => {
    if (inputValue.trim() === "") {
      setLog("Please enter a value to insert.");
      return;
    }
    linkedList.insertAtHead(inputValue);
    updateListItems();
    handleAnimation(0); // Animate the head node
    setLog(`Inserted "${inputValue}" at the head.`);
    setInputValue("");
  };

  // Handle insertion at the tail
  const handleInsertAtTail = () => {
    if (inputValue.trim() === "") {
      setLog("Please enter a value to insert.");
      return;
    }
    linkedList.insertAtEnd(inputValue);
    updateListItems();
    handleAnimation(listItems.length); // Animate the new tail node
    setLog(`Inserted "${inputValue}" at the tail.`);
    setInputValue("");
  };

  // Handle deletion from the head
  const handleDeleteFromHead = () => {
    if (!linkedList.head) {
      setLog("Cannot delete from an empty list.");
      return;
    }
    handleAnimation(0); // Animate the head node
    setTimeout(() => {
      linkedList.deleteFromHead();
      updateListItems();
      setLog("Deleted the head.");
    }, 500); // Wait for the animation to complete
  };

  // Handle deletion from the tail
  const handleDeleteFromTail = () => {
    if (!linkedList.head) {
      setLog("Cannot delete from an empty list.");
      return;
    }
    handleAnimation(listItems.length - 1); // Animate the tail node
    setTimeout(() => {
      linkedList.deleteFromEnd();
      updateListItems();
      setLog("Deleted the tail.");
    }, 500); // Wait for the animation to complete
  };

  // Handle insertion at a specific index
// Handle insertion at a specific index for doubly linked list
const handleInsertAtIndex = () => {
  if (inputValue.trim() === "" || indexValue.trim() === "") {
    setLog("Please enter both value and index.");
    return;
  }

  const index = parseInt(indexValue, 10);
  const size = linkedList.getSize(); // Use getSize to determine the list size

  if (isNaN(index) || index < 0 || index > size) {
    setLog(`Invalid index. Please enter a valid index between 0 and ${size}.`);
    return;
  }

  linkedList.insertAtIndex(inputValue, index);
  updateListItems();
  handleAnimation(index); // Animate the inserted node
  setLog(`Inserted "${inputValue}" at index ${index}.`);
  setInputValue("");
  setIndexValue("");
  setShowIndexInput(false); // Hide the index input
};

// Handle deletion from a specific index for doubly linked list
const handleDeleteFromIndex = () => {
  if (indexValue.trim() === "") {
    setLog("Please enter an index.");
    return;
  }

  const index = parseInt(indexValue, 10);
  const size = linkedList.getSize(); // Use getSize to determine the list size

  if (isNaN(index) || index < 0 || index >= size) {
    setLog(`Invalid index. Please enter a valid index between 0 and ${size - 1}.`);
    return;
  }

  handleAnimation(index); // Animate the deleted node
  setTimeout(() => {
    linkedList.deleteFromIndex(index);
    updateListItems();
    setLog(`Deleted node at index ${index}.`);
    setIndexValue("");
    setShowIndexInput(false); // Hide the index input
  }, 500); // Wait for the animation to complete
};


  // Show or hide index input field based on selected action
  const handleActionClick = (selectedAction) => {
    setAction(selectedAction);
    setShowIndexInput(true);
  };
  return (
    <div className="doubly-linkedlist-container">
      <h1>Doubly Linked List Visualizer</h1>
      <div className="linkedlist-viewport">
        <div className="linkedlist">
          {listItems.map((item, index) => (
            <div
              key={index}
              className={`node-container ${
                index === animatedIndex ? "node-animated" : ""
              }`}
            >
              {index > 0 && <div className="arrow">&larr;</div>}
              <div className="node">{item}</div>
              {index < listItems.length - 1 && <div className="arrow">&rarr;</div>}
            </div>
          ))}
        </div>
      </div>
      <div className="controls">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value"
        />
        {showIndexInput && (
          <input
            type="text"
            value={indexValue}
            onChange={(e) => setIndexValue(e.target.value)}
            placeholder="Enter index"
          />
        )}
        <button onClick={handleInsertAtHead}>Insert at Head</button>
        <button onClick={handleInsertAtTail}>Insert at Tail</button>
        <button onClick={handleDeleteFromHead}>Delete from Head</button>
        <button onClick={handleDeleteFromTail}>Delete from Tail</button>
        <button onClick={() => handleActionClick("insert")}>Insert at Index</button>
        <button onClick={() => handleActionClick("delete")}>Delete from Index</button>
        {showIndexInput && action === "insert" && (
          <button onClick={handleInsertAtIndex}>Confirm Insert</button>
        )}
        {showIndexInput && action === "delete" && (
          <button onClick={handleDeleteFromIndex}>Confirm Delete</button>
        )}
      </div>
      <div className="log">{log}</div>
    </div>
  );
  
};

export default DoublyLinkedListVisualizer;
