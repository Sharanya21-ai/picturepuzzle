let currentPlayer = "X";

function play(cell) {

    if (cell.innerHTML !== "") {
        return;
    }

    cell.innerHTML = currentPlayer;

    if (currentPlayer === "X") {
        currentPlayer = "O";
    } else {
        currentPlayer = "X";
    }

    document.getElementById("status").innerHTML =
        "Player " + currentPlayer + " Turn";
}

function restartGame() {

    let cells = document.getElementsByClassName("cell");

    for (let i = 0; i < cells.length; i++) {
        cells[i].innerHTML = "";
    }

    currentPlayer = "X";

    document.getElementById("status").innerHTML =
        "Player X Turn";
}
