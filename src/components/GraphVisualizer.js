import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import "./GraphVisualizer.css";

const GraphVisualizerD3 = () => {
  const [vertices, setVertices] = useState([]);
  const [edges, setEdges] = useState([]);
  const [log, setLog] = useState("");
  const [vertexName, setVertexName] = useState("");
  const [vertex1, setVertex1] = useState("");
  const [vertex2, setVertex2] = useState("");
  const [startVertex, setStartVertex] = useState("");
  const svgRef = useRef();

  useEffect(() => {
    drawGraph();
  }, [vertices, edges]);

  const drawGraph = () => {
    const width = 1000;
    const height = 500;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const linkData = edges.map((edge) => ({
      source: edge.vertex1,
      target: edge.vertex2,
    }));

    const simulation = d3
      .forceSimulation(vertices)
      .force(
        "link",
        d3.forceLink(linkData)
          .id((d) => d.name)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-30))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const links = svg
      .selectAll(".link")
      .data(linkData)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke", "#999")
      .attr("stroke-width", 2);

    const nodes = svg
      .selectAll(".node")
      .data(vertices)
      .enter()
      .append("g")
      .attr("class", "node")
      .call(
        d3
          .drag()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    nodes
      .append("circle")
      .attr("r", 10)
      .attr("fill", "#69b3a2");

    nodes
      .append("text")
      .text((d) => d.name)
      .attr("x", 12)
      .attr("y", 4)
      .style("font-size", "12px")
      .style("fill", "#333");

    simulation.on("tick", () => {
      links
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      nodes.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });
  };
  const handleAddEdge = () => {
    if (
      vertex1 &&
      vertex2 &&
      vertices.some((v) => v.name === vertex1) &&
      vertices.some((v) => v.name === vertex2) &&
      !edges.some(
        (e) =>
          (e.vertex1 === vertex1 && e.vertex2 === vertex2) ||
          (e.vertex1 === vertex2 && e.vertex2 === vertex1)
      )
    ) {
      setEdges([...edges, { vertex1, vertex2 }]);
      setLog(`Edge added between ${vertex1} and ${vertex2}.`);
      setVertex1("");
      setVertex2("");
    } else {
      setLog("Invalid vertices or duplicate edge.");
    }
  };

  const bfs = (start) => {
    const visited = new Set();
    const queue = [start];
    const order = [];

    while (queue.length) {
      const vertex = queue.shift();
      if (!visited.has(vertex)) {
        visited.add(vertex);
        order.push(vertex);

        edges
          .filter((e) => e.vertex1 === vertex || e.vertex2 === vertex)
          .forEach((edge) => {
            const neighbor =
              edge.vertex1 === vertex ? edge.vertex2 : edge.vertex1;
            if (!visited.has(neighbor)) queue.push(neighbor);
          });
      }
    }

    return order;
  };

  const dfs = (start, visited = new Set(), order = []) => {
    if (visited.has(start)) return order;

    visited.add(start);
    order.push(start);

    edges
      .filter((e) => e.vertex1 === start || e.vertex2 === start)
      .forEach((edge) => {
        const neighbor = edge.vertex1 === start ? edge.vertex2 : edge.vertex1;
        dfs(neighbor, visited, order);
      });

    return order;
  };

  const animateTraversal = (order) => {
    const svg = d3.select(svgRef.current);

    order.forEach((vertex, index) => {
      setTimeout(() => {
        svg
          .selectAll(".node circle")
          .filter((d) => d.name === vertex)
          .transition()
          .duration(500)
          .attr("fill", "orange")
          .transition()
          .duration(500)
          .attr("fill", "#69b3a2");
      }, index * 1000);
    });
  };
  const handleAddVertex = () => {
    if (vertexName && !vertices.some((v) => v.name === vertexName)) {
      setVertices([...vertices, { name: vertexName }]);
      setLog(`Vertex ${vertexName} added.`);
      setVertexName("");
    } else {
      setLog("Invalid or duplicate vertex name.");
    }
  };


  const handleBFS = () => {
    if (!startVertex || !vertices.some((v) => v.name === startVertex)) {
      setLog("Invalid start vertex.");
      return;
    }

    const path = bfs(startVertex);
    setLog(`BFS order: ${path.join(" -> ")}`);
    animateTraversal(path);
  };

  const handleDFS = () => {
    if (!startVertex || !vertices.some((v) => v.name === startVertex)) {
      setLog("Invalid start vertex.");
      return;
    }

    const path = dfs(startVertex);
    setLog(`DFS order: ${path.join(" -> ")}`);
    animateTraversal(path);
  };

  return (
    <div className="graph-visualizer">
      <h1>Graph Visualizer</h1>
      <div className="abdul">
        <input
          type="text"
          value={vertexName}
          onChange={(e) => setVertexName(e.target.value)}
          placeholder="Vertex Name"
        />
        <button onClick={handleAddVertex}>Add Vertex</button>
      </div>
      <div className="abdul">
        <input
          type="text"
          value={vertex1}
          onChange={(e) => setVertex1(e.target.value)}
          placeholder="Vertex 1"
        />
        <input
          type="text"
          value={vertex2}
          onChange={(e) => setVertex2(e.target.value)}
          placeholder="Vertex 2"
        />
        <button onClick={handleAddEdge}>Add Edge</button>
      </div>
      <div className="abdul">
        <input
          type="text"
          value={startVertex}
          onChange={(e) => setStartVertex(e.target.value)}
          placeholder="Start Vertex"
        />
        <button onClick={handleBFS}>BFS</button>
        <button onClick={handleDFS}>DFS</button>
      </div>
      <div className="log">{log}</div>
      <svg ref={svgRef}></svg>

    </div>
  );
};

export default GraphVisualizerD3;
