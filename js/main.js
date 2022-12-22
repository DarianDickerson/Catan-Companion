//Board Class
class Board{
    constructor(){
        this._turn = 0          //Tracks the game turn 
        this._selectPlace = ""  //ID of currently highlighted settlement Place
        this._selectType = ""   //ID of currently highlighted settlement Type
        this._selectColor = ""  //ID of currently highlighted settlement Color
        this._robberPlace = ""  //ID of robber location
        this._order = []        //Holds player objects in their turn order        
        this._tiles = []        //Holds the board tile objects
        this._resourceImg = ["url(images/pieceWood.jpg)","url(images/pieceBrick.jpg)",  
            "url(images/pieceWool.jpg)","url(images/pieceWheat.jpg)",
            "url(images/pieceOre.jpg)","url(images/pieceDesert.png)"]       //Array of images for tile backgrounds
                                                                            //0:Wood, 1:Brick, 2:Wool, 3:Wheat, 4:Ore, 5:Desert

        this.createBoard()     //Fills this._tiles with Hex objects for each piece of the board
        this._dice = new DiceTrack()
        this._trade = new TradeCards()
    }
    
    //Create Main Board of Hex Tiles
    createBoard(){
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
            
            if(this._order.length === 5){
                document.querySelectorAll(".bigBoard").forEach(h => {h.style.display = "flex"})
                document.querySelector("#board").style.height = "1100px"
                this.legalRandom()
            }
        }
    }

    updateTile(hexID, i){
        //Update the DOM
        document.querySelector(hexID).style.background = this._resourceImg[i]
        document.querySelector(hexID).style.backgroundPosition = "inherit"  //TODO: Anything better than inherit? Might be causing problems
        document.querySelector(hexID).style.backgroundSize ="cover"
        //Update the Hex Object
        this._tiles[+hexID.slice(-2)].resource = this._resourceImg[i]
        this._tiles[+hexID.slice(-2)]._resourceNum = i                              //Set the tile resourceNumber to the new index
    }

    //Change the resource of the hex tile
    //Get current resource the tile is on and increase the index by 1  
    changeTile(hexID){  
        let i = this._resourceImg.indexOf(this._tiles[+hexID.slice(-2)].resource)   //Find current index of resource
        i === this._resourceImg.length -1 ? i=0 : i++                               //Increase the index by 1
        this.updateTile(hexID, i)                                                   //Update the tile on the DOM
    }

    //Randomizes each hex individually
    fullRandom(){
        this._tiles.forEach((hex,i) => {
            let j = Math.floor(Math.random() * 6)   //Random value 0-5 refering to recource
            this.updateTile(hex._id,j)              //Update the Tile on the DOM
            
            if(j === 5) j = 1                       //Tile is Desert, no number needed
            else{                                   //Random number 2 - 12, excluding 7
                do{
                    j = Math.floor(Math.random() * 11) + 2
                }while(j === 7)
            }

            hex._num = j                                        //Set the Hex number
            hex.updateHexNumber("#num" + hex._id.substr(4), i)  //Update Hex Number to the DOM
        })
    }

    //Randomizes hexes based on how many of each resource is allowed in the game
    legalRandom(){
        //Resourece Tiles
        let legal = [0,0,0,0,1,1,1,2,2,2,2,3,3,3,3,4,4,4,5]
        let big = [0,0,1,1,2,2,3,3,4,4,5]
        //Number Tiles
        let numLegal = [2,3,3,4,4,5,5,6,6,8,8,9,9,10,10,11,11,12]
        let numBig = [2,3,4,5,6,8,9,10,11,12]

        if(this._order.length > 4){             //More than 4 players converts to Big Board
            legal = legal.concat(big)           //Add extra big board resource pieces to legal array
            numLegal = numLegal.concat(numBig)  //Add extra big board numbers to legal numbers array
        }
        this._tiles.forEach((hex,i) => {
            if(!((this._order.length < 5) && (i===12 || i===17 || i===18 || i > 21))){    //Skip if small board & on a tile only meant for big board
                let j = legal[Math.floor(Math.random() * legal.length)]         //Grab random resource in legal array
                this.updateTile(hex._id,j)                                      //Update tile on DOM
                legal.splice(legal.indexOf(j),1)                                //Remove the used resource from legal array

                if(j === 5) j = 1                                               //Tile is a desert, number not needed
                else{
                    j = numLegal[Math.floor(Math.random() * numLegal.length)]   //Grab random number from numLegal array
                    numLegal.splice(numLegal.indexOf(j),1)                      //Remove used number from numLegal array
                }

                hex._num = j                                            //Set the hex number
                hex.updateHexNumber("#num" + hex._id.substr(4), i)      //Update the Dom
            }
        })
    }

    
    //Select Settlement PLacement
    placeSettlement(settleID){
        document.getElementById(settleID).style.border = "solid 5px gold"   //Highlight current selected settlement place
        document.querySelector("#place").style.display = "flex"             //Reveal Settlement selection element

        if(this._selectPlace != ""){                                       //Unhighlight previous place if still highlighted                 
            document.getElementById(this._selectPlace).style.border = ""   //Removes highlighted border
        }
        
        this._selectPlace = settleID       //Set current place as selected place
    }

    //Select Settlement Type
    settlementType(type){
        document.getElementById(type).style.border = "solid 5px gold"     //Highlight current selected settlement type

        if(this._selectType != ""){                                       //Unhighlight previous type if still highlighted                 
            document.getElementById(this._selectType).style.border = ""   //Removes highlighted border
        }

        this._selectType = type       //Set current type as selected type
    }

    //Select Settlement Color
    settlementColor(color){
        document.getElementById(color).style.border = "solid 5px gold"     //Highlight current selected settlement color

        if(this._selectColor != ""){                                       //Unhighlight previous color if still highlighted                 
            document.getElementById(this._selectColor).style.border = ""   //Removes highlighted border
        }

        this._selectColor = color       //Set current color as selected color
    }

    //Submit the settlement to be placed
    submitSettlement(){ 
        this.deleteSettlement(false)    //Delete previous settlement in the place

        //All Options are filled
        if(this._selectColor != "" && this._selectPlace != "" && this._selectType != ""){ 
            switch(this._selectColor){
                case "settBlue":
                    document.getElementById(this._selectPlace).style.background = "radial-gradient(lightskyblue, #5b7cb0,#183d8c)"
                    //document.getElementById(this._selectPlace).style.border = "solid 3px #08214a"
                    break
                case "settGreen":
                    document.getElementById(this._selectPlace).style.background = "radial-gradient(lightgreen, #418f3f, #095705)"
                    //document.getElementById(this._selectPlace).style.border = "solid 3px #022e01"
                    break
                case "settRed":
                    document.getElementById(this._selectPlace).style.background = "radial-gradient(#f28d91,#f55860,#70080d)"
                    //document.getElementById(this._selectPlace).style.border = "solid 3px #4d0206"
                    break
                case "settOrange":
                    document.getElementById(this._selectPlace).style.background = "radial-gradient(#fa9070,#fa693e,#8c2c08)"
                    //document.getElementById(this._selectPlace).style.border = "solid 3px #751c01"
                    break
                case "settWhite":
                    document.getElementById(this._selectPlace).style.background = "radial-gradient(white,#edebeb, #b8b9ba)"
                    //document.getElementById(this._selectPlace).style.border = "solid 3px gray"
                    break
                case "settBrown":
                    document.getElementById(this._selectPlace).style.background = "radial-gradient(tan,#947769,#3b190c)"
                    //document.getElementById(this._selectPlace).style.border = "solid 3px #26130a"
                    break
            }
            document.getElementById(this._selectPlace).src = `images/${this._selectType}.png` //Add image of settlement type to the place

            //Add Color/Settlement to Adjacent Hex Tiles
            //Split the placeID into just the _tile indexes
            let hexes =  this._selectPlace.split(":").filter(h => Number.isInteger(+h)) 
            
            //Add to each adjacent hex: place,color,type 
            hexes.forEach(h => game._tiles[+h]._settlements.push(this._selectPlace + "," + this._selectColor.substr(4) + "," + this._selectType))

            //Add to Player settlement total
            let i = game._order.findIndex(p => p._color === this._selectColor.substr(4))
            game._order[i]._settlements += this._selectType === "settlement" ? 1 : 2

            this.resetSettlementValues()
        }
        else{
            throw 'Settlement color, type, and/or place empty'
        }
    }

    //Delete Settlement
    deleteSettlement(clear=true){
        if(this._selectPlace != ""){
            let color = "", type = ""
            let hexes = this._selectPlace.split(":").filter(h => Number.isInteger(+h))
            hexes.forEach(h => {                                                                            //_settlements stores: "place,color,type"
                let i = game._tiles[+h]._settlements.findIndex(s => s.split(",")[0] === this._selectPlace)  //Index of settlement
                if(i >= 0){                                                                                 //If Settlement is found
                    color = game._tiles[+h]._settlements[i].split(",")[1]                                   //Player Color to remove settlement from
                    type = game._tiles[+h]._settlements[i].split(",")[2]                                    //Settlement type to remove 1 or 2 points 
                    game._tiles[+h]._settlements.splice(i,1)                                                //Delete Settlement from hex 
                }
            })

            if(type != "" && color != ""){                              //There was a previous settlement in the place
                let i = game._order.findIndex(p => p._color === color)  //Index of player
                game._order[i]._settlements -= type === "settlement" ? 1 : 2
            }

            //Clear Place visuals
            document.getElementById(this._selectPlace).style.background = ""
            document.getElementById(this._selectPlace).src = "images/blank.png"
        }

        if(clear) this.resetSettlementValues()  //Clear values if not submitting a new settlement

        document.querySelector("#place").style.display = "none" //Hide Settlement Selection Menu
    }

    //Reset Settlement Selection
    resetSettlementValues(){
        //Reset Values
        //Place
        if(this._selectPlace != "") document.getElementById(this._selectPlace).style.border = ""
        this._selectPlace = ""
        //Type
        if(this._selectType != "") document.getElementById(this._selectType).style.border = ""
        this._selectType = ""
        //Color
        if(this._selectColor != "") document.getElementById(this._selectColor).style.border = ""
        this._selectColor = ""
    }

    //Toggle visibility of Stats section
    showStats(){
        if(document.querySelector("#reveal").style.display === "flex"){
            document.querySelector("#reveal").style.display = "none"
        }else{
            document.querySelector("#reveal").style.display = "flex"
        }

        this.updateStats()
    }

    updateStats(){
        let resources = ["Wood","Brick","Wool","Wheat", "Ore"]
        this._order.forEach(player=>{
            //Fill in Individual Resources
            player._cards.forEach((c,i)=>{
                document.querySelector(`#count${player._color}${resources[i]}`).innerText = player._cards[i]
            })

            //Fill in Total Resources
            document.querySelector(`#count${player._color}Total`).innerText = player._cards.reduce((a,c)=> a+c,0)
        
            //Fill in Robber
            document.querySelector(`#count${player._color}Robber`).innerText = player._robbed
        })
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
        this._num = 1
        this._resourceNum = 5
        this._robber = false
        this._settlements = []
        this.resource = "url(images/pieceDesert.png)"
    }

    //Set Hex Number
    setHexNumber(hexID){
        let i = +hexID.substr(4)
        game._tiles[i]._num += 1

        if(game._tiles[i]._num === 7) game._tiles[i]._num += 1
        else if(game._tiles[i]._num === 13) game._tiles[i]._num = 1

        this.updateHexNumber(hexID, i)
    }

    //Updates hex number on the DOM
    updateHexNumber(hexID, i){
        if(game._tiles[i]._num === 1) document.querySelector(hexID).innerText = ""
        else document.querySelector(hexID).innerText = game._tiles[i]._num

        if(game._tiles[i]._num === 6 || game._tiles[i]._num === 8) document.querySelector(hexID).style.color = "red"
        else document.querySelector(hexID).style.color = "black"
    }

    //Toggle the robber on the hew piece
    toggleRobber(hexID, last=true){
        let i = +hexID.substr(4)                            //Grabs hex index from hexID
        game._tiles[i]._robber = !game._tiles[i]._robber    //Toggles the robber value (true/false)
        
        if(game._tiles[i]._robber) document.querySelector(hexID).src = "images/robber.png"  //Chages hex img to the robber
        else document.querySelector(hexID).src = "images/blank.png"                         //Changes hex img to blank

        if(game._robberPlace === "") game._robberPlace = hexID      //No previous robber selection or same robber selection twice
        else if(game._robberPlace === hexID) game._robberPlace = "" //Resets robber selection if same selection as last
        else if(last){                                              //Last: New location is selected and needs previous location toggled off
            this.toggleRobber(game._robberPlace, false)             //Toggles previous robber location 
            game._robberPlace = hexID                               //Set current location of the robber
        }
    }
}

