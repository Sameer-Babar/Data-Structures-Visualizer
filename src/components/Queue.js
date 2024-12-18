class Queue{
    constructor(){
        this.items = []
    }
    enqueue(data){
        this.items.push(data)
    }
    isEmpty(){
        return this.items.length ===0
    }
    dequeue(){
        if (this.isEmpty()){
            return null
        }
        return this.items.shift()
    }
   peek(){
    return this.items[0]
   }
   size(){
    return this.items.length
   }
   clear(){
    this.items = []
   }
   getItems(){
    return [...this.items]
   }
}
export default Queue