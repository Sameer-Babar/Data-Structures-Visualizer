import React, { useState } from "react";
import "./StackVisualizer.css";

const StackVisualizer = () => {
  const [stack, setStack] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [logMessage, setLogMessage] = useState("Welcome! Start by pushing values to the stack.");
  const [highlightIndex, setHighlightIndex] = useState(null); // For "top" highlight
  const [removedIndex, setRemovedIndex] = useState(null); // For "pop" animation

  // Function to push an item onto the stack
  const pushToStack = () => {
    if (inputValue.trim() === "") {
      setLogMessage("Enter a valid value to push!");
      return;
    }
    setStack((prevStack) => {
      const updatedStack = [...prevStack, { value: inputValue, isNew: true }];
      setLogMessage(`Pushed "${inputValue}" to the stack.`);
      return updatedStack;
    });
    setInputValue(""); // Clear input after pushing
    setTimeout(() => {
      setStack((prevStack) =>
        prevStack.map((item) => ({ ...item, isNew: false })) // Remove "isNew" after animation
      );
    }, 300); // Match the animation duration
  };

  // Function to pop an item from the stack
  const popFromStack = () => {
    if (stack.length > 0) {
      setRemovedIndex(stack.length - 1); // Highlight the top element for removal animation
      setTimeout(() => {
        setStack((prevStack) => {
          const updatedStack = prevStack.slice(0, -1); // Remove top element
          setLogMessage(`Popped "${prevStack[prevStack.length - 1].value}" from the stack.`);
          return updatedStack;
        });
        setRemovedIndex(null); // Reset the removed index after animation
      }, 300); // Match the animation duration
    } else {
      setLogMessage("Stack is empty! Nothing to pop.");
    }
  };

  // Function to get the top element of the stack
  const getTop = () => {
    if (stack.length > 0) {
      const topValue = stack[stack.length - 1].value;
      setLogMessage(`Top of the stack is "${topValue}".`);
      setHighlightIndex(stack.length - 1); // Highlight the top block temporarily
      setTimeout(() => {
        setHighlightIndex(null); // Remove the highlight after 1 second
      }, 1000);
    } else {
      setLogMessage("Stack is empty! No top element.");
    }
  };

  return (
    <div className="stack-container">
      <h1>Stack Visualizer</h1>
      <div className="stack-visualization">
        {stack.map((item, index) => (
          <div
            key={index}
            className={`stack-block ${
              item.isNew ? "isNew" : "" // Push animation
            } ${
              index === removedIndex ? "isRemoved" : "" // Pop animation
            } ${
              index === stack.length - 1 && highlightIndex === index
                ? "highlight-temporary"
                : ""
            }`}
          >
            {item.value}
          </div>
        ))}
      </div>
      <div className="controls">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value"
        />
        <button onClick={pushToStack}>Push</button>
        <button onClick={popFromStack}>Pop</button>
        <button onClick={getTop}>Top</button>
      </div>
      <div className="log-message">{logMessage}</div>
    </div>
  );
};

export default StackVisualizer;