//Player Class
class Player{
    constructor(color){
        this._color = color
        this._settlements = 0
        this._tradeCount = 0
        this._robbed = 0
        
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
    
    distributeCards(roll){
        if((game._order.length > 0) && (roll != 7)){
            let size = game._order.length > 4 ? 29 : 21 //Index of last tile on the board, big or small

            for(let i=0; i<=size; i++){             //Cycle through each Tile on the playable board
                let hex = game._tiles[i]            //Address to Current Hex Tile
                if(hex._num === roll){              //Check if the Hex Number matches the number Rolled
                    if(hex._settlements.length > 0 && hex._resourceNum != 5){       //Checks if there are settlements on the Hex & Hex is not a Desert
                        hex._settlements.forEach(s =>{                              //Cycle through all settlements on the Hex
                            let sett = s.split(",")                                 //_settlements stores: "place,color,type"
                            let player = game._order[game._order.findIndex(p => p._color === sett[1])]  //Address of the current Player
                            if(hex._robber){                                        //Robber is on the Hex
                                player._robbed += sett[2] === "settlement" ? 1 : 2  //Increase Player Robbed count by 1or2 depending on Settlement/City
                            }
                            else{                                                                   //0:Wood, 1:Brick, 2:Wool, 3:Wheat, 4:Ore, 5:Desert
                                player._cards[hex._resourceNum] += sett[2] === "settlement" ? 1 : 2 //Increase specific Player Resource count by 1or2 depending on Settlement/City
                            }
                        })
                    }
                }
            }
        }
    }

    //Increases the counter on the dice roll passed in
    numsButtons(index){
        //Increase specific number total count
        this._totalRolls[index] += 1
        document.querySelector(`#span${index+2}`).innerText = this._totalRolls[index]
        this.updateGraph()

        if(game._order.length > 0){
            //Increase individual color dice roll count
            game._order[game._turn % game._order.length]._playerRolls[index] += 1

            //Increase number of turns passed
            game._turn += 1

            //Give players cards according to the number rolled
            this.distributeCards(index + 2)
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
            let num = document.querySelector(colRes.join("")).innerText //Grabs amount the resource changes by from DOM 
            this.colorTrades.add(colRes[1])                             //Adds the color to ColorTrades set to track colors involved in trade

            //Add to Trade Array of Player
            let i = game._order.findIndex(col => col._color === colRes[1])  //Find the index of the player in the player array
            game._order[i]._trades[resource.indexOf(colRes[2])] += +num     //Update player trade array
        })

        //Increase trade counter for colors
        this.colorTrades.forEach(t =>{
            let i = game._order.findIndex(col => col._color === t)
            game._order[i]._tradeCount += 1
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
game.legalRandom()

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

//Event Listeners for Hex Number Values
document.querySelector("#num00").addEventListener("click", () => game._tiles[0].setHexNumber("#num00"))
document.querySelector("#num01").addEventListener("click", () => game._tiles[0].setHexNumber("#num01"))
document.querySelector("#num02").addEventListener("click", () => game._tiles[0].setHexNumber("#num02"))
document.querySelector("#num03").addEventListener("click", () => game._tiles[0].setHexNumber("#num03"))
document.querySelector("#num04").addEventListener("click", () => game._tiles[0].setHexNumber("#num04"))
document.querySelector("#num05").addEventListener("click", () => game._tiles[0].setHexNumber("#num05"))
document.querySelector("#num06").addEventListener("click", () => game._tiles[0].setHexNumber("#num06"))
document.querySelector("#num07").addEventListener("click", () => game._tiles[0].setHexNumber("#num07"))
document.querySelector("#num08").addEventListener("click", () => game._tiles[0].setHexNumber("#num08"))
document.querySelector("#num09").addEventListener("click", () => game._tiles[0].setHexNumber("#num09"))
document.querySelector("#num10").addEventListener("click", () => game._tiles[0].setHexNumber("#num10"))
document.querySelector("#num11").addEventListener("click", () => game._tiles[0].setHexNumber("#num11"))
document.querySelector("#num12").addEventListener("click", () => game._tiles[0].setHexNumber("#num12"))
document.querySelector("#num13").addEventListener("click", () => game._tiles[0].setHexNumber("#num13"))
document.querySelector("#num14").addEventListener("click", () => game._tiles[0].setHexNumber("#num14"))
document.querySelector("#num15").addEventListener("click", () => game._tiles[0].setHexNumber("#num15"))
document.querySelector("#num16").addEventListener("click", () => game._tiles[0].setHexNumber("#num16"))
document.querySelector("#num17").addEventListener("click", () => game._tiles[0].setHexNumber("#num17"))
document.querySelector("#num18").addEventListener("click", () => game._tiles[0].setHexNumber("#num18"))
document.querySelector("#num19").addEventListener("click", () => game._tiles[0].setHexNumber("#num19"))
document.querySelector("#num20").addEventListener("click", () => game._tiles[0].setHexNumber("#num20"))
document.querySelector("#num21").addEventListener("click", () => game._tiles[0].setHexNumber("#num21"))
document.querySelector("#num22").addEventListener("click", () => game._tiles[0].setHexNumber("#num22"))
document.querySelector("#num23").addEventListener("click", () => game._tiles[0].setHexNumber("#num23"))
document.querySelector("#num24").addEventListener("click", () => game._tiles[0].setHexNumber("#num24"))
document.querySelector("#num25").addEventListener("click", () => game._tiles[0].setHexNumber("#num25"))
document.querySelector("#num26").addEventListener("click", () => game._tiles[0].setHexNumber("#num26"))
document.querySelector("#num27").addEventListener("click", () => game._tiles[0].setHexNumber("#num27"))
document.querySelector("#num28").addEventListener("click", () => game._tiles[0].setHexNumber("#num28"))
document.querySelector("#num29").addEventListener("click", () => game._tiles[0].setHexNumber("#num29"))

//Event Listeners to Toggle Robber on Hex
document.querySelector("#rob00").addEventListener("click", () => game._tiles[0].toggleRobber("#rob00"))
document.querySelector("#rob01").addEventListener("click", () => game._tiles[0].toggleRobber("#rob01"))
document.querySelector("#rob02").addEventListener("click", () => game._tiles[0].toggleRobber("#rob02"))
document.querySelector("#rob03").addEventListener("click", () => game._tiles[0].toggleRobber("#rob03"))
document.querySelector("#rob04").addEventListener("click", () => game._tiles[0].toggleRobber("#rob04"))
document.querySelector("#rob05").addEventListener("click", () => game._tiles[0].toggleRobber("#rob05"))
document.querySelector("#rob06").addEventListener("click", () => game._tiles[0].toggleRobber("#rob06"))
document.querySelector("#rob07").addEventListener("click", () => game._tiles[0].toggleRobber("#rob07"))
document.querySelector("#rob08").addEventListener("click", () => game._tiles[0].toggleRobber("#rob08"))
document.querySelector("#rob09").addEventListener("click", () => game._tiles[0].toggleRobber("#rob09"))
document.querySelector("#rob10").addEventListener("click", () => game._tiles[0].toggleRobber("#rob10"))
document.querySelector("#rob11").addEventListener("click", () => game._tiles[0].toggleRobber("#rob11"))
document.querySelector("#rob12").addEventListener("click", () => game._tiles[0].toggleRobber("#rob12"))
document.querySelector("#rob13").addEventListener("click", () => game._tiles[0].toggleRobber("#rob13"))
document.querySelector("#rob14").addEventListener("click", () => game._tiles[0].toggleRobber("#rob14"))
document.querySelector("#rob15").addEventListener("click", () => game._tiles[0].toggleRobber("#rob15"))
document.querySelector("#rob16").addEventListener("click", () => game._tiles[0].toggleRobber("#rob16"))
document.querySelector("#rob17").addEventListener("click", () => game._tiles[0].toggleRobber("#rob17"))
document.querySelector("#rob18").addEventListener("click", () => game._tiles[0].toggleRobber("#rob18"))
document.querySelector("#rob19").addEventListener("click", () => game._tiles[0].toggleRobber("#rob19"))
document.querySelector("#rob20").addEventListener("click", () => game._tiles[0].toggleRobber("#rob20"))
document.querySelector("#rob21").addEventListener("click", () => game._tiles[0].toggleRobber("#rob21"))
document.querySelector("#rob22").addEventListener("click", () => game._tiles[0].toggleRobber("#rob22"))
document.querySelector("#rob23").addEventListener("click", () => game._tiles[0].toggleRobber("#rob23"))
document.querySelector("#rob24").addEventListener("click", () => game._tiles[0].toggleRobber("#rob24"))
document.querySelector("#rob25").addEventListener("click", () => game._tiles[0].toggleRobber("#rob25"))
document.querySelector("#rob26").addEventListener("click", () => game._tiles[0].toggleRobber("#rob26"))
document.querySelector("#rob27").addEventListener("click", () => game._tiles[0].toggleRobber("#rob27"))
document.querySelector("#rob28").addEventListener("click", () => game._tiles[0].toggleRobber("#rob28"))
document.querySelector("#rob29").addEventListener("click", () => game._tiles[0].toggleRobber("#rob29"))

//Event Listeners for Settlement placement
//Row0
document.getElementById("d:nh:00:nh").addEventListener("click", () => game.placeSettlement("d:nh:00:nh")) 	
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

//Event Listeners for ssettlement type selection
//Settlement Type
document.querySelector("#settlement").addEventListener("click", () => game.settlementType("settlement"))
document.querySelector("#city").addEventListener("click", () => game.settlementType("city"))
//Settlement Color
document.querySelector("#settBlue").addEventListener("click", () => game.settlementColor("settBlue"))
document.querySelector("#settGreen").addEventListener("click", () => game.settlementColor("settGreen"))
document.querySelector("#settRed").addEventListener("click", () => game.settlementColor("settRed"))
document.querySelector("#settOrange").addEventListener("click", () => game.settlementColor("settOrange"))
document.querySelector("#settWhite").addEventListener("click", () => game.settlementColor("settWhite"))
document.querySelector("#settBrown").addEventListener("click", () => game.settlementColor("settBrown"))

//Submit Settlment 
document.querySelector("#submitSettle").addEventListener("click", () => game.submitSettlement())
//Delete Settlement
document.querySelector("#deleteSettle").addEventListener("click", () => game.deleteSettlement())