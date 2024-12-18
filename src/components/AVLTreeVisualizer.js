import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import { AVLTree } from "./AVLTreeLogic"; // Import AVLTree class
import "./AVLTreeVisualizer.css";

const AVLTreeVisualizer = () => {
  const [avlTree] = useState(new AVLTree());
  const svgRef = useRef();
  const [log, setLog] = useState("");
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [inputValues, setInputValues] = useState([]); // Store inserted node values

  useEffect(() => {
    drawTree();
  }, [avlTree]);

  const drawTree = () => {
    const width = 800;
    const height = 400;
    const rootNode = avlTree.root;

    // Clear the SVG canvas
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    if (!rootNode) return;

    const newNodes = [];
    const newLinks = [];

    // Calculate positions recursively
    const calculatePositions = (node, x, y, xOffset) => {
      if (!node) return;

      newNodes.push({ id: node.value, value: node.value, x, y });

      if (node.left) {
        newLinks.push({ source: node.value, target: node.left.value });
        calculatePositions(node.left, x - xOffset, y + 50, xOffset / 2);
      }

      if (node.right) {
        newLinks.push({ source: node.value, target: node.right.value });
        calculatePositions(node.right, x + xOffset, y + 50, xOffset / 2);
      }
    };

    calculatePositions(rootNode, width / 2, 50, width / 4);

    setNodes(newNodes); // Update state
    setLinks(newLinks); // Update state

    // Draw links (only if they are new or have changed)
    svg
      .selectAll(".link")
      .data(newLinks, (d) => `${d.source}-${d.target}`)
      .join(
        (enter) =>
          enter
            .append("line")
            .attr("class", "link")
            .attr("stroke", "#999")
            .attr("stroke-width", 2)
            .attr("x1", (d) => newNodes.find((n) => n.id === d.source).x)
            .attr("y1", (d) => newNodes.find((n) => n.id === d.source).y)
            .attr("x2", (d) => newNodes.find((n) => n.id === d.target).x)
            .attr("y2", (d) => newNodes.find((n) => n.id === d.target).y)
            .transition() // Add transition for smooth link drawing
            .duration(500)
            .attr("stroke-opacity", 1),
        (update) =>
          update
            .transition() // Add transition for smooth update of links
            .duration(500)
            .attr("x1", (d) => newNodes.find((n) => n.id === d.source).x)
            .attr("y1", (d) => newNodes.find((n) => n.id === d.source).y)
            .attr("x2", (d) => newNodes.find((n) => n.id === d.target).x)
            .attr("y2", (d) => newNodes.find((n) => n.id === d.target).y),
        (exit) =>
          exit
            .transition() // Add transition for link removal
            .duration(500)
            .attr("stroke-opacity", 0)
            .remove()
      );

    // Draw nodes
    const nodeSelection = svg
      .selectAll(".node")
      .data(newNodes, (d) => d.id)
      .join(
        (enter) =>
          enter
            .append("g")
            .attr("class", "node")
            .attr("transform", (d) => `translate(${d.x},${d.y})`)
            .style("opacity", 0) // Initially set opacity to 0 for fade-in effect
            .each(function (d) {
              // Initial position before animation
              d3.select(this).append("circle").attr("r", 15).attr("fill", "#4CAF50");
              d3.select(this)
                .append("text")
                .text(d.value)
                .attr("x", 0)
                .attr("y", 5)
                .style("text-anchor", "middle")
                .style("font-size", "12px")
                .style("fill", "#fff");
            })
            .transition() // Fade-in animation for new nodes
            .duration(500)
            .style("opacity", 1),
        (update) =>
          update
            .transition() // Smooth transition when updating existing nodes
            .duration(500)
            .attr("transform", (d) => `translate(${d.x},${d.y})`)
            .select("circle")
            .attr("r", 15)
            .attr("fill", "#4CAF50"),
        (exit) =>
          exit
            .transition() // Add transition for node removal
            .duration(500)
            .style("opacity", 0)
            .remove()
      );
  };

  const animateRotations = (rotations) => {
    const svg = d3.select(svgRef.current);

    rotations.forEach((event, index) => {
      const { type, node, affectedNodes } = event;

      // Apply color change animation to affected nodes immediately
      affectedNodes.forEach((affectedNode) => {
        svg.selectAll(".node")
          .filter((d) => d.id === affectedNode)
          .classed("color-change", true); // Apply color change CSS animation
      });

      // Apply rotation animations (left or right) based on rotation type
      affectedNodes.forEach((affectedNode) => {
        svg.selectAll(".node")
          .filter((d) => d.id === affectedNode)
          .classed(type === "left-rotation" ? "left-rotation" : "right-rotation", true); // Apply rotation CSS animation
      });

      // Remove animation classes after the animation completes (reset for next animation)
      setTimeout(() => {
        affectedNodes.forEach((affectedNode) => {
          svg.selectAll(".node")
            .filter((d) => d.id === affectedNode)
            .classed("color-change", false)
            .classed("left-rotation", false)
            .classed("right-rotation", false);
        });
      }, 1500); // Animation duration, 1.5s for color change and rotation
    });

    // Redraw the tree after all rotations have been completed
    setTimeout(() => {
      drawTree(); // Final redraw after animations
    }, rotations.length * 1500); // Delay final redraw based on the number of rotations
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddNode = () => {
    const numValue = parseInt(inputValue, 10);

    if (isNaN(numValue)) {
      setLog("Invalid input: Please enter a numeric value.");
      return;
    }

    // Check if the value already exists
    if (inputValues.includes(numValue)) {
      setLog(`Node ${numValue} is already present in the tree.`);
      setInputValue(""); // Clear input field
      return;
    }

    // Insert the value if it doesn't exist in the array
    const rotations = avlTree.insertValueWithRotations(numValue);
    setInputValues([...inputValues, numValue]); // Add to inputValues array
    setLog(`Node ${numValue} added.`);
    setInputValue(""); // Clear input field
    drawTree(); // Redraw tree after insertion
  };

  const handleDeleteNode = () => {
    const numValue = parseInt(inputValue, 10);

    if (isNaN(numValue)) {
      setLog("Invalid input: Please enter a numeric value.");
      return;
    }

    // Check if the value exists before deleting
    if (!inputValues.includes(numValue)) {
      setLog(`Node ${numValue} not found in the tree.`);
      setInputValue(""); // Clear input field
      return;
    }

    // Delete the value if it exists in the array
    const rotations = avlTree.deleteValue(numValue); // Assuming you add deleteValueWithRotations method to AVLTree class
    setInputValues(inputValues.filter((val) => val !== numValue)); // Remove from inputValues array
    setLog(`Node ${numValue} deleted.`);
    setInputValue(""); // Clear input field
    drawTree(); // Redraw tree after deletion
  };

  return (
    <div className="avl-visualizer">
      <h1>AVL Tree Visualizer</h1>
      <div className="abc">
        <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Node Value"
        />
        <button onClick={handleAddNode}>Add Node</button>
        <button onClick={handleDeleteNode}>Delete Node</button>
      </div>
      <div className="log">{log}</div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default AVLTreeVisualizer;
