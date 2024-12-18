class HashTable {
  constructor(size) {
    this.size = size;
    this.count = 0; // Keeps track of the number of elements in the table
    this.table = new Array(size).fill(null).map(() => []); // Chaining method for collisions
  }

  hashFunction(key) {
    return key % this.size; // Primary hash function
  }

  doubleHash(key) {
   
    return  this.size - 1 - (key % this.size -1);
  }

  loadFactor() {
    return this.count / this.size;
  }

  resize(collisionHandling) {
    const newSize = this.size * 2; 
    const newTable = new Array(newSize).fill(null).map(() => []); 
    this.size = newSize
    // Rehash all existing keys and re-insert them into the new table
    this.table.forEach((bucket) => {
      bucket.forEach((key) => {
        const index = this.hashFunction(key) % newSize; // Calculate new index based on new size
        let probeIndex = index;
        let i = 0;

        // Re-insert the key into the new table based on the selected collision handling
        if (collisionHandling === "none") {
          if (newTable[probeIndex].length === 0) {
            newTable[probeIndex].push(key);
          }
        } else if (collisionHandling === "chaining") {
          newTable[probeIndex].push(key);
        } else {
          // Handle probing-based collision handling
          while (true) {
            if (newTable[probeIndex].length === 0) {
              newTable[probeIndex].push(key);
              break;
            }

            if (newTable[probeIndex].includes(key)) {
              break; // Duplicate key
            }

            // Probing logic
            if (collisionHandling === "linear") {
              probeIndex = (index + i) % newSize;
            } else if (collisionHandling === "quadratic") {
              probeIndex = (index + i * i) % newSize;
            } else if (collisionHandling === "double") {
              const step = this.doubleHash(key);
              probeIndex = (index + i * step) % newSize;
            }

            i++;
            if (i === newSize) {
              console.log("Table is full, failed to re-insert key.");
              break; // Table is full, can't insert
            }
          }
        }
      });
    });

   
    this.table = newTable; // Set the new table as the active one
}


  insert(key, collisionHandling) {
    if (this.loadFactor() > 0.75) {
      this.resize(collisionHandling); // Resize the table if load factor exceeds 75%
     
    }

    const index = this.hashFunction(key);
    let probeIndex = index;
    let i = 0;

    if (collisionHandling === "none") {
      if (this.table[index].length === 0) {
        this.table[index].push(key); 
        this.count++;
        return true;
      }
      return false; // Collision occurred
    }

    if (collisionHandling === "chaining") {
      const bucket = this.table[index];
      if (!bucket.includes(key)) {
        bucket.push(key);
        this.count++;
        return true;
      }
      return false; // Duplicate key
    }

    while (true) {
      if (this.table[probeIndex].length === 0) {
        this.table[probeIndex].push(key);
        this.count++;
        return true; // Insert successful
      }

      if (this.table[probeIndex].includes(key)) {
        return false; // Duplicate key
      }

      // Probing logic
      if (collisionHandling === "linear") {
        probeIndex = (index + i) % this.size;
      } else if (collisionHandling === "quadratic") {
        probeIndex = (index + i * i) % this.size;
      } else if (collisionHandling === "double") {
        const step = this.doubleHash(key);
        probeIndex = (index + i * step) % this.size;
      }

      i++;
      if (i === this.size) {
        console.log("Table is full, failed to insert key.");
        return false; // Table is full
      }
    }
  }

  delete(key, collisionHandling) {
    const index = this.hashFunction(key);
    let probeIndex = index;  // Start from the hashed index
    let i = 0;

    // Check for different collision handling methods
    if (collisionHandling === "none") {
        // For direct access without collision, just check the bucket
        const bucket = this.table[index];
        const keyIndex = bucket.indexOf(key);
        if (keyIndex !== -1) {
            bucket.splice(keyIndex, 1);  // Remove key
            this.count--;
            return true;
        }
        return false; // Key not found
    }

    // Handle probing-based collision handling
    while (this.table[probeIndex].length !== 0) {
        // If the key is found, delete it
        const bucket = this.table[probeIndex];
        const keyIndex = bucket.indexOf(key);

        if (keyIndex !== -1) {
            bucket.splice(keyIndex, 1);  // Remove the key from the bucket
            this.count--;

            // Rehash and move subsequent elements, if any, to fill the slot
            if (collisionHandling !== "chaining") {
                let nextIndex = (probeIndex + 1) % this.size;
                while (this.table[nextIndex].length > 0) {
                    // Move the element to the current slot
                    const element = this.table[nextIndex].shift();
                    this.insert(element, collisionHandling);
                    nextIndex = (nextIndex + 1) % this.size;
                }
            }

            return true; // Successfully deleted
        }

        // If key is not found, move to the next index based on the collision strategy
        if (collisionHandling === "linear") {
            probeIndex = (index + i) % this.size;
        } else if (collisionHandling === "quadratic") {
            probeIndex = (index + i * i) % this.size;
        } else if (collisionHandling === "double") {
            const step = this.doubleHash(key);
            probeIndex = (index + i * step) % this.size;
        }

        i++; // Increment probing counter
        if (i === this.size) {
            break; // Table is full, no key found
        }
    }

    return false; // Key not found after full probe cycle
}

  getFinalIndex(key, collisionHandling) {
    let index = this.hashFunction(key);

    if (collisionHandling === "linear") {
        while (this.table[index].length !== 0 && !this.table[index].includes(key)) {
            index = (index + 1) % this.size;
        }
    } else if (collisionHandling === "quadratic") {
        let i = 1;
        while (this.table[index].length !== 0 && !this.table[index].includes(key)) {
            index = (index + i * i) % this.size;
            i++;
        }
    } else if (collisionHandling === "double") {
        let hash2 = this.doubleHash(key);
        while (this.table[index].length !== 0 && !this.table[index].includes(key)) {
            index = (index + hash2) % this.size;
        }
    }

    return index;
}


  getTable() {
    return this.table.map((bucket) => (bucket.length > 0 ? bucket : "Empty"));
  }
}

export default HashTable;
