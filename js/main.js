//Board Class
class Board{
    constructor(){
        this._order = []    //Holds player objects in their turn order        
        this._tiles = []    //Holds the board tile objects
        this._turn = 0      //Tracks the game turn
                            //Below: Array of images for tile backgrounds
                                //0:Wood, 1:Brick, 2:Wool, 3:Wheat, 4:Ore, 5:Desert 
        this._resourceImg = ["url(images/pieceWood.jpg)","url(images/pieceBrick.jpg)","url(images/pieceWool.jpg)",
        "url(images/pieceWheat.jpg)","url(images/pieceOre.jpg)","url(images/pieceDesert.png)"]

        this.createSmallBoard()     //Fills this._tiles with Hex objects for each piece of the board
        this._dice = new DiceTrack()
        this._trade = new TradeCards()
    }
    
    //Create Main Board of Hex Tiles
    createSmallBoard(){
        for(let i=0; i<30; i++){
            if(i<10){
                this._tiles.push(new Hex(`#hex0${i}`))
            }else{
            this._tiles.push(new Hex(`#hex${i}`))
            }
        }
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
            
            if(this._order.length > 4){
                document.querySelectorAll(".bigBoard").forEach(h => {h.style.display = "flex"})
                document.querySelector("#board").style.height = "1100px"
            }
        }
    }

    updateTile(hexID, i){
        //Update the DOM
        document.querySelector(hexID).style.background = this._resourceImg[i]
        document.querySelector(hexID).style.backgroundPosition = "inherit"
        document.querySelector(hexID).style.backgroundSize ="cover"
        //Update the Hex Object
        this._tiles[+hexID.slice(-2)].resource = this._resourceImg[i]
    }

    //Change the resource of the hex tile
    changeTile(hexID){
        //Get current resource the tile is on and increase the index by 1   
        let i = this._resourceImg.indexOf(this._tiles[+hexID.slice(-2)].resource)
        i === this._resourceImg.length -1 ? i=0 : i++
        this.updateTile(hexID, i)
    }

    //Randomizes each hex individually
    //TODO: Add Random number to the tile 
    fullRandom(){
        this._tiles.forEach(h => {
            let i = Math.floor(Math.random() * 6)
            this.updateTile(h._id,i)
        })
    }

    //Randomizes hexes based on how many of each resource is allowed in the game
    //TODO: Add random number to tile 
    legalRandom(){
        let legal = [0,0,0,0,1,1,1,2,2,2,2,3,3,3,3,4,4,4,5]
        let big = [0,0,1,1,2,2,3,3,4,4,5]
        if(this._order.length > 4){
            legal = legal.concat(big)
        }
        this._tiles.forEach((h,i) => {
            if(!((this._order.length < 5) && (i===12 || i===17 || i===18))){
                let j = legal[Math.floor(Math.random() * legal.length)]
                this.updateTile(h._id,j)
                legal.splice(legal.indexOf(j),1)
            }
        })
    }

    //TODO:
    //PLace Settlement
    placeSettlement(settleID){
        document.getElementById(settleID).style.background = "red"
    }

    //Toggle visibility of Stats section
    showStats(){
        if(document.querySelector("#reveal").style.display === "flex"){
            document.querySelector("#reveal").style.display = "none"
        }else{
            document.querySelector("#reveal").style.display = "flex"
        }
    }

    //Clear all game values
    clearGame(){
        const color = ["Blue","Green","Red","Orange","White","Brown"]
        const resource = ["Wood","Brick","Wool","Wheat","Ore"]
        this._turn = 0

        //Reset Cards Collected Values back to 0
        this._order.forEach((col)=>{ 
            document.querySelector(`#count${col._color}Total`).innerText = 0
            resource.forEach((r,j) =>{ 
                document.querySelector(`#count${col._color}${resource[j]}`).innerText = 0
            })
        })

        //Clear Order && Delete Player Objects 
        this._order.forEach(n => document.querySelector(`#order${n._color}`).innerText = "")
        while(this._order.length > 0){
            this._order.pop()
        }

        //Hides all color specific elements
        color.forEach(col => document.querySelectorAll(`.player${col}`).forEach(n=>n.style.display = "none"))

        //Hide Stats Section
        document.querySelector("#reveal").style.display = "none"

        //Clear temporary values in Trade Tracker 
        this._trade.clearValues()

        //Clear Dice Rolls
        this._dice.clearDice()
    }
}

