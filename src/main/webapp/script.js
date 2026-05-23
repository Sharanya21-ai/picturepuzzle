const rows = 4; // Number of boxes rows (creates a 5x5 dot grid)
const cols = 4; // Number of boxes columns

let currentPlayer = 1;
let scores = { 1: 0, 2: 0 };
let boxesMatrix = []; // Tracks lines around each box

const board = document.getElementById('board');
const p1ScoreEl = document.getElementById('p1-score');
const p2ScoreEl = document.getElementById('p2-score');
const turnText = document.getElementById('turn-text');
const resetBtn = document.getElementById('reset-btn');

function initGame() {
    board.innerHTML = '';
    scores = { 1: 0, 2: 0 };
    currentPlayer = 1;
    updateUI();

    // Build box matrix initialization data
    boxesMatrix = [];
    for (let r = 0; r < rows; r++) {
        boxesMatrix[r] = [];
        for (let c = 0; c < cols; c++) {
            boxesMatrix[r][c] = { top: null, bottom: null, left: null, right: null, filled: false };
        }
    }

    // Generate the DOM grid
    for (let r = 0; r <= rows * 2; r++) {
        const rowEl = document.createElement('div');
        rowEl.className = 'row';

        for (let c = 0; c <= cols * 2; c++) {
            if (r % 2 === 0 && c % 2 === 0) {
                // Dot
                const dot = document.createElement('div');
                dot.className = 'dot';
                rowEl.appendChild(dot);
            } else if (r % 2 === 0 && c % 2 !== 0) {
                // Horizontal Line
                const line = document.createElement('div');
                line.className = 'line h-line';
                const boxR = r / 2;
                const boxC = Math.floor(c / 2);
                
                // Associate line with adjacent boxes
                line.dataset.boxes = JSON.stringify([
                    boxR < rows ? {r: boxR, c: boxC, side: 'top'} : null,
                    boxR > 0 ? {r: boxR - 1, c: boxC, side: 'bottom'} : null
                ].filter(Boolean));

                line.addEventListener('click', handleLineClick);
                rowEl.appendChild(line);
            } else if (r % 2 !== 0 && c % 2 === 0) {
                // Vertical Line
                const line = document.createElement('div');
                line.className = 'line v-line';
                const boxR = Math.floor(r / 2);
                const boxC = c / 2;

                // Associate line with adjacent boxes
                line.dataset.boxes = JSON.stringify([
                    boxC < cols ? {r: boxR, c: boxC, side: 'left'} : null,
                    boxC > 0 ? {r: boxR, c: boxC - 1, side: 'right'} : null
                ].filter(Boolean));

                line.addEventListener('click', handleLineClick);
                rowEl.appendChild(line);
            } else {
                // Box Space
                const box = document.createElement('div');
                box.className = 'box';
                box.id = `box-${Math.floor(r/2)}-${Math.floor(c/2)}`;
                rowEl.appendChild(box);
            }
        }
        board.appendChild(rowEl);
    }
}

function handleLineClick(e) {
    const line = e.target;
    if (line.classList.contains('filled')) return;

    line.classList.add('filled', `p${currentPlayer}`);
    const associatedBoxes = JSON.parse(line.dataset.boxes);
    let boxClosed = false;

    associatedBoxes.forEach(b => {
        boxesMatrix[b.r][b.c][b.side] = currentPlayer;
        
        // Check if all 4 sides of this box are claimed
        const boxObj = boxesMatrix[b.r][b.c];
        if (!boxObj.filled && boxObj.top && boxObj.bottom && boxObj.left && boxObj.right) {
            boxObj.filled = true;
            scores[currentPlayer]++;
            boxClosed = true;
            
            // Mark box visually
            const boxEl = document.getElementById(`box-${b.r}-${b.c}`);
            boxEl.classList.add(`p${currentPlayer}`);
            boxEl.innerText = currentPlayer === 1 ? '1' : '2';
        }
    });

    if (boxClosed) {
        updateUI();
        checkGameOver();
    } else {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateUI();
    }
}

function updateUI() {
    p1ScoreEl.innerText = scores[1];
    p2ScoreEl.innerText = scores[2];
    
    document.querySelector('.player-1').classList.toggle('active', currentPlayer === 1);
    document.querySelector('.player-2').classList.toggle('active', currentPlayer === 2);
    
    turnText.innerText = `Player ${currentPlayer}'s Turn`;
}

function checkGameOver() {
    if (scores[1] + scores[2] === rows * cols) {
        if (scores[1] > scores[2]) {
            turnText.innerText = "🎉 Player 1 Wins!";
        } else if (scores[2] > scores[1]) {
            turnText.innerText = "🎉 Player 2 Wins!";
        } else {
            turnText.innerText = "It's a Tie! 🤝";
        }
        document.querySelector('.player-1').classList.remove('active');
        document.querySelector('.player-2').classList.remove('active');
    }
}

resetBtn.addEventListener('click', initGame);

// Run game on load
initGame();
