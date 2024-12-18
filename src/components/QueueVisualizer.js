import React, { useState } from "react";
import Queue from "./Queue";
import "./QueueVisualizer.css";

const QueueVisualizer = () => {
  const [queue] = useState(new Queue());
  const [inputValue, setInputValue] = useState("");
  const [log, setLog] = useState("");
  const [queueItems, setQueueItems] = useState(queue.getItems());
  const [removedItemIndex, setRemovedItemIndex] = useState(null);

  const handleEnqueue = () => {
    if (inputValue.trim() === "") {
      setLog("Please enter a value to enqueue.");
      return;
    }
    queue.enqueue(inputValue);
    setQueueItems(queue.getItems());
    setLog(`Enqueued: "${inputValue}". The value was added to the end of the queue.`);
    setInputValue("");
  };

  const handleDequeue = () => {
    if (queue.isEmpty()) {
      setLog("Cannot dequeue. The queue is empty.");
      return;
    }
  
    setRemovedItemIndex(0); // Always dequeue from the front
    setTimeout(() => {
      const removed = queue.dequeue();
      setQueueItems(queue.getItems());
      setLog(`Dequeued: "${removed}". The value was removed from the front of the queue.`);
      setRemovedItemIndex(null);
    }, 500); // Match the fade-out animation duration
  };
  
  const handlePeek = () => {
    if (queue.isEmpty()) {
      setLog("Cannot peek. The queue is empty.");
      return;
    }
  
    const front = queue.peek();
    setLog(`Peeked: "${front}". This is the front value of the queue.`);
  
    // Directly target the first item in the queue, even if it's the only item
    const queueItemsElements = document.querySelectorAll('.queue-item');
    if (queueItemsElements.length > 0) {
      const firstItemElement = queueItemsElements[0]; // Always target the first element
      firstItemElement.classList.add('peek-animation');
      
      // Remove the animation after it finishes
      setTimeout(() => {
        firstItemElement.classList.remove('peek-animation');
      }, 1000); // Duration of animation (1 second)
    }
  };
  
  
  
  

  return (
    <div className="queue-container">
      <h1>Queue Visualizer</h1>
      <div className="queue">
  {queueItems.length === 0 ? (
    <div className="queue-empty">Queue is empty</div>
  ) : (
    queueItems.map((item, index) => (
      <div
        key={index}
        className={`queue-item ${
          index === removedItemIndex
            ? "queue-item-removed"
            : index === queueItems.length - 1
            ? "queue-item-added"
            : ""
        }`}
      >
        {item}
      </div>
    ))
  )}
</div>
      <div className="controls">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value"
        />
        <button onClick={handleEnqueue}>Enqueue</button>
        <button onClick={handleDequeue}>Dequeue</button>
        <button onClick={handlePeek}>Peek</button>
      </div>
      <div className="log">{log}</div>
    </div>
  );
};

export default QueueVisualizer;
