import React, { useState, useEffect, useRef } from "react";
import CircularLinkedList from "./CircularLinkedList"; // Your CircularLinkedList class
import "./CircularLinkedListVisualizer.css";
import * as d3 from "d3";

const CircularLinkedListVisualizer = () => {
  const [linkedList] = useState(new CircularLinkedList());
  const [inputValue, setInputValue] = useState("");
  const [indexValue, setIndexValue] = useState("");
  const [log, setLog] = useState("");
  const [action, setAction] = useState("");
  const svgRef = useRef(null);

  const updateVisualization = () => {
    const listItems = linkedList.toArray();

    const width = 400;
    const height = 400;
    const radius = 150;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.attr("width", width).attr("height", height);

    if (listItems.length === 0) {
      setLog("The list is empty.");
      return;
    }

    const angleStep = (2 * Math.PI) / listItems.length;
    const group = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Add arrow marker definition
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 0 10 10")
      .attr("refX",8) // Adjusted to position the arrow near the node
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 Z")
      .attr("fill", "black");

    // Draw nodes with animations
    const nodes = group
      .selectAll("circle")
      .data(listItems)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => radius * Math.cos(i * angleStep))
      .attr("cy", (d, i) => radius * Math.sin(i * angleStep))
      .attr("r", 0)
      .attr("fill", "skyblue")
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .transition()
      .duration(500)
      .attr("r", 30);

    // Draw text for nodes
    group
      .selectAll("text")
      .data(listItems)
      .enter()
      .append("text")
      .attr("x", (d, i) => radius * Math.cos(i * angleStep))
      .attr("y", (d, i) => radius * Math.sin(i * angleStep) + 5)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .text((d) => d)
      .style("opacity", 0)
      .transition()
      .delay(500)
      .duration(500)
      .style("opacity", 1);

    // Draw arrows
  // Draw arrows
group
.selectAll("line")
.data(listItems)
.enter()
.append("line")
.attr("x1", (d, i) => (radius - 30) * Math.cos(i * angleStep))  // x1 is at the edge of the current node
.attr("y1", (d, i) => (radius - 30) * Math.sin(i * angleStep))  // y1 is at the edge of the current node
.attr("x2", (d, i) => (radius - 30) * Math.cos(((i + 1) % listItems.length) * angleStep))  // x2 is at the edge of the next node
.attr("y2", (d, i) => (radius - 30) * Math.sin(((i + 1) % listItems.length) * angleStep))  // y2 is at the edge of the next node
.attr("stroke", "black")
.attr("stroke-width", 2)
.attr("marker-end", "url(#arrowhead)")
.style("opacity", 0)
.transition()
.delay(500)
.duration(500)
.style("opacity", 1);

  };

  const handleConfirmInsert = () => {
    handleInsertAtIndex();
    setAction("");
  };

  const handleConfirmDelete = () => {
    handleDeleteFromIndex();
    setAction("");
  };

  const handleInsertAtHead = () => {
    if (inputValue.trim() === "") {
      setLog("Please enter a value to insert.");
      return;
    }
    linkedList.insertAtHead(inputValue);
    updateVisualization();
    setLog(`Inserted "${inputValue}" at the head.`);
    setInputValue("");
  };

  const handleInsertAtEnd = () => {
    if (inputValue.trim() === "") {
      setLog("Please enter a value to insert.");
      return;
    }
    linkedList.insertAtEnd(inputValue);
    updateVisualization();
    setLog(`Inserted "${inputValue}" at the end.`);
    setInputValue("");
  };

  const handleInsertAtIndex = () => {
    if (inputValue.trim() === "" || indexValue.trim() === "") {
      setLog("Please enter a value and index.");
      return;
    }
    const index = parseInt(indexValue);
    if (isNaN(index) || index < 0 || index > linkedList.toArray().length) {
      setLog("Invalid index, please try again.");
      return;
    }
    linkedList.insertAtIndex(inputValue, index);
    updateVisualization();
    setLog(`Inserted "${inputValue}" at index ${index}.`);
    setInputValue("");
    setIndexValue("");
  };

  const handleDeleteFromIndex = () => {
    if (indexValue.trim() === "") {
      setLog("Please enter an index.");
      return;
    }
    const index = parseInt(indexValue);
    if (isNaN(index) || index < 0 || index >= linkedList.toArray().length) {
      setLog("Invalid index, please try again.");
      return;
    }
    linkedList.deleteFromIndex(index);
    updateVisualization();
    setLog(`Deleted node at index ${index}.`);
    setIndexValue("");
  };
  const handleDeleteFromHead = () => {
    if (linkedList.head === null) {
      setLog("List is empty, nothing to delete.");
      return;
    }
    linkedList.deleteFromHead();
    updateVisualization();
    setLog("Deleted node from the head.");
  };

  const handleDeleteFromEnd = () => {
    if (linkedList.head === null) {
      setLog("List is empty, nothing to delete.");
      return;
    }
    linkedList.deleteFromEnd();
    updateVisualization();
    setLog("Deleted node from the end.");
  };

  useEffect(() => {
    updateVisualization(); // Initial visualization update
  }, [linkedList]);

  return (
    <div className="circular-linkedlist-container">
      <h1>Circular Linked List Visualizer</h1>

      <div className="visualization-container">
        <svg ref={svgRef}></svg>
      </div>

      <div className="controls">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value"
        />
        {["insert", "delete"].includes(action) && (
          <input
            type="number"
            value={indexValue}
            onChange={(e) => setIndexValue(e.target.value)}
            placeholder="Enter index"
          />
        )}
        <button onClick={handleInsertAtHead}>Insert at Head</button>
        <button onClick={handleInsertAtEnd}>Insert at End</button>
        <button onClick={() => setAction("insert")}>Insert at Index</button>
        <button onClick={handleDeleteFromHead}>Delete from Head</button>
        <button onClick={handleDeleteFromEnd}>Delete from End</button>
        <button onClick={() => setAction("delete")}>Delete from Index</button>

        {action === "insert" && (
          <button onClick={handleConfirmInsert}>Confirm Insert</button>
        )}
        {action === "delete" && (
          <button onClick={handleConfirmDelete}>Confirm Delete</button>
        )}
      </div>

      <div className="log">{log}</div>
    </div>
  );
};

export default CircularLinkedListVisualizer;
