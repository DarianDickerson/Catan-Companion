//Board Class
class Board{
    constructor(){
        this._order = []
        this._turn = 0
    }
    
    //Creates and Sets the order of players & makes their pieces visible
    createPlayerOrder(color){
        //Check if the tile is empty
        if(document.querySelector(`#order${color}`).childNodes.length == 0){
            //Makes all elements specific to color visible
            document.querySelectorAll(`.player${color}`).forEach(n=> n.style.display = "table-row")

            //Create Player for that color and put it in turn order
            this._order.push(new Player(color,this._order.length))

            //Assigns color to the next turn order
            document.querySelector(`#order${color}`).innerText = this._order.length  
        }
    }
}

//Player Class
class Player{
    constructor(color){
        this._color = color
        this._tradeCount = 0
        
        //0:Wood, 1:Brick, 2:Wool, 3:Wheat, 4:Ore
        //Resources Collected
        this._cards = [0,0,0,0,0]
        //Resources Traded
        this._trades = [0,0,0,0,0]
        //2,3,4,5,6,7,8,9,10,11,12
        this._playerRolls = [0,0,0,0,0,0,0,0,0,0,0]
    }

}

//Dice Class
class DiceTrack{
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
        document.querySelector(`#span${index+2}`).innerText = this._totalRolls[index]
        this.updateGraph()

