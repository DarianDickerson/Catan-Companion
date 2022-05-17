//Global Variables... I know, I know
//Holds quantity of each resource card value for each player
const cards =[[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]]

//Holds number of times each dice roll has appeared 
const diceCounter = [0,0,0,0,0,0,0,0,0,0,0]

//Dice Values (1-6)
const dice =[1,1]

//Contains record of values that have been altered to be updated later
const updateQueue = new Set()

//Sets the order players take turns in & holds their specific dice rolls 
let order = []

//Number of random dice roll fetches have been called
let count = 0


//Prime the dice
roll()

//Event Listeners for Player Select
document.querySelector("#orderBlue").addEventListener("click",() => orderPlayers("Blue"))
document.querySelector("#orderGreen").addEventListener("click",() => orderPlayers("Green"))
document.querySelector("#orderRed").addEventListener("click",() => orderPlayers("Red"))
document.querySelector("#orderOrange").addEventListener("click",() => orderPlayers("Orange"))
document.querySelector("#orderWhite").addEventListener("click",() => orderPlayers("White"))
document.querySelector("#orderBrown").addEventListener("click",() => orderPlayers("Brown"))

//Event Listener in Player Select to Clear Game 
document.querySelector("#playerClear").addEventListener("click", clearGame)

//Event Listeners to increase count for cards
//Blue
document.querySelector("#plusBlueWood").addEventListener("click", () => increaseCard("Blue","Wood"))
document.querySelector("#plusBlueBrick").addEventListener("click", () => increaseCard("Blue","Brick"))
document.querySelector("#plusBlueWool").addEventListener("click", () => increaseCard("Blue","Wool"))
document.querySelector("#plusBlueWheat").addEventListener("click", () => increaseCard("Blue","Wheat"))
document.querySelector("#plusBlueOre").addEventListener("click", () => increaseCard("Blue","Ore"))
//Green
document.querySelector("#plusGreenWood").addEventListener("click", () => increaseCard("Green","Wood"))
document.querySelector("#plusGreenBrick").addEventListener("click", () => increaseCard("Green","Brick"))
document.querySelector("#plusGreenWool").addEventListener("click", () => increaseCard("Green","Wool"))
document.querySelector("#plusGreenWheat").addEventListener("click", () => increaseCard("Green","Wheat"))
document.querySelector("#plusGreenOre").addEventListener("click", () => increaseCard("Green","Ore"))
//Red
document.querySelector("#plusRedWood").addEventListener("click", () => increaseCard("Red","Wood"))
document.querySelector("#plusRedBrick").addEventListener("click", () => increaseCard("Red","Brick"))
document.querySelector("#plusRedWool").addEventListener("click", () => increaseCard("Red","Wool"))
document.querySelector("#plusRedWheat").addEventListener("click", () => increaseCard("Red","Wheat"))
document.querySelector("#plusRedOre").addEventListener("click", () => increaseCard("Red","Ore"))
//Orange
document.querySelector("#plusOrangeWood").addEventListener("click", () => increaseCard("Orange","Wood"))
document.querySelector("#plusOrangeBrick").addEventListener("click", () => increaseCard("Orange","Brick"))
document.querySelector("#plusOrangeWool").addEventListener("click", () => increaseCard("Orange","Wool"))
document.querySelector("#plusOrangeWheat").addEventListener("click", () => increaseCard("Orange","Wheat"))
document.querySelector("#plusOrangeOre").addEventListener("click", () => increaseCard("Orange","Ore"))
//White
document.querySelector("#plusWhiteWood").addEventListener("click", () => increaseCard("White","Wood"))
document.querySelector("#plusWhiteBrick").addEventListener("click", () => increaseCard("White","Brick"))
document.querySelector("#plusWhiteWool").addEventListener("click", () => increaseCard("White","Wool"))
document.querySelector("#plusWhiteWheat").addEventListener("click", () => increaseCard("White","Wheat"))
document.querySelector("#plusWhiteOre").addEventListener("click", () => increaseCard("White","Ore"))
//Brown
document.querySelector("#plusBrownWood").addEventListener("click", () => increaseCard("Brown","Wood"))
document.querySelector("#plusBrownBrick").addEventListener("click", () => increaseCard("Brown","Brick"))
document.querySelector("#plusBrownWool").addEventListener("click", () => increaseCard("Brown","Wool"))
document.querySelector("#plusBrownWheat").addEventListener("click", () => increaseCard("Brown","Wheat"))
document.querySelector("#plusBrownOre").addEventListener("click", () => increaseCard("Brown","Ore"))

