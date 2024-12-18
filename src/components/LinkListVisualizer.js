import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import LinkList from "./LinkList";
import "./LinkedListVisualizer.css";

const LinkedListVisualizer = () => {
  const [linkedList] = useState(new LinkList());
  const [inputValue, setInputValue] = useState("");
  const [indexValue, setIndexValue] = useState("");
  const [showIndexInput, setShowIndexInput] = useState(false);
  const [log, setLog] = useState("");
  const [listItems, setListItems] = useState([]);
  const containerRef = React.useRef(null);

  useEffect(() => {
    updateVisualization();
  }, [listItems]);

  useEffect(() => {
    updateNodeSize();
    window.addEventListener("resize", updateNodeSize);
    return () => {
      window.removeEventListener("resize", updateNodeSize);
    };
  }, [listItems]);

  const updateListItems = () => {
    const items = [];
    let current = linkedList.head;
    while (current) {
      items.push(current.data);
      current = current.next;
    }
    setListItems(items);
  };

  const updateNodeSize = () => {
    const containerWidth = containerRef.current.offsetWidth;
    const totalWidth = listItems.length * 100; // 80px for node + 20px margin (estimated width of node and arrow)
    const nodeSize = totalWidth > containerWidth ? 0.8 : 1; // Scale down nodes if overflow

    // Update the visualization
    updateVisualization(nodeSize);
  };

  const updateVisualization = (nodeSize = 1) => {
    const svgContainer = d3.select(".linkedlist-svg-container");
    const svg = svgContainer.select("svg");
    svg.selectAll("*").remove();

    const nodeWidth = 80 * nodeSize;
    const nodeHeight = 40 * nodeSize;
    const arrowWidth = 20;

    // Calculate total width based on number of nodes
    const totalWidth = listItems.length * (nodeWidth + arrowWidth);

    // Dynamically set the SVG width
    const svgWidth = totalWidth + 20; // Add padding for scrolling
    svg.attr("width", svgWidth); // Dynamically update SVG width

    // Calculate offset to center the content
    const offsetX = Math.max((svgWidth - totalWidth) / 2, 10);

    // Create the nodes and arrows
    listItems.forEach((item, index) => {
      const nodeGroup = svg
        .append("g")
        .attr(
          "transform",
          `translate(${offsetX + index * (nodeWidth + arrowWidth)}, 50)`
        );

      // Add node rectangle
      nodeGroup
        .append("rect")
        .attr("width", nodeWidth)
        .attr("height", nodeHeight)
        .attr("fill", "#007bff")
        .attr("rx", 5)
        .attr("ry", 5)
        .style("opacity", 0)
        .transition()
        .duration(500)
        .style("opacity", 1);

      // Add node text
      nodeGroup
        .append("text")
        .text(item)
        .attr("x", nodeWidth / 2)
        .attr("y", nodeHeight / 2 + 5)
        .attr("fill", "#fff")
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .style("opacity", 0)
        .transition()
        .duration(500)
        .style("opacity", 1);

      // Add arrow if not the last node
      if (index < listItems.length - 1) {
        svg
          .append("line")
          .attr("x1", offsetX + (index + 1) * (nodeWidth + arrowWidth) - arrowWidth)
          .attr("y1", 70)
          .attr("x2", offsetX + (index + 1) * (nodeWidth + arrowWidth))
          .attr("y2", 70)
          .attr("stroke", "#333")
          .attr("stroke-width", 2)
          .attr("marker-end", "url(#arrow)")
          .style("opacity", 0)
          .transition()
          .duration(500)
          .style("opacity", 1);
      }
    });
  };

  const handleInsertAtHead = () => {
    if (inputValue.trim() === "") {
      setLog("Please enter a value to insert.");
      return;
    }
    linkedList.insertAtHead(inputValue);
    updateListItems();
    setLog(`Inserted "${inputValue}" at the head of the linked list.`);
    setInputValue("");
  };

  const handleInsertAtEnd = () => {
    if (inputValue.trim() === "") {
      setLog("Please enter a value to insert.");
      return;
    }
    linkedList.inserAtEnd(inputValue);
    updateListItems();
    setLog(`Inserted "${inputValue}" at the end of the linked list.`);
    setInputValue("");
  };

  const handleInsertAtIndex = () => {
    if (inputValue.trim() === "" || indexValue.trim() === "") {
      setLog("Please enter both a value and an index to insert.");
      return;
    }
    
    const index = parseInt(indexValue, 10);
    const size = linkedList.getSize();
    
    if (isNaN(index) || index < 0 || index > size) { 
      setLog(`Please enter a valid index between 0 and ${size}.`);
      return;
    }
    
    linkedList.insertAtIndex(inputValue, index);
    updateListItems();
    setLog(`Inserted "${inputValue}" at index ${index}.`);
    setInputValue("");
    setIndexValue("");
    setShowIndexInput(false);
  };

  const handleDeleteFromHead = () => {
    if (!linkedList.head) {
      setLog("Cannot delete from an empty list.");
      return;
    }
    linkedList.deleteFromHead();
    updateListItems();
    setLog("Deleted the head of the linked list.");
  };

  const handleDeleteFromEnd = () => {
    if (!linkedList.head) {
      setLog("Cannot delete from an empty list.");
      return;
    }
    linkedList.deleteFromEnd();
    updateListItems();
    setLog("Deleted the last element of the linked list.");
  };

  const handleDeleteFromIndex = () => {
    if (indexValue.trim() === "") {
      setLog("Please enter an index to delete.");
      return;
    }
    
    const index = parseInt(indexValue, 10);
    const size = linkedList.getSize();
    
    if (isNaN(index) || index < 0 || index >= size) {
      setLog(`Please enter a valid index between 0 and ${size - 1}.`);
      return;
    }
    
    linkedList.deleteFromIndex(index);
    updateListItems();
    setLog(`Deleted the element at index ${index}.`);
    setIndexValue("");
    setShowIndexInput(false);
  };
  return (
    <div className="linkedlist-container">
      <h1>Linked List Visualizer</h1>
      <div className="linkedlist-svg-container" ref={containerRef}>
        <svg className="linkedlist-svg" height="400">
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#333" />
            </marker>
          </defs>
        </svg>
      </div>
      <div className="controls">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value"
        />
        <button onClick={handleInsertAtHead}>Insert at Head</button>
        <button onClick={handleInsertAtEnd}>Insert at End</button>
        <button
          onClick={() => {
            setShowIndexInput(true);
            setLog("Provide index to insert.");
          }}
        >
          Insert at Index
        </button>
        <button onClick={handleDeleteFromHead}>Delete from Head</button>
        <button onClick={handleDeleteFromEnd}>Delete from End</button>
        <button
          onClick={() => {
            setShowIndexInput(true);
            setLog("Provide index to delete.");
          }}
        >
          Delete from Index
        </button>
        {showIndexInput && (
          <div className="index-input-container">
            <input
              type="text"
              value={indexValue}
              onChange={(e) => setIndexValue(e.target.value)}
              placeholder="Enter index"
            />
            <button onClick={handleInsertAtIndex}>Confirm Insert</button>
            <button onClick={handleDeleteFromIndex}>Confirm Delete</button>
          </div>
        )}
      </div>
      <div className="log">{log}</div>
    </div>
  );
};

export default LinkedListVisualizer;
