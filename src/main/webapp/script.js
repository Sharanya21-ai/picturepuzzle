const rows = 3;
const columns = 3;

let currTile; // The tile being dragged
let otherTile; // The blank tile being dropped onto

let movesRemaining = 25;
let gameActive = true;

// Track the correct puzzle grid positions (0-8)
const correctOrder = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];
let currentOrder = [];

window.onload = function() {
    startNewGame();
}

function startNewGame() {
    // Reset game states
    movesRemaining = 25;
    gameActive = true;
    document.getElementById("moves-count").innerText = movesRemaining;
    document.getElementById("game-status").innerText = "";
    document.getElementById("board").innerHTML = "";

    // Generate a unique random number to force Unsplash to fetch a brand new image
    const randomId = Math.floor(Math.random() * 10000);
    const imageUrl = `https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&h=300&q=80&sig=${randomId}`;
    
    // Update the mini-reference preview target image
    document.getElementById("reference-img").src = imageUrl;

    // Create a shuffled array for tiles 0 through 7
    currentOrder = ["0", "1", "2", "3", "4", "5", "6", "7"];
    currentOrder.sort(() => Math.random() - 0.5);
    
    // Always append position '8' at the very end so the bottom-right start is blank
    currentOrder.push("8"); 

    // Build the 3x3 interactive game board
    for (let i = 0; i < 9; i++) {
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.classList.add("tile");
        
        let pieceValue = currentOrder[i];
        tile.setAttribute("data-piece", pieceValue);

        if (pieceValue === "8") {
            tile.classList.add("blank");
        } else {
            // Cut the single image into sections using CSS background coordinate shifting
            tile.style.backgroundImage = `url('${imageUrl}')`;
            let r = Math.floor(parseInt(pieceValue) / 3);
            let c = parseInt(pieceValue) % 3;
            tile.style.backgroundPosition = `-${c * 100}px -${r * 100}px`;
        }

        // Drag & Drop Event Listeners
        tile.addEventListener("dragstart", dragStart);
        tile.addEventListener("dragover", dragOver);
        tile.addEventListener("dragenter", dragEnter);
        tile.addEventListener("dragleave", dragLeave);
        tile.addEventListener("drop", dragDrop);
        tile.addEventListener("dragend", dragEnd);

        document.getElementById("board").append(tile);
    }
}

// Drag functionality mechanisms
function dragStart() { if (!gameActive) return; currTile = this; }
function dragOver(e) { e.preventDefault(); }
function dragEnter(e) { e.preventDefault(); }
function dragLeave() {}
function dragDrop() { otherTile = this; }

function dragEnd() {
    // Only allow movements if game is active and dropping onto the blank tile
    if (!gameActive || !otherTile || !otherTile.classList.contains("blank")) return;

    let cId = parseInt(currTile.id);
    let oId = parseInt(otherTile.id);

    // Grid coordinates calculations for adjacent tiles (Up, Down, Left, Right)
    let validMoves = [cId - 1, cId + 1, cId - 3, cId + 3];

    // Prevent lateral boundary wrapping across grid rows
    if (cId % 3 === 0 && oId === cId - 1) return;
    if (cId % 3 === 2 && oId === cId + 1) return;

    if (validMoves.includes(oId)) {
        // Collect current positions style information maps
        let tempPiece = currTile.getAttribute("data-piece");
        let tempBg = currTile.style.backgroundImage;
        let tempBp = currTile.style.backgroundPosition;

        // Swap Data: Transform current tile into the new blank spot
        currTile.setAttribute("data-piece", "8");
        currTile.classList.add("blank");
        currTile.style.backgroundImage = "";
        currTile.style.backgroundPosition = "";

        // Swap Data: Populate target tile with old image segment characteristics
        otherTile.setAttribute("data-piece", tempPiece);
        otherTile.classList.remove("blank");
        otherTile.style.backgroundImage = tempBg;
        otherTile.style.backgroundPosition = tempBp;

        // Deduct a move and update view
        movesRemaining--;
        document.getElementById("moves-count").innerText = movesRemaining;

        checkGameState();
    }
}

function checkGameState() {
    let tiles = document.getElementsByClassName("tile");
    let isVictory = true;

    // Check if current positions match the index IDs completely
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].getAttribute("data-piece") !== i.toString()) {
            isVictory = false;
            break;
        }
    }

    if (isVictory) {
        document.getElementById("game-status").innerText = "You Win! 🎉";
        document.getElementById("game-status").style.color = "green";
        gameActive = false;
        return;
    }

    // Check failure system constraints metrics
    if (movesRemaining <= 0) {
        document.getElementById("game-status").innerText = "Game Over! Out of Moves ❌";
        document.getElementById("game-status").style.color = "red";
        gameActive = false;
    }
}