//Event Listeners to decrease count for cards
//Blue
document.querySelector("#minusBlueWood").addEventListener("click", () => decreaseCard("Blue","Wood"))
document.querySelector("#minusBlueBrick").addEventListener("click", () => decreaseCard("Blue","Brick"))
document.querySelector("#minusBlueWool").addEventListener("click", () => decreaseCard("Blue","Wool"))
document.querySelector("#minusBlueWheat").addEventListener("click", () => decreaseCard("Blue","Wheat"))
document.querySelector("#minusBlueOre").addEventListener("click", () => decreaseCard("Blue","Ore"))
//Green
document.querySelector("#minusGreenWood").addEventListener("click", () => decreaseCard("Green","Wood"))
document.querySelector("#minusGreenBrick").addEventListener("click", () => decreaseCard("Green","Brick"))
document.querySelector("#minusGreenWool").addEventListener("click", () => decreaseCard("Green","Wool"))
document.querySelector("#minusGreenWheat").addEventListener("click", () => decreaseCard("Green","Wheat"))
document.querySelector("#minusGreenOre").addEventListener("click", () => decreaseCard("Green","Ore"))
//Red
document.querySelector("#minusRedWood").addEventListener("click", () => decreaseCard("Red","Wood"))
document.querySelector("#minusRedBrick").addEventListener("click", () => decreaseCard("Red","Brick"))
document.querySelector("#minusRedWool").addEventListener("click", () => decreaseCard("Red","Wool"))
document.querySelector("#minusRedWheat").addEventListener("click", () => decreaseCard("Red","Wheat"))
document.querySelector("#minusRedOre").addEventListener("click", () => decreaseCard("Red","Ore"))
//Orange
document.querySelector("#minusOrangeWood").addEventListener("click", () => decreaseCard("Orange","Wood"))
document.querySelector("#minusOrangeBrick").addEventListener("click", () => decreaseCard("Orange","Brick"))
document.querySelector("#minusOrangeWool").addEventListener("click", () => decreaseCard("Orange","Wool"))
document.querySelector("#minusOrangeWheat").addEventListener("click", () => decreaseCard("Orange","Wheat"))
document.querySelector("#minusOrangeOre").addEventListener("click", () => decreaseCard("Orange","Ore"))
//White
document.querySelector("#minusWhiteWood").addEventListener("click", () => decreaseCard("White","Wood"))
document.querySelector("#minusWhiteBrick").addEventListener("click", () => decreaseCard("White","Brick"))
document.querySelector("#minusWhiteWool").addEventListener("click", () => decreaseCard("White","Wool"))
document.querySelector("#minusWhiteWheat").addEventListener("click", () => decreaseCard("White","Wheat"))
document.querySelector("#minusWhiteOre").addEventListener("click", () => decreaseCard("White","Ore"))
//Brown
document.querySelector("#minusBrownWood").addEventListener("click", () => decreaseCard("Brown","Wood"))
document.querySelector("#minusBrownBrick").addEventListener("click", () => decreaseCard("Brown","Brick"))
document.querySelector("#minusBrownWool").addEventListener("click", () => decreaseCard("Brown","Wool"))
document.querySelector("#minusBrownWheat").addEventListener("click", () => decreaseCard("Brown","Wheat"))
document.querySelector("#minusBrownOre").addEventListener("click", () => decreaseCard("Brown","Ore"))

//Event Listener to submit cards to player totals
document.querySelector("#submit").addEventListener("click", submitCards)
//Event Listener to clear temporary card values
document.querySelector("#clearValues").addEventListener("click", clearValues)

//Event Listeners to increase count for dice rolls
document.querySelector("#but2").addEventListener("click", () => numsButtons(0))
document.querySelector("#but3").addEventListener("click", () => numsButtons(1))
document.querySelector("#but4").addEventListener("click", () => numsButtons(2))
document.querySelector("#but5").addEventListener("click", () => numsButtons(3))
document.querySelector("#but6").addEventListener("click", () => numsButtons(4))
document.querySelector("#but7").addEventListener("click", () => numsButtons(5))
document.querySelector("#but8").addEventListener("click", () => numsButtons(6))
document.querySelector("#but9").addEventListener("click", () => numsButtons(7))
document.querySelector("#but10").addEventListener("click", () => numsButtons(8))
document.querySelector("#but11").addEventListener("click", () => numsButtons(9))
document.querySelector("#but12").addEventListener("click", () => numsButtons(10))

//Event Listener to Roll The Dice
document.querySelector("#roll").addEventListener("click", roll)
//Event Listener to Clear the Dice
document.querySelector("#clearDice").addEventListener("click", clearDice)
//Event Listener to Toggle visibility of stat section
document.querySelector("#showStats").addEventListener("click", showStats)
//Event Listener to Clear All Game Values
document.querySelector("#clearGame").addEventListener("click", clearGame)



//Sets the order of players & makes their piece visible
function orderPlayers(color){
    if(document.querySelector(`#order${color}`).childNodes.length == 0){
        //Makes all elements specific to color visible
        document.querySelectorAll(`.player${color}`).forEach(n=> n.style.display = "table-row")
        
        //Creates Map to track specific color's dice rolls 
        order.push([new Map(),color])

        //Assigns color to the next turn order
        document.querySelector(`#order${color}`).innerText = order.length  
    }
}