        //TODO: Needs access to other object to function 
        if(game._order.length > 0){
            //Increase individual color dice roll count
            game._order[game._turn % game._order.length]._playerRolls[index] += 1

            //Increase number of turns passed
            game._turn += 1
        }
    }

    //Updates the Dice Roll Graph for all numbers
    updateGraph(){
        let max = Math.max(...this._totalRolls)
        let rolls = this._totalRolls.reduce((a,c)=>a+c,0);
        this._totalRolls.forEach((n,i) => {
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

        //TODO: Needs access to other object to function
        //Clear individual colors' dice counts
        game._order.forEach(p => p._playerRolls.forEach((r,i) => p._playerRolls[i] = 0))
    }
}

class TradeCards{
    constructor(){
        //Contains record of values that have been altered to be updated later
        this.updateQueue = new Set()
        //Tracks which colors are involved in the current trade
        this.colorTrades = new Set()
    }

    //Increases the specified resource card number
    increaseCard(color, resource){
        let num = document.querySelector(`#span${color}${resource}`).innerText
        num = +num + 1
        document.querySelector(`#span${color}${resource}`).innerText = num
        this.updateQueue.add(`#span ${color} ${resource}`)
    }
    
    //Decreases the specified resource card number
    decreaseCard(color,resource){
        let num = document.querySelector(`#span${color}${resource}`).innerText
        num = +num - 1
        document.querySelector(`#span${color}${resource}`).innerText = num
        this.updateQueue.add(`#span ${color} ${resource}`)
    }

    //Submit Trades 
    submitTrade(){
        const resource = ["Wood","Brick","Wool","Wheat","Ore"]
        
        //Add every value that has been altered
        this.updateQueue.forEach(q => {
            //"#span color resource"
            let colRes = q.split(" ")
            let num = document.querySelector(colRes.join("")).innerText
            this.colorTrades.add(colRes[1])

            //TODO: Needs access to other object to function
            //Add to Trade Array of Player
            let i = game._order.findIndex(col => col === colRes[1])
            game._order[i]._trades[resource.indexOf(colRes[2])] += num
            //TODO: Update Stats to DOM
        })

        //Increase trade counter for colors
        this.colorTrades.forEach(t =>{
            let i = game._order.findIndex(col => col === t)
            game._order[i]._tradeCount += 1
            //TODO: Update Stats to DOM
        })
        
        this.colorTrades.clear()
        this.clearValues()
    }

    //Erase temporary card values
    clearValues(){
        this.updateQueue.forEach(function(q){
            document.querySelector(q.split(" ").join("")).innerText = 0
        })
        this.updateQueue.clear()
    }
}

const game = new Board() 
const dice = new DiceTrack()
const trade = new TradeCards()


//Event Listeners for Player Select
document.querySelector("#orderBlue").addEventListener("click",() => game.createPlayerOrder("Blue"))
document.querySelector("#orderGreen").addEventListener("click",() => game.createPlayerOrder("Green"))
document.querySelector("#orderRed").addEventListener("click",() => game.createPlayerOrder("Red"))
document.querySelector("#orderOrange").addEventListener("click",() => game.createPlayerOrder("Orange"))
document.querySelector("#orderWhite").addEventListener("click",() => game.createPlayerOrder("White"))
document.querySelector("#orderBrown").addEventListener("click",() => game.createPlayerOrder("Brown"))

//Event Listeners to increase count for dice rolls
document.querySelector("#but2").addEventListener("click", () => dice.numsButtons(0))
document.querySelector("#but3").addEventListener("click", () => dice.numsButtons(1))
document.querySelector("#but4").addEventListener("click", () => dice.numsButtons(2))
document.querySelector("#but5").addEventListener("click", () => dice.numsButtons(3))
document.querySelector("#but6").addEventListener("click", () => dice.numsButtons(4))
document.querySelector("#but7").addEventListener("click", () => dice.numsButtons(5))
document.querySelector("#but8").addEventListener("click", () => dice.numsButtons(6))
document.querySelector("#but9").addEventListener("click", () => dice.numsButtons(7))
document.querySelector("#but10").addEventListener("click", () => dice.numsButtons(8))
document.querySelector("#but11").addEventListener("click", () => dice.numsButtons(9))
document.querySelector("#but12").addEventListener("click", () => dice.numsButtons(10))

//Event Listener to Roll The Dice
document.querySelector("#roll").addEventListener("click", () => dice.roll())
//Event Listener to Clear the Dice
document.querySelector("#clearDice").addEventListener("click", () => dice.clearDice())

//Event Listeners to increase count for cards
//Blue
document.querySelector("#plusBlueWood").addEventListener("click", () => trade.increaseCard("Blue","Wood"))
document.querySelector("#plusBlueBrick").addEventListener("click", () => trade.increaseCard("Blue","Brick"))
document.querySelector("#plusBlueWool").addEventListener("click", () => trade.increaseCard("Blue","Wool"))
document.querySelector("#plusBlueWheat").addEventListener("click", () => trade.increaseCard("Blue","Wheat"))
document.querySelector("#plusBlueOre").addEventListener("click", () => trade.increaseCard("Blue","Ore"))
//Green
document.querySelector("#plusGreenWood").addEventListener("click", () => trade.increaseCard("Green","Wood"))
document.querySelector("#plusGreenBrick").addEventListener("click", () => trade.increaseCard("Green","Brick"))
document.querySelector("#plusGreenWool").addEventListener("click", () => trade.increaseCard("Green","Wool"))
document.querySelector("#plusGreenWheat").addEventListener("click", () => trade.increaseCard("Green","Wheat"))
document.querySelector("#plusGreenOre").addEventListener("click", () => trade.increaseCard("Green","Ore"))
//Red
document.querySelector("#plusRedWood").addEventListener("click", () => trade.increaseCard("Red","Wood"))
document.querySelector("#plusRedBrick").addEventListener("click", () => trade.increaseCard("Red","Brick"))
document.querySelector("#plusRedWool").addEventListener("click", () => trade.increaseCard("Red","Wool"))
document.querySelector("#plusRedWheat").addEventListener("click", () => trade.increaseCard("Red","Wheat"))
document.querySelector("#plusRedOre").addEventListener("click", () => trade.increaseCard("Red","Ore"))
//Orange
document.querySelector("#plusOrangeWood").addEventListener("click", () => trade.increaseCard("Orange","Wood"))
document.querySelector("#plusOrangeBrick").addEventListener("click", () => trade.increaseCard("Orange","Brick"))
document.querySelector("#plusOrangeWool").addEventListener("click", () => trade.increaseCard("Orange","Wool"))
document.querySelector("#plusOrangeWheat").addEventListener("click", () => trade.increaseCard("Orange","Wheat"))
document.querySelector("#plusOrangeOre").addEventListener("click", () => trade.increaseCard("Orange","Ore"))
//White
document.querySelector("#plusWhiteWood").addEventListener("click", () => trade.increaseCard("White","Wood"))
document.querySelector("#plusWhiteBrick").addEventListener("click", () => trade.increaseCard("White","Brick"))
document.querySelector("#plusWhiteWool").addEventListener("click", () => trade.increaseCard("White","Wool"))
document.querySelector("#plusWhiteWheat").addEventListener("click", () => trade.increaseCard("White","Wheat"))
document.querySelector("#plusWhiteOre").addEventListener("click", () => trade.increaseCard("White","Ore"))
//Brown
document.querySelector("#plusBrownWood").addEventListener("click", () => trade.increaseCard("Brown","Wood"))
document.querySelector("#plusBrownBrick").addEventListener("click", () => trade.increaseCard("Brown","Brick"))
document.querySelector("#plusBrownWool").addEventListener("click", () => trade.increaseCard("Brown","Wool"))
document.querySelector("#plusBrownWheat").addEventListener("click", () => trade.increaseCard("Brown","Wheat"))
document.querySelector("#plusBrownOre").addEventListener("click", () => trade.increaseCard("Brown","Ore"))

//Event Listeners to decrease count for cards
//Blue
document.querySelector("#minusBlueWood").addEventListener("click", () => trade.decreaseCard("Blue","Wood"))
document.querySelector("#minusBlueBrick").addEventListener("click", () => trade.decreaseCard("Blue","Brick"))
document.querySelector("#minusBlueWool").addEventListener("click", () => trade.decreaseCard("Blue","Wool"))
document.querySelector("#minusBlueWheat").addEventListener("click", () => trade.decreaseCard("Blue","Wheat"))
document.querySelector("#minusBlueOre").addEventListener("click", () => trade.decreaseCard("Blue","Ore"))
//Green
document.querySelector("#minusGreenWood").addEventListener("click", () => trade.decreaseCard("Green","Wood"))
document.querySelector("#minusGreenBrick").addEventListener("click", () => trade.decreaseCard("Green","Brick"))
document.querySelector("#minusGreenWool").addEventListener("click", () => trade.decreaseCard("Green","Wool"))
document.querySelector("#minusGreenWheat").addEventListener("click", () => trade.decreaseCard("Green","Wheat"))
document.querySelector("#minusGreenOre").addEventListener("click", () => trade.decreaseCard("Green","Ore"))
//Red
document.querySelector("#minusRedWood").addEventListener("click", () => trade.decreaseCard("Red","Wood"))
document.querySelector("#minusRedBrick").addEventListener("click", () => trade.decreaseCard("Red","Brick"))
document.querySelector("#minusRedWool").addEventListener("click", () => trade.decreaseCard("Red","Wool"))
document.querySelector("#minusRedWheat").addEventListener("click", () => trade.decreaseCard("Red","Wheat"))
document.querySelector("#minusRedOre").addEventListener("click", () => trade.decreaseCard("Red","Ore"))
//Orange
document.querySelector("#minusOrangeWood").addEventListener("click", () => trade.decreaseCard("Orange","Wood"))
document.querySelector("#minusOrangeBrick").addEventListener("click", () => trade.decreaseCard("Orange","Brick"))
document.querySelector("#minusOrangeWool").addEventListener("click", () => trade.decreaseCard("Orange","Wool"))
document.querySelector("#minusOrangeWheat").addEventListener("click", () => trade.decreaseCard("Orange","Wheat"))
document.querySelector("#minusOrangeOre").addEventListener("click", () => trade.decreaseCard("Orange","Ore"))
//White
document.querySelector("#minusWhiteWood").addEventListener("click", () => trade.decreaseCard("White","Wood"))
document.querySelector("#minusWhiteBrick").addEventListener("click", () => trade.decreaseCard("White","Brick"))
document.querySelector("#minusWhiteWool").addEventListener("click", () => trade.decreaseCard("White","Wool"))
document.querySelector("#minusWhiteWheat").addEventListener("click", () => trade.decreaseCard("White","Wheat"))
document.querySelector("#minusWhiteOre").addEventListener("click", () => trade.decreaseCard("White","Ore"))
//Brown
document.querySelector("#minusBrownWood").addEventListener("click", () => trade.decreaseCard("Brown","Wood"))
document.querySelector("#minusBrownBrick").addEventListener("click", () => trade.decreaseCard("Brown","Brick"))
document.querySelector("#minusBrownWool").addEventListener("click", () => trade.decreaseCard("Brown","Wool"))
document.querySelector("#minusBrownWheat").addEventListener("click", () => trade.decreaseCard("Brown","Wheat"))
document.querySelector("#minusBrownOre").addEventListener("click", () => trade.decreaseCard("Brown","Ore"))

//Event Listener to submit cards to player totals
document.querySelector("#submit").addEventListener("click", () => trade.submitTrade())
//Event Listener to clear temporary card values
document.querySelector("#clearValues").addEventListener("click", () => trade.clearValues())