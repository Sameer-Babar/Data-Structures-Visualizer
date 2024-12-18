import React from "react";
import StackVisualizer from "./components/StackVisualizer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QueueVisualizer from "./components/QueueVisualizer";
import LinkedListVisualizer from "./components/LinkListVisualizer";
import HashTableVisualizer from "./components/HashTableVisualizer";
import TreeVisualizerD3 from "./components/BinarySearchTreeVisualizer";
import GraphVisualizer from "./components/GraphVisualizer";
import DoublyLinkedListVisualizer from "./components/DoublyLinkedListVisualizer";
import CircularLinkedListVisualizer from "./components/CircularLinkedListVisualizer";
import RBTreeVisualizer from "./components/RBTreeVisualizer";
import MainPage from "./components/MainPage";
import AVLTreeVisualizer from "./components/AVLTreeVisualizer";
import WeightedGraphVisualizer from "./components/GraphAlgosVisualizer";
import "./App.css"
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Main Page */}
        <Route path="/" element={<MainPage />} />
        {/* Stack Visualizer */}
        <Route path="/stack-visualizer" element={<StackVisualizer />} />
        <Route path ="/queue-visualizer" element = {<QueueVisualizer/>}/>
        <Route path="/linkedlist-visualizer" element = {<LinkedListVisualizer/>} />
        <Route path="/hashtable-visualizer" element = {<HashTableVisualizer/>} />
        <Route  path="/trees-visualizer" element = {<TreeVisualizerD3/>}/>
        <Route path="/graphs-visualizer" element = {<GraphVisualizer/>}/>
        <Route path="/doublyll-visualizer" element = {<DoublyLinkedListVisualizer/>}/>
        <Route path="/circularll-visualizer" element={<CircularLinkedListVisualizer/>}/>
        <Route path="/rb-visualizer" element={<RBTreeVisualizer/>}/>
        <Route  path="avl-visualizer" element ={<AVLTreeVisualizer/>}/>
        <Route path="/algos-visualizer" element = {<WeightedGraphVisualizer/>}/>
      </Routes>
    </Router>
  );
};

export default App;