//Increases the counter on the dice roll passed in
function numsButtons(index){
    diceCounter[index] += 1
    document.querySelector(`#span${index+2}`).innerText = `${diceCounter[index]}`
    updateGraph()

    //Increase individual color dice roll count
    let player = (diceCounter.reduce((a,c)=>a+c,0)-1) % order.length
    if(order[player][0].has(index+2)){
        order[player][0].set(index+2, order[player][0].get(index+2) + 1)
    }else{
        order[player][0].set(index+2, 1)
    }
}

//Increases the specified resource card number
function increaseCard(color, resource){
    let num = document.querySelector(`#span${color}${resource}`).innerText
    num = +num + 1
    document.querySelector(`#span${color}${resource}`).innerText = num
    updateQueue.add(`#span ${color} ${resource}`)
} 

//Decreases the specified resource card number
function decreaseCard(color,resource){
    let num = document.querySelector(`#span${color}${resource}`).innerText
    num = +num - 1
    document.querySelector(`#span${color}${resource}`).innerText = num
    updateQueue.add(`#span ${color} ${resource}`)
}

//Submit Cards to player totals
function submitCards(){
    const color = ["Blue","Green","Red","Orange","White","Brown"]
    const resource = ["Wood","Brick","Wool","Wheat","Ore"]
    updateQueue.forEach(function(q){
        let colRes = q.split(" ")
        let num = document.querySelector(colRes.join("")).innerText
        cards[color.indexOf(colRes[1])][resource.indexOf(colRes[2])] += +num
        document.querySelector(`#count${colRes[1]}${colRes[2]}`).innerText = cards[color.indexOf(colRes[1])][resource.indexOf(colRes[2])]
        document.querySelector(`#count${colRes[1]}Total`).innerText = cards[color.indexOf(colRes[1])].reduce((a,c)=>a+c,0)
    })
    clearValues()
}

//Erase temporary card values
function clearValues(){
    updateQueue.forEach(function(q){
        document.querySelector(q.split(" ").join("")).innerText = 0
    })
    updateQueue.clear()
}

TODO:
//Toggle visibility of Stats section
function showStats(){
    if(document.querySelector("#reveal").style.display === "flex"){
        document.querySelector("#reveal").style.display = "none"
    }else{
        document.querySelector("#reveal").style.display = "flex"
    }
}

//Updates the Dice Roll Graph for all numbers
function updateGraph(){
    let max = Math.max(...diceCounter)
    let rolls = diceCounter.reduce((a,c)=>a+c,0)
    diceCounter.forEach(function(n,i){
        if(max === 0){
            //Reset the graph
            document.querySelector(`#bar${i+2}`).style.height = "0px"
        }
        else if(n === max){
            //Largest number, fills bar
            document.querySelector(`#bar${i+2}`).style.height = "200px"
        }
        else{

            //numCount/max = x/200 => x = 200(numCount)/max
            let numHeight = Math.floor(n*200/max)
            document.querySelector(`#bar${i+2}`).style.height = `${numHeight}px`
        }
    })
    document.querySelector(`#totalRolls`).innerText = `Total Rolls: ${rolls}`    
}

//Rolls Dice
function roll(){
    getFetch()
    getFetch()

    //Sets indivual dice to corresponding img
    for(let i=0;i<dice.length; i++){
        document.querySelector(`#dice${i+1}`).src = `images/${dice[i]}.png`
        document.querySelector(`#dice${i+1}`).alt = `${dice[i]}`
    }
    

    if(count > 0){
        //Increase Dice Roll count
        numsButtons(dice[0] + dice[1] -2)
    }
}

//Clears the Dice Roll graph and resets all the counts to zero
function clearDice(){
    diceCounter.forEach((n,i) => {
        diceCounter[i] = 0
        document.querySelector(`#span${i+2}`).innerText = "0"
    })
    updateGraph()

    //Clear individual colors' dice counts
    order.forEach(p=> p[0].clear())
}

//Fetches a random dice roll
function getFetch(){
    fetch("http://roll.diceapi.com/json/d6")
        .then(res => res.json()) // parse response as JSON
        .then(data => {
            //console.log(data.dice[0].value)
            dice[count % 2] = data.dice[0].value
            count++
        })
        .catch(err => {
            console.log(`error ${err}`)
        });
}

TODO:
//Clear all game values
function clearGame(){
    const color = ["Blue","Green","Red","Orange","White","Brown"]
    const resource = ["Wood","Brick","Wool","Wheat","Ore"]

    //Reset card values back to 0
    cards.forEach((a,i) => a.forEach((n,j)=> {
        cards[i][j] = 0
        document.querySelector(`#count${color[i]}${resource[j]}`).innerText = 0
        document.querySelector(`#count${color[i]}Total`).innerText = 0
    }))

    //Clear Player Order && remove specific player dice roll Map
    order.forEach(n => document.querySelector(`#order${n[1]}`).innerText = "")
    while(order.length > 0){
        order.pop()
    }

    //Hides all color specific elements
    color.forEach(col => document.querySelectorAll(`.player${col}`).forEach(n=>n.style.display = "none"))

    //Hide Stats Section
    document.querySelector("#reveal").style.display = "none"

    //Clear temporary values in Card Tracker 
    clearValues()

    //Clear Dice Rolls
    clearDice()
}

