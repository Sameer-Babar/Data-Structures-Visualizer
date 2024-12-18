import React, { useState } from "react";
import HashTable from "./HashTable";
import "./HashTableVisualizer.css";

const HashTableVisualizer = () => {
  const [hashTable, setHashTable] = useState(null);
  const [tableSize, setTableSize] = useState("");
  const [customHashFunction, setCustomHashFunction] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [collisionHandling, setCollisionHandling] = useState("none");
  const [log, setLog] = useState("");
  const [table, setTable] = useState([]);

  const handleSetTableSize = () => {
    const size = parseInt(tableSize, 10);
  
    // Validate table size
    if (isNaN(size) || size < 5 || size > 30) {
      setLog("Table size must be a number between 5 and 30.");
      return;
    }
  
    // Validate custom hash function
    const customHashRegex = /^key\s*%\s*\d+$/;
    if (customHashFunction.trim() && !customHashRegex.test(customHashFunction)) {
      setLog("Invalid hash function. Format must be 'key % number'.");
      return;
    }
  
    try {
      // Create the new hash table
      const newHashTable = new HashTable(size);
  
      // If a custom hash function is provided, set it
      if (customHashFunction.trim()) {
        const customFunc = new Function(
          "key",
          `return ${customHashFunction};`
        );
        newHashTable.hashFunction = customFunc;
        setLog(`Custom hash function applied: ${customHashFunction}`);
      } else {
        setLog("Default hash function applied. key % tableSize");
      }
  
      setHashTable(newHashTable);
      setTable(newHashTable.getTable());
    } catch (err) {
      setLog(
        "Invalid hash function. Ensure it is a valid JavaScript expression."
      );
      return;
    }
  
    setTableSize("");
    setCustomHashFunction("");
  };
  

  const handleInsert = () => {
    const key = parseInt(inputValue, 10);
    if (isNaN(key) || key < 0) {
      setLog("Please enter a valid non-negative integer.");
      return;
    }
  
    if (!hashTable) {
      setLog("Please create the hash table first.");
      return;
    }
  
    const success = hashTable.insert(key, collisionHandling);
  
    if (success) {
      let message = `Inserted key ${key}`;
      let finalIndex = hashTable.hashFunction(key); // Default hash function (key % tableSize)
      
      // Log message updates if probing is used
      if (collisionHandling !== "none") {
        // After the insert operation, get the final index after resolving collision
        finalIndex = hashTable.getFinalIndex(key, collisionHandling); // assuming a method to get the final index
        message += ` at index ${finalIndex} using ${collisionHandling}.`;
      } else {
        message += ` at index ${finalIndex}`;
      }
  
      setLog(message);
    } else {
      let collisionMessage = `Collision occurred for key ${key}!`;
  
      if (collisionHandling === "none") {
        collisionMessage += " Select a collision handling method.";
      } else {
        collisionMessage += ` Failed to insert key due to ${collisionHandling}.`;
      }
  
      setLog(collisionMessage);
    }
  
    setTable(hashTable.getTable());
    setInputValue("");
  };
  
  
  const handleDelete = () => {
    const key = parseInt(inputValue, 10);
    if (isNaN(key) || key < 0) {
      setLog("Please enter a valid non-negative integer.");
      return;
    }
  
    if (!hashTable) {
      setLog("Please create the hash table first.");
      return;
    }
  
    const success = hashTable.delete(key,collisionHandling);
  
    if (success) {
      const hashIndex = hashTable.getFinalIndex(key,collisionHandling); 
      let message = `Deleted key ${key} from index ${hashIndex}`;
  
      // If a custom hash function is used, we need to update the index
      if (customHashFunction.trim()) {
        message = `Deleted key ${key} using custom hash function from index ${hashTable.hashFunction(key)}`;
      }
  
      setLog(message);
    } else {
      setLog(`Key ${key} not found.`);
    }
  
    setTable(hashTable.getTable());
    setInputValue("");
  };
  

  const handleCollisionHandlingChange = (e) => {
    const newHandling = e.target.value;
    setCollisionHandling(newHandling);
    setLog(`Collision handling method updated to ${newHandling}.`);
  };

  return (
    <div className="hashtable-container">
      <h1>Hash Table Visualizer</h1>
      {!hashTable ? (
        <div className="setup">
          <input
            type="text"
            value={tableSize}
            onChange={(e) => setTableSize(e.target.value)}
            placeholder="Enter table size (5-30)"
          />
         <input
  type="text"
  value={customHashFunction}
  onChange={(e) => {
    const value = e.target.value;
    setCustomHashFunction(value);

    const customHashRegex = /^key\s*%\s*\d*$/; // Allows partial inputs
    if (value.trim() && !customHashRegex.test(value)) {
      setLog("Hash function must be in the format 'key % number'.");
    } else {
      setLog("");
    }
  }}
  placeholder="Enter hash function (e.g., 'key % 10')"
/>

          <button onClick={handleSetTableSize}>Create Hash Table</button>
        </div>
      ) : (
        <>
          <div className="hashtable">
            {table.map((value, index) => (
              <div key={index} className="cell">
                <div className="index">Index {index}</div>
                <div className="value">
                  {Array.isArray(value) ? value.join(", ") : value || "Empty"}
                </div>
              </div>
            ))}
          </div>
          <div className="controls">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter key"
            />
            <button onClick={handleInsert}>Insert</button>
            <button onClick={handleDelete}>Delete</button>
            {log.includes("Collision occurred") && (
              <select
                value={collisionHandling}
                onChange={handleCollisionHandlingChange}
              >
                <option value="none">None</option>
                <option value="chaining">Chaining</option>
                <option value="linear">Linear Probing</option>
                <option value="quadratic">Quadratic Probing</option>
                <option value="double">Double Hashing</option>
              </select>
            )}
          </div>
        </>
      )}
      <div className="log">{log}</div>
    </div>
  );
};

export default HashTableVisualizer;