class Hex{
    constructor(id){
        this._id = id
        this._num = 0
        this._settlements = []
        this.resource = "url(images/pieceDesert.png)"
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
            let colRes = q.split(" ")                                   //Split String into its values: #span, color, resource
            let num = document.querySelector(colRes.join("")).innerText //Grabs number the resource changes by from DOM 
            this.colorTrades.add(colRes[1])                             //Adds the color to ColorTrades set to track colors involved in trade

            //TODO: Needs access to other object to function
            //Add to Trade Array of Player
            let i = game._order.findIndex(col => col._color === colRes[1])  //Find the index of the player in the player array
            game._order[i]._trades[resource.indexOf(colRes[2])] += +num     //Update player trade array
            //TODO: Update Final Stats to DOM
        })

        //Increase trade counter for colors
        this.colorTrades.forEach(t =>{
            let i = game._order.findIndex(col => col._color === t)
            game._order[i]._tradeCount += 1
            //TODO: Update Final Stats to DOM
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
//const dice = new DiceTrack()
//const trade = new TradeCards()


//Event Listeners for Player Select
document.querySelector("#orderBlue").addEventListener("click",() => game.createPlayerOrder("Blue"))
document.querySelector("#orderGreen").addEventListener("click",() => game.createPlayerOrder("Green"))
document.querySelector("#orderRed").addEventListener("click",() => game.createPlayerOrder("Red"))
document.querySelector("#orderOrange").addEventListener("click",() => game.createPlayerOrder("Orange"))
document.querySelector("#orderWhite").addEventListener("click",() => game.createPlayerOrder("White"))
document.querySelector("#orderBrown").addEventListener("click",() => game.createPlayerOrder("Brown"))

//Event Listener to Toggle visibility of stat section
document.querySelector("#showStats").addEventListener("click", () => game.showStats())
//Event Listener in Player Select to Clear Game 
document.querySelector("#playerClear").addEventListener("click", () => game.clearGame())
//Event Listener in Stats to Clear Game
document.querySelector("#clearGame").addEventListener("click", () => game.clearGame())

//Event Listeners to increase count for dice rolls
document.querySelector("#but2").addEventListener("click", () => game._dice.numsButtons(0))
document.querySelector("#but3").addEventListener("click", () => game._dice.numsButtons(1))
document.querySelector("#but4").addEventListener("click", () => game._dice.numsButtons(2))
document.querySelector("#but5").addEventListener("click", () => game._dice.numsButtons(3))
document.querySelector("#but6").addEventListener("click", () => game._dice.numsButtons(4))
document.querySelector("#but7").addEventListener("click", () => game._dice.numsButtons(5))
document.querySelector("#but8").addEventListener("click", () => game._dice.numsButtons(6))
document.querySelector("#but9").addEventListener("click", () => game._dice.numsButtons(7))
document.querySelector("#but10").addEventListener("click", () => game._dice.numsButtons(8))
document.querySelector("#but11").addEventListener("click", () => game._dice.numsButtons(9))
document.querySelector("#but12").addEventListener("click", () => game._dice.numsButtons(10))

//Event Listener to Roll The Dice
document.querySelector("#roll").addEventListener("click", () => game._dice.roll())
//Event Listener to Clear the Dice
document.querySelector("#clearDice").addEventListener("click", () => game._dice.clearDice())

//Event Listeners to increase count for cards
//Blue
document.querySelector("#plusBlueWood").addEventListener("click", () => game._trade.increaseCard("Blue","Wood"))
document.querySelector("#plusBlueBrick").addEventListener("click", () => game._trade.increaseCard("Blue","Brick"))
document.querySelector("#plusBlueWool").addEventListener("click", () => game._trade.increaseCard("Blue","Wool"))
document.querySelector("#plusBlueWheat").addEventListener("click", () => game._trade.increaseCard("Blue","Wheat"))
document.querySelector("#plusBlueOre").addEventListener("click", () => game._trade.increaseCard("Blue","Ore"))
//Green
document.querySelector("#plusGreenWood").addEventListener("click", () => game._trade.increaseCard("Green","Wood"))
document.querySelector("#plusGreenBrick").addEventListener("click", () => game._trade.increaseCard("Green","Brick"))
document.querySelector("#plusGreenWool").addEventListener("click", () => game._trade.increaseCard("Green","Wool"))
document.querySelector("#plusGreenWheat").addEventListener("click", () => game._trade.increaseCard("Green","Wheat"))
document.querySelector("#plusGreenOre").addEventListener("click", () => game._trade.increaseCard("Green","Ore"))
//Red
document.querySelector("#plusRedWood").addEventListener("click", () => game._trade.increaseCard("Red","Wood"))
document.querySelector("#plusRedBrick").addEventListener("click", () => game._trade.increaseCard("Red","Brick"))
document.querySelector("#plusRedWool").addEventListener("click", () => game._trade.increaseCard("Red","Wool"))
document.querySelector("#plusRedWheat").addEventListener("click", () => game._trade.increaseCard("Red","Wheat"))
document.querySelector("#plusRedOre").addEventListener("click", () => game._trade.increaseCard("Red","Ore"))
//Orange
document.querySelector("#plusOrangeWood").addEventListener("click", () => game._trade.increaseCard("Orange","Wood"))
document.querySelector("#plusOrangeBrick").addEventListener("click", () => game._trade.increaseCard("Orange","Brick"))
document.querySelector("#plusOrangeWool").addEventListener("click", () => game._trade.increaseCard("Orange","Wool"))
document.querySelector("#plusOrangeWheat").addEventListener("click", () => game._trade.increaseCard("Orange","Wheat"))
document.querySelector("#plusOrangeOre").addEventListener("click", () => game._trade.increaseCard("Orange","Ore"))
//White
document.querySelector("#plusWhiteWood").addEventListener("click", () => game._trade.increaseCard("White","Wood"))
document.querySelector("#plusWhiteBrick").addEventListener("click", () => game._trade.increaseCard("White","Brick"))
document.querySelector("#plusWhiteWool").addEventListener("click", () => game._trade.increaseCard("White","Wool"))
document.querySelector("#plusWhiteWheat").addEventListener("click", () => game._trade.increaseCard("White","Wheat"))
document.querySelector("#plusWhiteOre").addEventListener("click", () => game._trade.increaseCard("White","Ore"))
//Brown
document.querySelector("#plusBrownWood").addEventListener("click", () => game._trade.increaseCard("Brown","Wood"))
document.querySelector("#plusBrownBrick").addEventListener("click", () => game._trade.increaseCard("Brown","Brick"))
document.querySelector("#plusBrownWool").addEventListener("click", () => game._trade.increaseCard("Brown","Wool"))
document.querySelector("#plusBrownWheat").addEventListener("click", () => game._trade.increaseCard("Brown","Wheat"))
document.querySelector("#plusBrownOre").addEventListener("click", () => game._trade.increaseCard("Brown","Ore"))

//Event Listeners to decrease count for cards
//Blue
document.querySelector("#minusBlueWood").addEventListener("click", () => game._trade.decreaseCard("Blue","Wood"))
document.querySelector("#minusBlueBrick").addEventListener("click", () => game._trade.decreaseCard("Blue","Brick"))
document.querySelector("#minusBlueWool").addEventListener("click", () => game._trade.decreaseCard("Blue","Wool"))
document.querySelector("#minusBlueWheat").addEventListener("click", () => game._trade.decreaseCard("Blue","Wheat"))
document.querySelector("#minusBlueOre").addEventListener("click", () => game._trade.decreaseCard("Blue","Ore"))
//Green
document.querySelector("#minusGreenWood").addEventListener("click", () => game._trade.decreaseCard("Green","Wood"))
document.querySelector("#minusGreenBrick").addEventListener("click", () => game._trade.decreaseCard("Green","Brick"))
document.querySelector("#minusGreenWool").addEventListener("click", () => game._trade.decreaseCard("Green","Wool"))
document.querySelector("#minusGreenWheat").addEventListener("click", () => game._trade.decreaseCard("Green","Wheat"))
document.querySelector("#minusGreenOre").addEventListener("click", () => game._trade.decreaseCard("Green","Ore"))
//Red
document.querySelector("#minusRedWood").addEventListener("click", () => game._trade.decreaseCard("Red","Wood"))
document.querySelector("#minusRedBrick").addEventListener("click", () => game._trade.decreaseCard("Red","Brick"))
document.querySelector("#minusRedWool").addEventListener("click", () => game._trade.decreaseCard("Red","Wool"))
document.querySelector("#minusRedWheat").addEventListener("click", () => game._trade.decreaseCard("Red","Wheat"))
document.querySelector("#minusRedOre").addEventListener("click", () => game._trade.decreaseCard("Red","Ore"))
//Orange
document.querySelector("#minusOrangeWood").addEventListener("click", () => game._trade.decreaseCard("Orange","Wood"))
document.querySelector("#minusOrangeBrick").addEventListener("click", () => game._trade.decreaseCard("Orange","Brick"))
document.querySelector("#minusOrangeWool").addEventListener("click", () => game._trade.decreaseCard("Orange","Wool"))
document.querySelector("#minusOrangeWheat").addEventListener("click", () => game._trade.decreaseCard("Orange","Wheat"))
document.querySelector("#minusOrangeOre").addEventListener("click", () => game._trade.decreaseCard("Orange","Ore"))
//White
document.querySelector("#minusWhiteWood").addEventListener("click", () => game._trade.decreaseCard("White","Wood"))
document.querySelector("#minusWhiteBrick").addEventListener("click", () => game._trade.decreaseCard("White","Brick"))
document.querySelector("#minusWhiteWool").addEventListener("click", () => game._trade.decreaseCard("White","Wool"))
document.querySelector("#minusWhiteWheat").addEventListener("click", () => game._trade.decreaseCard("White","Wheat"))
document.querySelector("#minusWhiteOre").addEventListener("click", () => game._trade.decreaseCard("White","Ore"))
//Brown
document.querySelector("#minusBrownWood").addEventListener("click", () => game._trade.decreaseCard("Brown","Wood"))
document.querySelector("#minusBrownBrick").addEventListener("click", () => game._trade.decreaseCard("Brown","Brick"))
document.querySelector("#minusBrownWool").addEventListener("click", () => game._trade.decreaseCard("Brown","Wool"))
document.querySelector("#minusBrownWheat").addEventListener("click", () => game._trade.decreaseCard("Brown","Wheat"))
document.querySelector("#minusBrownOre").addEventListener("click", () => game._trade.decreaseCard("Brown","Ore"))

//Event Listener to submit cards to player totals
document.querySelector("#submit").addEventListener("click", () => game._trade.submitTrade())
//Event Listener to clear temporary card values
document.querySelector("#clearValues").addEventListener("click", () => game._trade.clearValues())

//Event Listeners for Hex Resource Tiles
document.querySelector("#hex00").addEventListener("click", () => game.changeTile("#hex00"))
document.querySelector("#hex01").addEventListener("click", () => game.changeTile("#hex01"))
document.querySelector("#hex02").addEventListener("click", () => game.changeTile("#hex02"))
document.querySelector("#hex03").addEventListener("click", () => game.changeTile("#hex03"))
document.querySelector("#hex04").addEventListener("click", () => game.changeTile("#hex04"))
document.querySelector("#hex05").addEventListener("click", () => game.changeTile("#hex05"))
document.querySelector("#hex06").addEventListener("click", () => game.changeTile("#hex06"))
document.querySelector("#hex07").addEventListener("click", () => game.changeTile("#hex07"))
document.querySelector("#hex08").addEventListener("click", () => game.changeTile("#hex08"))
document.querySelector("#hex09").addEventListener("click", () => game.changeTile("#hex09"))
document.querySelector("#hex10").addEventListener("click", () => game.changeTile("#hex10"))
document.querySelector("#hex11").addEventListener("click", () => game.changeTile("#hex11"))
document.querySelector("#hex12").addEventListener("click", () => game.changeTile("#hex12"))
document.querySelector("#hex13").addEventListener("click", () => game.changeTile("#hex13"))
document.querySelector("#hex14").addEventListener("click", () => game.changeTile("#hex14"))
document.querySelector("#hex15").addEventListener("click", () => game.changeTile("#hex15"))
document.querySelector("#hex16").addEventListener("click", () => game.changeTile("#hex16"))
document.querySelector("#hex17").addEventListener("click", () => game.changeTile("#hex17"))
document.querySelector("#hex18").addEventListener("click", () => game.changeTile("#hex18"))
document.querySelector("#hex19").addEventListener("click", () => game.changeTile("#hex19"))
document.querySelector("#hex20").addEventListener("click", () => game.changeTile("#hex20"))
document.querySelector("#hex21").addEventListener("click", () => game.changeTile("#hex21"))
document.querySelector("#hex22").addEventListener("click", () => game.changeTile("#hex22"))
document.querySelector("#hex23").addEventListener("click", () => game.changeTile("#hex23"))
document.querySelector("#hex24").addEventListener("click", () => game.changeTile("#hex24"))
document.querySelector("#hex25").addEventListener("click", () => game.changeTile("#hex25"))
document.querySelector("#hex26").addEventListener("click", () => game.changeTile("#hex26"))
document.querySelector("#hex27").addEventListener("click", () => game.changeTile("#hex27"))
document.querySelector("#hex28").addEventListener("click", () => game.changeTile("#hex28"))
document.querySelector("#hex29").addEventListener("click", () => game.changeTile("#hex29"))

//Event Listeners for Settlement placement
//Row0
document.getElementById("d-nh-00-nh").addEventListener("click", () => game.placeSettlement("d-nh-00-nh")) 	
document.getElementById("u:nh:nh:00").addEventListener("click", () => game.placeSettlement("u:nh:nh:00"))
document.getElementById("d:nh:01:00").addEventListener("click", () => game.placeSettlement("d:nh:01:00"))					
document.getElementById("u:nh:nh:01").addEventListener("click", () => game.placeSettlement("u:nh:nh:01"))				
document.getElementById("d:nh:02:01").addEventListener("click", () => game.placeSettlement("d:nh:02:01"))				
document.getElementById("u:nh:nh:02").addEventListener("click", () => game.placeSettlement("u:nh:nh:02"))				
document.getElementById("d:nh:nh:02").addEventListener("click", () => game.placeSettlement("d:nh:nh:02"))
//Row1
document.getElementById("d:nh:03:nh").addEventListener("click", () => game.placeSettlement("d:nh:03:nh"))						
document.getElementById("u:nh:00:03").addEventListener("click", () => game.placeSettlement("u:nh:00:03"))
document.getElementById("d:00:04:03").addEventListener("click", () => game.placeSettlement("d:00:04:03"))						
document.getElementById("u:00:01:04").addEventListener("click", () => game.placeSettlement("u:00:01:04"))					
document.getElementById("d:01:05:04").addEventListener("click", () => game.placeSettlement("d:01:05:04"))					
document.getElementById("u:01:02:05").addEventListener("click", () => game.placeSettlement("u:01:02:05"))					
document.getElementById("d:02:06:05").addEventListener("click", () => game.placeSettlement("d:02:06:05"))
document.getElementById("u:02:nh:06").addEventListener("click", () => game.placeSettlement("u:02:nh:06"))						
document.getElementById("d:nh:nh:06").addEventListener("click", () => game.placeSettlement("d:nh:nh:06"))
//Row2
document.getElementById("d:nh:07:nh").addEventListener("click", () => game.placeSettlement("d:nh:07:nh"))						
document.getElementById("u:nh:03:07").addEventListener("click", () => game.placeSettlement("u:nh:03:07"))
document.getElementById("d:03:08:07").addEventListener("click", () => game.placeSettlement("d:03:08:07"))						
document.getElementById("u:03:04:08").addEventListener("click", () => game.placeSettlement("u:03:04:08"))					
document.getElementById("d:04:09:08").addEventListener("click", () => game.placeSettlement("d:04:09:08"))					
document.getElementById("u:04:05:09").addEventListener("click", () => game.placeSettlement("u:04:05:09"))					
document.getElementById("d:05:10:09").addEventListener("click", () => game.placeSettlement("d:05:10:09"))
document.getElementById("u:05:06:10").addEventListener("click", () => game.placeSettlement("u:05:06:10"))						
document.getElementById("d:06:11:10").addEventListener("click", () => game.placeSettlement("d:06:11:10"))	
document.getElementById("u:06:nh:11").addEventListener("click", () => game.placeSettlement("u:06:nh:11"))						
document.getElementById("d:nh:nh:11").addEventListener("click", () => game.placeSettlement("d:nh:nh:11"))
//Row3
document.getElementById("d:nh:12:nh").addEventListener("click", () => game.placeSettlement("d:nh:12:nh"))						
document.getElementById("u:nh:07:12").addEventListener("click", () => game.placeSettlement("u:nh:07:12"))
document.getElementById("d:07:13:12").addEventListener("click", () => game.placeSettlement("d:07:13:12"))						
document.getElementById("u:07:08:13").addEventListener("click", () => game.placeSettlement("u:07:08:13"))					
document.getElementById("d:08:14:13").addEventListener("click", () => game.placeSettlement("d:08:14:13"))					
document.getElementById("u:08:09:14").addEventListener("click", () => game.placeSettlement("u:08:09:14"))				
document.getElementById("d:09:15:14").addEventListener("click", () => game.placeSettlement("d:09:15:14"))
document.getElementById("u:09:10:15").addEventListener("click", () => game.placeSettlement("u:09:10:15"))						
document.getElementById("d:10:16:15").addEventListener("click", () => game.placeSettlement("d:10:16:15"))	
document.getElementById("u:10:11:16").addEventListener("click", () => game.placeSettlement("u:10:11:16"))						
document.getElementById("d:11:17:16").addEventListener("click", () => game.placeSettlement("d:11:17:16"))	
document.getElementById("u:11:nh:17").addEventListener("click", () => game.placeSettlement("u:11:nh:17"))						
document.getElementById("d:nh:nh:17").addEventListener("click", () => game.placeSettlement("d:nh:nh:17"))
//Row4
document.getElementById("u:nh:12:nh").addEventListener("click", () => game.placeSettlement("u:nh:12:nh"))
document.getElementById("d:12:18:nh").addEventListener("click", () => game.placeSettlement("d:12:18:nh"))						
document.getElementById("u:12:13:18").addEventListener("click", () => game.placeSettlement("u:12:13:18"))				
document.getElementById("d:13:19:18").addEventListener("click", () => game.placeSettlement("d:13:19:18"))					
document.getElementById("u:13:14:19").addEventListener("click", () => game.placeSettlement("u:13:14:19"))					
document.getElementById("d:14:20:19").addEventListener("click", () => game.placeSettlement("d:14:20:19"))
document.getElementById("u:14:15:20").addEventListener("click", () => game.placeSettlement("u:14:15:20"))						
document.getElementById("d:15:21:20").addEventListener("click", () => game.placeSettlement("d:15:21:20"))
document.getElementById("u:15:16:21").addEventListener("click", () => game.placeSettlement("u:15:16:21"))			
document.getElementById("d:16:22:21").addEventListener("click", () => game.placeSettlement("d:16:22:21"))
document.getElementById("u:16:17:22").addEventListener("click", () => game.placeSettlement("u:16:17:22"))			
document.getElementById("d:17:nh:22").addEventListener("click", () => game.placeSettlement("d:17:nh:22"))	
document.getElementById("u:17:nh:nh").addEventListener("click", () => game.placeSettlement("u:17:nh:nh"))
//Row5
document.getElementById("u:nh:18:nh").addEventListener("click", () => game.placeSettlement("u:nh:18:nh"))				
document.getElementById("d:18:23:nh").addEventListener("click", () => game.placeSettlement("d:18:23:nh"))					
document.getElementById("u:18:19:23").addEventListener("click", () => game.placeSettlement("u:18:19:23"))					
document.getElementById("d:19:24:23").addEventListener("click", () => game.placeSettlement("d:19:24:23"))
document.getElementById("u:19:20:24").addEventListener("click", () => game.placeSettlement("u:19:20:24"))						
document.getElementById("d:20:25:24").addEventListener("click", () => game.placeSettlement("d:20:25:24"))	
document.getElementById("u:20:21:25").addEventListener("click", () => game.placeSettlement("u:20:21:25"))						
document.getElementById("d:21:26:25").addEventListener("click", () => game.placeSettlement("d:21:26:25"))	
document.getElementById("u:21:22:26").addEventListener("click", () => game.placeSettlement("u:21:22:26"))						
document.getElementById("d:22:nh:26").addEventListener("click", () => game.placeSettlement("d:22:nh:26"))	
document.getElementById("u:22:nh:nh").addEventListener("click", () => game.placeSettlement("u:22:nh:nh"))
//Row6
document.getElementById("u:nh:23:nh").addEventListener("click", () => game.placeSettlement("u:nh:23:nh"))					
document.getElementById("d:23:27:nh").addEventListener("click", () => game.placeSettlement("d:23:27:nh"))
document.getElementById("u:23:24:27").addEventListener("click", () => game.placeSettlement("u:23:24:27"))						
document.getElementById("d:24:28:27").addEventListener("click", () => game.placeSettlement("d:24:28:27"))	
document.getElementById("u:24:25:28").addEventListener("click", () => game.placeSettlement("u:24:25:28"))						
document.getElementById("d:25:29:28").addEventListener("click", () => game.placeSettlement("d:25:29:28"))	
document.getElementById("u:25:26:29").addEventListener("click", () => game.placeSettlement("u:25:26:29"))						
document.getElementById("d:26:nh:29").addEventListener("click", () => game.placeSettlement("d:26:nh:29"))	
document.getElementById("u:26:nh:nh").addEventListener("click", () => game.placeSettlement("u:26:nh:nh"))
//Row7
document.getElementById("u:nh:27:nh").addEventListener("click", () => game.placeSettlement("u:nh:27:nh"))						
document.getElementById("d:27:nh:nh").addEventListener("click", () => game.placeSettlement("d:27:nh:nh"))
document.getElementById("u:27:28:nh").addEventListener("click", () => game.placeSettlement("u:27:28:nh"))						
document.getElementById("d:28:nh:nh").addEventListener("click", () => game.placeSettlement("d:28:nh:nh"))	
document.getElementById("u:28:29:nh").addEventListener("click", () => game.placeSettlement("u:28:29:nh"))						
document.getElementById("d:29:nh:nh").addEventListener("click", () => game.placeSettlement("d:29:nh:nh"))	
document.getElementById("u:29:nh:nh").addEventListener("click", () => game.placeSettlement("u:29:nh:nh"))