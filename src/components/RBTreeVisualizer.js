import React, { useState, useRef, useEffect } from "react";
import RedBlackTree from "./RedBlackTree"; // Assuming this implements insertion, deletion, and tree properties
import * as d3 from "d3";
import "./RBTreeVisualizer.css";

const RBTreeVisualizer = () => {
  const [rbt] = useState(new RedBlackTree());
  const [inputValue, setInputValue] = useState("");
  const [logMessages, setLogMessages] = useState(["Welcome to the RB Tree Visualizer!"]);
  const svgRef = useRef();

  // Function to generate tree data structure for d3
  const generateTreeData = (node) => {
    if (!node) return null;
    return {
      value: node.data,
      color: node.color,
      children: [generateTreeData(node.left), generateTreeData(node.right)].filter(Boolean),
    };
  };

  // Function to update log messages
  const updateLogs = () => {
    const logs = rbt.getLogs();
    const lastLog = logs.length ? logs[logs.length - 1] : "Tree is Empty.";
    
    if (!rbt.root) {
      setLogMessages(["Tree is empty. Ready for new insertions."]);
    } else {
      setLogMessages([lastLog]);
    }
  };

  const drawTree = () => {
    const treeData = generateTreeData(rbt.root);
    console.log(treeData);

    if (!treeData) {
      updateLogs("Tree is empty. Nothing to display.");
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear existing tree visualization

    const width = 1200;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    // Create hierarchy data for d3
    const hierarchyData = d3.hierarchy(treeData);
    const treeLayout = d3.tree().size([width - margin.left - margin.right, height - margin.top - margin.bottom]);
    const root = treeLayout(hierarchyData);

    console.log("Root Descendants:", root.descendants()); // Check if descendants are being returned correctly

    // Links (edges) between nodes
    svg
      .selectAll(".link")
      .data(root.links())
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("x1", (d) => d.source.x + margin.left)
      .attr("y1", (d) => d.source.y + margin.top)
      .attr("x2", (d) => d.target.x + margin.left)
      .attr("y2", (d) => d.target.y + margin.top)
      .attr("stroke", "#aaa")
      .attr("stroke-width", 2);

    // Create the nodes (without transition first)
    const nodes = svg
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x + margin.left}, ${d.y + margin.top})`);

    // Add circles and text to nodes
    nodes
      .append("circle")
      .attr("r", 15)
      .attr("fill", (d) => (d.data.color === "RED" ? "red" : "black"))
      .attr("stroke", "white")
      .attr("stroke-width", 2);

    nodes
      .append("text")
      .attr("dy", 5)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .style("font-size", "12px")
      .text((d) => d.data.value);

    // Apply transition after nodes are appended
    nodes
      .style("opacity", 0) // Start with nodes invisible
      .transition()
      .duration(500) // Duration for the fade-in effect
      .style("opacity", 1); // Fade in nodes

    // Update color transition for nodes
    svg
      .selectAll(".node circle")
      .transition()
      .duration(500)
      .attr("fill", (d) => (d.data.color === "RED" ? "red" : "black"));
};


  // Handle insertion
  const handleInsert = () => {
    const value = parseInt(inputValue, 10);
    if (isNaN(value)) {
      updateLogs();
      setInputValue("");
      return;
    }

    try {
      rbt.insert(value);
      updateLogs();
    } catch (error) {
      updateLogs();
    }
    setInputValue("");
    drawTree(); // Redraw the tree with animation
  };

  // Handle deletion
  const handleDelete = () => {
    const value = parseInt(inputValue, 10);
    if (isNaN(value)) {
      updateLogs();
      setInputValue("");
      return;
    }

    try {
      rbt.delete(value);
      updateLogs();
    } catch (error) {
      updateLogs();
    }
    setInputValue("");
    
    if (!rbt.root) {
      updateLogs();
    }

    drawTree(); // Redraw the tree after deletion
  };

  // Force tree redraw on empty tree state or insertion/deletion
  useEffect(() => {
    drawTree();
  }, [rbt.root]);

  return (
    <div className="rbt-container">
      <h1>Red-Black Tree Visualizer</h1>
      <div className="cab">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a value"
        />
        <button onClick={handleInsert}>Insert</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
      <div className="log-message">
        {/* Display only the most recent log */}
        {logMessages}
      </div>
      <div className="tree-container">
        <svg ref={svgRef} className="rbt-svg"></svg>
      </div>
      
    </div>
  );
};

export default RBTreeVisualizer;
