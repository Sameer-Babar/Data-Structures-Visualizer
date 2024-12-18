import React, { useState, useRef, useEffect } from "react";
import BinarySearchTree from "./BinarySearchTree";
import * as d3 from "d3";
import "./BSTVisualizer.css";

const BSTVisualizer = () => {
  const [bst] = useState(new BinarySearchTree());
  const [inputValue, setInputValue] = useState("");
  const [log, setLog] = useState("");
  const [rotationDirection, setRotationDirection] = useState("");
  const svgRef = useRef();

  const drawTree = () => {
    const width = 600;
    const height = 400;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous SVG elements

    if (!bst.root) {
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .text("Tree is empty")
        .style("fill", "#555")
        .style("font-size", "16px");
      return;
    }

    // Convert tree to D3 hierarchy
    const convertToHierarchy = (node) => {
      if (!node) return null;
      return {
        value: node.data,
        children: [
          node.left ? convertToHierarchy(node.left) : null,
          node.right ? convertToHierarchy(node.right) : null,
        ].filter(Boolean), // Remove null children
      };
    };

    const treeData = d3.hierarchy(convertToHierarchy(bst.root));
    const treeLayout = d3.tree().size([width - 50, height - 100]);
    const root = treeLayout(treeData);

    const links = root.links();
    const nodes = root.descendants();

    // Draw links with animation
    svg
      .selectAll(".link")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("x1", (d) => d.source.x + 25)
      .attr("y1", (d) => d.source.y + 25)
      .attr("x2", (d) => d.source.x + 25)
      .attr("y2", (d) => d.source.y + 25)
      .attr("stroke", "#ccc")
      .attr("stroke-width", 2)
      .transition()
      .duration(500)
      .attr("x2", (d) => d.target.x + 25)
      .attr("y2", (d) => d.target.y + 25);

    // Draw nodes with animation
    const nodeGroup = svg
    .selectAll(".node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", (d) => `translate(${d.x + 25},${d.y + 25})`);
  
  // Add circles for nodes
  nodeGroup
    .append("circle")
    .attr("r", 20)
    .attr("fill", "#69b3a2")
    .attr("stroke", "#333")
    .attr("stroke-width", 2);
  
  // Add text for node labels
  nodeGroup
    .append("text")
    .attr("dy", 5)
    .attr("text-anchor", "middle")
    .text((d) => d.data.value)
    .style("fill", "#fff");
  
  };

  const handleInsert = () => {
    const value = parseInt(inputValue, 10);
    if (isNaN(value)) {
      setLog("Please enter a valid number.");
      return;
    }
  
    const result = bst.insert(value);
    if (result === null) {
      setLog(`Duplicate value ${value} is not allowed.`);
    } else {
      setLog(`Inserted ${value} into the BST.`);
      drawTree(); // Redraw tree with animation
    }
  
    setInputValue("");
  };

  const handleDelete = () => {
    const value = parseInt(inputValue, 10);
    if (isNaN(value)) {
      setLog("Please enter a valid number.");
      return;
    }
    bst.delete(value);
    setLog(`Deleted ${value} from the BST.`);
    setInputValue("");
    drawTree(); // Redraw tree with animation
  };

  const handleRotation = () => {
    const value = parseInt(inputValue, 10);
    if (isNaN(value)) {
      setLog("Please enter a valid number.");
      return;
    }

    const node = findNode(bst.root, value);
    if (!node) {
      setLog("Node not found.");
      return;
    }

    if (rotationDirection === "left" && bst.isRotationPossible(node, "left")) {
      bst.leftRotate(node);
      setLog(`Left rotated node ${value}.`);
    } else if (rotationDirection === "right" && bst.isRotationPossible(node, "right")) {
      bst.rightRotate(node);
      setLog(`Right rotated node ${value}.`);
    } else {
      setLog("Rotation not possible.");
      return;
    }

    drawTree(); // Redraw tree after rotation
  };

  const findNode = (node, value) => {
    if (!node) return null;
    if (node.data === value) return node;
    return value < node.data
      ? findNode(node.left, value)
      : findNode(node.right, value);
  };

  const handleTraversal = (type) => {
    if (!bst.root) {
      setLog("Tree is empty.");
      return;
    }

    const traversalOrder = [];
    const traverse = (node, order) => {
      if (!node) return;
      if (order === "pre") traversalOrder.push(node.data);
      traverse(node.left, order);
      if (order === "in") traversalOrder.push(node.data);
      traverse(node.right, order);
      if (order === "post") traversalOrder.push(node.data);
    };

    traverse(bst.root, type);

    const svg = d3.select(svgRef.current);
    let i = 0;

    const animateTraversal = () => {
      if (i < traversalOrder.length) {
        const currentNodeValue = traversalOrder[i];
        svg
          .selectAll("circle")
          .filter((d) => d.data.value === currentNodeValue)
          .transition()
          .duration(500)
          .attr("fill", "orange")
          .transition()
          .duration(500)
          .attr("fill", "#69b3a2");

        i++;
        setTimeout(animateTraversal, 1000);
      } else {
        setLog(`${type.toUpperCase()} Traversal Completed: ${traversalOrder.join(", ")}`);
      }
    };

    setLog(`${type.toUpperCase()} Traversal Started.`);
    animateTraversal();
  };

  useEffect(() => {
    drawTree(); // Draw tree on initial render
  }, []);

  return (
    <div className="bst-container">
      <h1>Binary Search Tree Visualizer</h1>
      <svg ref={svgRef} width="600" height="400"></svg>
      <div className="controls">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value"
        />
        <button onClick={handleInsert}>Insert</button>
        <button onClick={handleDelete}>Delete</button>
        
          <button onClick={() => setRotationDirection("left")}>Left Rotate</button>
          <button onClick={() => setRotationDirection("right")}>Right Rotate</button>
          <button onClick={handleRotation}>Perform Rotation</button>
       
        
          <button onClick={() => handleTraversal("pre")}>Pre-Order</button>
          <button onClick={() => handleTraversal("in")}>In-Order</button>
          <button onClick={() => handleTraversal("post")}>Post-Order</button>
        
      </div>
      <div className="log">{log}</div>
    </div>
  );
};

export default BSTVisualizer;
