import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../App.css'; // Assuming the styles will be placed here
import stackImage from "../assets/stack.png"; // Replace with your actual image paths
import queueImage from "../assets/queue.png";
import linkedListImage from "../assets/LinkedList.png";
import doublyLLImage from "../assets/doublyLLIamge.png";
import circularLLImage from "../assets/circularLLIamge.png";
import hashTableImage from "../assets/hashTableImage.png";
import treeImage from "../assets/treeImage.png";
import graphImage from "../assets/graphImage.png";
import rbTreeImage from "../assets/rbTreeImage.png";
import avlTreeImage from "../assets/avlTreeImage.png";
import algoImage from "../assets/algosImage.png";

// Updated dataStructures array with image paths
const dataStructures = [
  {
    name: "Stack",
    description: "A linear data structure that follows the Last In, First Out (LIFO) principle, where the last element added is the first to be removed. Commonly used for function call stacks, undo operations, and depth-first search.",
    route: "/stack-visualizer",
    image: stackImage
  },
  {
    name: "Queue",
    description: "A linear data structure that follows the First In, First Out (FIFO) principle, where the first element added is the first to be removed. It is used in scheduling algorithms, print job management, and breadth-first search.",
    route: "/queue-visualizer",
    image: queueImage
  },
  {
    name: "LinkedList",
    description: "A dynamic data structure consisting of nodes, where each node contains data and a pointer to the next node. It is useful for efficient insertion and deletion of elements in dynamic memory.",
    route: "/linkedlist-visualizer",
    image: linkedListImage
  },
  {
    name: "Doubly Linked List",
    description: "A type of linked list where each node contains data, a pointer to the next node, and a pointer to the previous node. It allows bidirectional traversal, making insertions and deletions more flexible.",
    route: "/doublyll-visualizer",
    image: doublyLLImage
  },
  {
    name: "Circular Linked List",
    description: "A variation of a linked list where the last node points to the first node, forming a circle. It is often used in scenarios like buffering, scheduling, or when a cyclic structure is required.",
    route: "/circularll-visualizer",
    image: circularLLImage
  },
  {
    name: "Hash Table",
    description: "A data structure that maps keys to values using a hash function. It provides fast data retrieval, insertion, and deletion, making it ideal for implementing associative arrays or dictionaries.",
    route: "/hashtable-visualizer",
    image: hashTableImage
  },
  {
    name: "Trees",
    description: "A hierarchical data structure where nodes have a parent-child relationship. Trees are used to represent hierarchical data, such as file systems, XML/HTML documents, and decision-making models.",
    route: "/trees-visualizer",
    image: treeImage
  },
  {
    name: "Graphs",
    description: "A collection of nodes (vertices) connected by edges. Graphs can be directed or undirected, weighted or unweighted, and are used to model networks, such as social networks, transportation systems, and dependency graphs.",
    route: "/graphs-visualizer",
    image: graphImage
  },
  {
    name: "Red-Black Trees",
    description: "A self-balancing binary search tree where nodes are either red or black. Red-Black Trees ensure the tree remains balanced during insertions and deletions, providing efficient operations with O(log n) time complexity.",
    route: "/rb-visualizer",
    image: rbTreeImage
  },
  {
    name: "AVL Trees",
    description: "A self-balancing binary search tree where the difference in heights of the left and right subtrees (balance factor) is at most 1. AVL Trees provide O(log n) time complexity for operations and are commonly used in databases and search engines.",
    route: "/avl-visualizer",
    image: avlTreeImage
  },
  {
    name: "Dijkstra's Algorithm and MST",
    description: "Graph algorithms for shortest path and minimum spanning tree problems. Dijkstra's algorithm finds the shortest path between nodes, while MST algorithms like Prim's and Kruskal's find the minimum cost to connect all nodes in a graph.",
    route: "/algos-visualizer",
    image: algoImage
  }
];


const MainPage = () => {
  const [selectedStructure, setSelectedStructure] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="main-container">
      <h1 className="title">Data Structure Visualizer</h1>
      <div className="data-structures-container">
        {dataStructures.map((ds) => (
          <div
            key={ds.name}
            className="ds-card"
            onClick={() => setSelectedStructure(ds)}
          >
            <img src={ds.image} alt={`${ds.name} illustration`} className="ds-image" />
            <h3>{ds.name}</h3>
            <p>{ds.description}</p>
            <button
              className="view-button"
              onClick={() => navigate(ds.route)}
            >
              Visualize {ds.name}
            </button>
          </div>
        ))}
      </div>
      {selectedStructure && (
        <div className="selected-structure">
          <img src={selectedStructure.image} alt={`${selectedStructure.name} illustration`} className="selected-image" />
          <h2>{selectedStructure.name}</h2>
          <p>{selectedStructure.description}</p>
          <button
            className="view-button"
            onClick={() => navigate(selectedStructure.route)}
          >
            Visualize {selectedStructure.name}
          </button>
        </div>
      )}
    </div>
  );
};

export default MainPage;
