import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import "./GraphVisualizer.css";

const WeightedGraphVisualizer = () => {
  const [vertices, setVertices] = useState([]);
  const [edges, setEdges] = useState([]);
  const [log, setLog] = useState("");
  const [vertexName, setVertexName] = useState("");
  const [vertex1, setVertex1] = useState("");
  const [vertex2, setVertex2] = useState("");
  const [weight, setWeight] = useState("");
  const [startVertex, setStartVertex] = useState("");
  const [endVertex, setEndVertex] = useState("");
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
      weight: edge.weight,
    }));

    const simulation = d3
      .forceSimulation(vertices)
      .force(
        "link",
        d3.forceLink(linkData)
          .id((d) => d.name)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-50))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const links = svg
      .selectAll(".link")
      .data(linkData)
      .enter()
      .append("g")
      .attr("class", "link-group");

    links
      .append("line")
      .attr("class", "link")
      .attr("stroke", "#999")
      .attr("stroke-width", 2);

    links
      .append("text")
      .attr("x", (d) => (d.source.x + d.target.x) / 2)
      .attr("y", (d) => (d.source.y + d.target.y) / 2)
      .attr("dy", "-5")
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .text((d) => d.weight);

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
      svg
        .selectAll(".link")
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      svg
        .selectAll(".link-group text")
        .attr("x", (d) => (d.source.x + d.target.x) / 2)
        .attr("y", (d) => (d.source.y + d.target.y) / 2);

      nodes.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });
  };

  const dijkstra = (start, end) => {
    const distances = {};
    const previous = {};
    const queue = [];
    const path = [];

    vertices.forEach((v) => {
      distances[v.name] = Infinity;
      previous[v.name] = null;
    });
    distances[start] = 0;

    vertices.forEach((v) => queue.push(v.name));

    while (queue.length) {
      const u = queue.reduce((a, b) => (distances[a] < distances[b] ? a : b));
      queue.splice(queue.indexOf(u), 1);

      if (u === end) break;

      edges
        .filter((e) => e.vertex1 === u || e.vertex2 === u)
        .forEach((edge) => {
          const neighbor = edge.vertex1 === u ? edge.vertex2 : edge.vertex1;
          const alt = distances[u] + edge.weight;
          if (alt < distances[neighbor]) {
            distances[neighbor] = alt;
            previous[neighbor] = u;
          }
        });
    }

    let current = end;
    while (current) {
      path.unshift(current);
      current = previous[current];
    }

    return { path, distances };
  };

  const handleDijkstra = () => {
    if (!startVertex || !endVertex || !vertices.some((v) => v.name === startVertex) || !vertices.some((v) => v.name === endVertex)) {
      setLog("Invalid start or end vertex.");
      return;
    }
  
    const { path, distances } = dijkstra(startVertex, endVertex);
  
    // Check if there's no valid path
    if (path.length === 0 || distances[endVertex] === Infinity) {
      setLog(`No path found between ${startVertex} and ${endVertex}.`);
      return; // Exit the function early
    }
  
    setLog(`Shortest path from ${startVertex} to ${endVertex}: ${path.join(" -> ")}`);
    animateDijkstra(path);
  };
  

  const animateDijkstra = (path) => {
    const svg = d3.select(svgRef.current);
    const allEdges = svg.selectAll(".link");
  
    // Animate the edges in the shortest path
    path.forEach((vertex, index) => {
      if (index < path.length - 1) {
        const edge = edges.find(
          (e) =>
            (e.vertex1 === path[index] && e.vertex2 === path[index + 1]) ||
            (e.vertex1 === path[index + 1] && e.vertex2 === path[index])
        );
        
        // Highlight the edge in red
        setTimeout(() => {
          allEdges
            .filter((d) => (d.source.name === edge.vertex1 && d.target.name === edge.vertex2) || (d.source.name === edge.vertex2 && d.target.name === edge.vertex1))
            .transition()
            .duration(500)
            .attr("stroke", "red")
            .attr("stroke-width", 4)
            .transition()
            .duration(500)
            .attr("stroke", "#999") // Reset to original color
            .attr("stroke-width", 2);
        }, index * 1000);
      }
    });
  
    // Highlight the vertices
    path.forEach((vertex, index) => {
      const node = svg
        .selectAll(".node")
        .filter((d) => d.name === vertex);
      
      // Animate vertices (e.g., change color or scale them)
      setTimeout(() => {
        node
          .select("circle")
          .transition()
          .duration(500)
          .attr("fill", "blue")
          .transition()
          .duration(500)
          .attr("fill", "#69b3a2"); // Reset to original color
      }, index * 1000);
    });
  };

  const kruskal = () => {
    const mst = [];
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
    const parent = {};
    const find = (v) => (parent[v] === v ? v : (parent[v] = find(parent[v])));
    const union = (u, v) => {
      const rootU = find(u);
      const rootV = find(v);
      if (rootU !== rootV) parent[rootV] = rootU;
    };

    vertices.forEach((v) => (parent[v.name] = v.name));

    sortedEdges.forEach((edge) => {
      const { vertex1, vertex2 } = edge;
      if (find(vertex1) !== find(vertex2)) {
        mst.push(edge);
        union(vertex1, vertex2);
      }
    });

    return mst;
  };

  const prim = (start) => {
    const visited = new Set();
    const mst = [];
    const edgesQueue = edges.filter((e) => e.vertex1 === start || e.vertex2 === start);

    visited.add(start);

    while (edgesQueue.length) {
      const edge = edgesQueue.sort((a, b) => a.weight - b.weight).shift();
      const { vertex1, vertex2 } = edge;

      const next = !visited.has(vertex1) ? vertex1 : vertex2;
      if (visited.has(next)) continue;

      visited.add(next);
      mst.push(edge);

      edges
        .filter((e) => e.vertex1 === next || e.vertex2 === next)
        .forEach((e) => {
          if (!visited.has(e.vertex1) || !visited.has(e.vertex2)) edgesQueue.push(e);
        });
    }

    return mst;
  };

 

  const handleKruskal = () => {
    const mst = kruskal();
    setLog(`MST using Kruskal's: ${JSON.stringify(mst)}`);
    animateEdges(mst);
  };

  const handlePrim = () => {
    if (!startVertex || !vertices.some((v) => v.name === startVertex)) {
      setLog("Invalid start vertex for Prim's algorithm.");
      return;
    }

    const mst = prim(startVertex);
    setLog(`MST using Prim's: ${JSON.stringify(mst)}`);
    animateEdges(mst);
  };

  const animateEdges = (mstEdges) => {
    const svg = d3.select(svgRef.current);
    const allEdges = svg.selectAll(".link");
  
    mstEdges.forEach((edge, index) => {
      setTimeout(() => {
        allEdges
          .filter((d) => (d.source.name === edge.vertex1 && d.target.name === edge.vertex2) || (d.source.name === edge.vertex2 && d.target.name === edge.vertex1))
          .transition()
          .duration(500)
          .attr("stroke", "orange")
          .attr("stroke-width", 4)
          .transition()
          .duration(500)
          .attr("stroke", "#999") // Reset to original color
          .attr("stroke-width", 2);
      }, index * 1000);
    });
  
    // Optionally, highlight vertices during MST animation
    mstEdges.forEach((edge, index) => {
      const nodes = svg
        .selectAll(".node")
        .filter((d) => d.name === edge.vertex1 || d.name === edge.vertex2);
  
      setTimeout(() => {
        nodes
          .select("circle")
          .transition()
          .duration(500)
          .attr("fill", "orange")
          .transition()
          .duration(500)
          .attr("fill", "#69b3a2"); // Reset to original color
      }, index * 1000);
    });
  };

  const handleAddVertex = () => {
    if (!vertexName || vertices.some((v) => v.name === vertexName)) return;
    setVertices([...vertices, { name: vertexName }]);
    setVertexName("");
  };

  const handleAddEdge = () => {
    if (!vertex1 || !vertex2 || !weight || isNaN(weight)) return;
    if (vertices.some((v) => v.name === vertex1) && vertices.some((v) => v.name === vertex2)) {
      setEdges([...edges, { vertex1, vertex2, weight: parseFloat(weight) }]);
    }
    setVertex1("");
    setVertex2("");
    setWeight("");
  };

  return (
    <div className="graph-visualizer">
      <h1>Dijikstras and MST</h1>
      <div className="controls">
        <input
          type="text"
          value={vertexName}
          onChange={(e) => setVertexName(e.target.value)}
          placeholder="Vertex Name"
        />
        <button onClick={handleAddVertex}>Add Vertex</button>
      </div>
      <div className="controls">
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
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Weight"
        />
        <button onClick={handleAddEdge}>Add Edge</button>
      </div>
      <div className="controls">
        <input
          type="text"
          value={startVertex}
          onChange={(e) => setStartVertex(e.target.value)}
          placeholder="Start Vertex"
        />
        <input
          type="text"
          value={endVertex}
          onChange={(e) => setEndVertex(e.target.value)}
          placeholder="End Vertex"
        />
        <button onClick={handleDijkstra}>Dijkstra</button>
        <button onClick={handleKruskal}>Kruskal</button>
        <button onClick={handlePrim}>Prim</button>
      </div>
      <div className="log">{log}</div>
      <svg ref={svgRef}></svg>
      
    </div>
  );
};

export default WeightedGraphVisualizer;
