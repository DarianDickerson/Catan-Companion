//Player Object extends Game
class Player{
    constructor(color, order){
        this._color = color
        this._order = order
        
        //Resources Collected
        //0:Wood, 1:Brick, 2:Wool, 3:Wheat, 4:Ore
        this._cards = [0,0,0,0,0]
        //2,3,4,5,6,7,8,9,10,11,12
        this._playerRolls = [0,0,0,0,0,0,0,0,0,0,0]
    }
}

//Dice Object extends Game
class Dice{
    constructor(){
        //Dice Values, Starts randomly from 1-6
        this._dice1 = Math.floor(Math.random() * 6) + 1
        this._dice2 = Math.floor(Math.random() * 6) + 1

        //Sets indivual dice to corresponding img
        for(let i=1;i<=2; i++){
            document.querySelector(`#dice${i}`).src = `images/${eval(`this._dice${i}`)}.png`
            document.querySelector(`#dice${i}`).alt = eval(`this._dice${i}`)
        }
    
        //Initiates the total dice rolls counter
        //2,3,4,5,6,7,8,9,10,11,12
        this._totalRolls = [0,0,0,0,0,0,0,0,0,0,0]
    }

    //Rolls Dice
    roll(){
        //Set the dice to random number from 1-6
        this._dice1 = Math.floor(Math.random() * 6) + 1
        this._dice2 = Math.floor(Math.random() * 6) + 1

        //Sets indivual dice to corresponding img
        for(let i=1;i<=2; i++){
            document.querySelector(`#dice${i}`).src = `images/${eval(`this._dice${i}`)}.png`
            document.querySelector(`#dice${i}`).alt = eval(`this._dice${i}`)
        }
        
        //Increase Dice Roll count
        this.numsButtons(this._dice1 + this._dice2 - 2)
    } 
    
    //Increases the counter on the dice roll passed in
    numsButtons(index){
        //Increase specific number total count
        this._totalRolls[index] += 1
        document.querySelector(`#span${index+2}`).innerText = `${this._totalRolls[index]}`
        this.updateGraph()

        /*TODO:
        //Increase individual color dice roll count
        let player = (_totalRolls.reduce((a,c)=>a+c,0)-1) % order.length
        if(order[player][0].has(index+2)){
            order[player][0].set(index+2, order[player][0].get(index+2) + 1)
        }else{
            order[player][0].set(index+2, 1)
        }
        */
    }

    //Updates the Dice Roll Graph for all numbers
    updateGraph(){
        let max = Math.max(...this._totalRolls)
        let rolls = this._totalRolls.reduce((a,c)=>a+c,0)
        this._totalRolls.forEach(function(n,i){
            if(max === 0){
                //Graph is empty
                document.querySelector(`#bar${i+2}`).style.height = "0px"
            }
            else if(n === max){
                //Largest number, fills bar
                document.querySelector(`#bar${i+2}`).style.height = "200px"
            }
            else{
                //Calculate relative height of bar
                //numCount/max = x/200 => x = 200(numCount)/max
                let numHeight = Math.floor(n*200/max)
                document.querySelector(`#bar${i+2}`).style.height = `${numHeight}px`
            }
        })
        document.querySelector(`#totalRolls`).innerText = `Total Rolls: ${rolls}`    
    }

    //Clears the Dice Roll graph and resets all the counts to zero
    clearDice(){
        this._totalRolls.forEach((n,i) => {
            this._totalRolls[i] = 0
            document.querySelector(`#span${i+2}`).innerText = "0"
        })
        this.updateGraph()

        /*TODO:
        //Clear individual colors' dice counts
        order.forEach(p=> p[0].clear())
        */
    }
}

let diceTrack = new Dice()

//Event Listeners to increase count for dice rolls
document.querySelector("#but2").addEventListener("click", () => diceTrack.numsButtons(0))
document.querySelector("#but3").addEventListener("click", () => diceTrack.numsButtons(1))
document.querySelector("#but4").addEventListener("click", () => diceTrack.numsButtons(2))
document.querySelector("#but5").addEventListener("click", () => diceTrack.numsButtons(3))
document.querySelector("#but6").addEventListener("click", () => diceTrack.numsButtons(4))
document.querySelector("#but7").addEventListener("click", () => diceTrack.numsButtons(5))
document.querySelector("#but8").addEventListener("click", () => diceTrack.numsButtons(6))
document.querySelector("#but9").addEventListener("click", () => diceTrack.numsButtons(7))
document.querySelector("#but10").addEventListener("click", () => diceTrack.numsButtons(8))
document.querySelector("#but11").addEventListener("click", () => diceTrack.numsButtons(9))
document.querySelector("#but12").addEventListener("click", () => diceTrack.numsButtons(10))

//Event Listener to Roll The Dice
document.querySelector("#roll").addEventListener("click", diceTrack.roll)
//Event Listener to Clear the Dice
document.querySelector("#clearDice").addEventListener("click", diceTrack.clearDice)