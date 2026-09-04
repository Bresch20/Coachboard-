const tacticalMaps = {
    "11v11": {
        "4-3-3": {
            defense: { 1:[.5,.9], 2:[.2,.75], 3:[.4,.78], 4:[.6,.78], 5:[.8,.75], 6:[.35,.6], 8:[.5,.65], 10:[.65,.6], 7:[.85,.45], 9:[.5,.4], 11:[.15,.45] },
            attack: { 1:[.5,.88], 2:[.1,.5], 3:[.38,.7], 4:[.62,.7], 5:[.9,.5], 6:[.3,.45], 8:[.5,.55], 10:[.7,.45], 7:[.92,.2], 9:[.5,.1], 11:[.08,.2] }
        },
        "4-4-2-flat": {
            defense: { 1:[.5,.9], 2:[.15,.75], 3:[.38,.78], 4:[.62,.78], 5:[.85,.75], 6:[.15,.6], 8:[.4,.6], 10:[.6,.6], 7:[.85,.6], 9:[.4,.4], 11:[.6,.4] },
            attack: { 1:[.5,.88], 2:[.1,.55], 3:[.38,.7], 4:[.62,.7], 5:[.9,.55], 6:[.1,.3], 8:[.4,.5], 10:[.6,.5], 7:[.9,.3], 9:[.4,.15], 11:[.6,.15] }
        },
        "3-5-2": {
            defense: { 1:[.5,.9], 3:[.3,.78], 8:[.5,.78], 4:[.7,.78], 2:[.15,.6], 6:[.35,.6], 10:[.5,.5], 5:[.65,.6], 7:[.85,.6], 9:[.4,.35], 11:[.6,.35] },
            attack: { 1:[.5,.88], 3:[.3,.7], 8:[.5,.7], 4:[.7,.7], 2:[.1,.3], 6:[.35,.45], 10:[.5,.3], 5:[.65,.45], 7:[.9,.3], 9:[.42,.1], 11:[.58,.1] }
        }
    },
    "9v9": {
        "3-2-3": {
            defense: { 1:[.5,.9], 2:[.25,.78], 3:[.5,.8], 4:[.75,.78], 8:[.4,.6], 10:[.6,.6], 11:[.2,.45], 7:[.8,.45], 9:[.5,.35] },
            attack: { 1:[.5,.88], 2:[.15,.6], 3:[.5,.7], 4:[.85,.6], 8:[.35,.45], 10:[.65,.45], 11:[.1,.2], 7:[.9,.2], 9:[.5,.1] }
        },
        "3-4-1-flat": {
            defense: { 1:[.5,.9], 2:[.25,.78], 3:[.5,.8], 4:[.75,.78], 11:[.15,.55], 8:[.38,.55], 10:[.62,.55], 7:[.85,.55], 9:[.5,.35] },
            attack: { 1:[.5,.88], 2:[.2,.65], 3:[.5,.72], 4:[.8,.65], 11:[.1,.3], 8:[.38,.45], 10:[.62,.45], 7:[.9,.3], 9:[.5,.1] }
        }
    },
    "6v6": {
        "2-2-1": {
            defense: { 1:[.5,.9], 2:[.3,.78], 3:[.7,.78], 4:[.35,.6], 5:[.65,.6], 6:[.5,.4] },
            attack: { 1:[.5,.88], 2:[.25,.7], 3:[.75,.7], 4:[.3,.45], 5:[.7,.45], 6:[.5,.15] }
        },
        "2-3-1": {
            defense: { 1:[.5,.9], 2:[.3,.78], 3:[.7,.78], 4:[.2,.55], 5:[.5,.6], 7:[.8,.55], 6:[.5,.35] },
            attack: { 1:[.5,.88], 2:[.25,.7], 3:[.75,.7], 4:[.15,.35], 5:[.5,.45], 7:[.85,.35], 6:[.5,.1] }
        }
    }
};

let currentPhase = 'defense', redTeam = {}, blueTeam = {}, isDrawing = false, drawMode = false, currentColor = 'black', field, layer, canvas, ctx;

window.onload = function() {
    field = document.getElementById('field');
    layer = document.getElementById('pieces-layer');
    canvas = document.getElementById('drawLayer');
    ctx = canvas.getContext('2d');

    if (!field || !layer || !canvas) return;

    initCanvas();
    resetBoard();
    loadSavedPlays();

    window.addEventListener('resize', () => { initCanvas(); sizePieces(); });

    canvas.addEventListener('pointerdown', (e) => {
        if (!drawMode) return;
        isDrawing = true;
        ctx.beginPath();
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        const rect = canvas.getBoundingClientRect();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    });

    canvas.addEventListener('pointermove', (e) => {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    });

    canvas.addEventListener('pointerup', () => isDrawing = false);
};

function initCanvas() {
    canvas.width = field.clientWidth;
    canvas.height = field.clientHeight;
}

function handleFormationChange() {
    const val = document.getElementById('formationSelect').value;
    if (!val) return;
    if (val.startsWith("CUSTOM_")) {
        applyCustomTactic(val.replace("CUSTOM_", ""));
    } else {
        applyTactics();
    }
}

function applyTactics() {
    const formation = document.getElementById('formationSelect').value;
    let size = "11v11";
    if (["3-2-3", "3-4-1-flat"].includes(formation)) size = "9v9";
    if (["2-2-1", "2-3-1"].includes(formation)) size = "6v6";

    const redMap = tacticalMaps[size][formation][currentPhase];
    const blueMap = tacticalMaps[size][formation]['defense'];
    const w = field.clientWidth;
    const h = field.clientHeight;

    for (let n = 1; n <= 11; n++) {
        if (redMap && redMap[n]) {
            redTeam[n].style.display = 'flex';
            blueTeam[n].style.display = 'flex';
            redTeam[n].style.left = (redMap[n][0] * w - 17) + 'px';
            redTeam[n].style.top = (redMap[n][1] * h - 17) + 'px';
            blueTeam[n].style.left = ((1 - blueMap[n][0]) * w - 17) + 'px';
            blueTeam[n].style.top = ((1 - blueMap[n][1]) * h - 17) + 'px';
        } else {
            if (redTeam[n]) redTeam[n].style.display = 'none';
            if (blueTeam[n]) blueTeam[n].style.display = 'none';
        }
    }
}

function saveCustomTactic() {
    const name = prompt("Name your play:");
    if (!name) return;
    const w = field.clientWidth, h = field.clientHeight;
    const snap = { red: {}, blue: {}, ball: [0.5, 0.1] };
    const getPos = (el) => [parseFloat(el.style.left) / w, parseFloat(el.style.top) / h];
    for (let i in redTeam) snap.red[i] = getPos(redTeam[i]);
    for (let i in blueTeam) snap.blue[i] = getPos(blueTeam[i]);
    const ball = document.querySelector('.ball');
    if (ball) snap.ball = getPos(ball);

    const saved = JSON.parse(localStorage.getItem('gafferPlays') || '{}');
    saved[name] = snap;
    localStorage.setItem('gafferPlays', JSON.stringify(saved));
    loadSavedPlays();
}

function deleteCustomTactic() {
    const select = document.getElementById('formationSelect');
    if (!select.value.startsWith("CUSTOM_")) return alert("Select a saved play first.");
    const name = select.value.replace("CUSTOM_", "");
    if (confirm(`Delete '${name}'?`)) {
        const saved = JSON.parse(localStorage.getItem('gafferPlays') || '{}');
        delete saved[name];
        localStorage.setItem('gafferPlays', JSON.stringify(saved));
        loadSavedPlays();
        select.value = "";
    }
}

function loadSavedPlays() {
    const group = document.getElementById('customGroup');
    if (!group) return;
    group.innerHTML = "";
    const saved = JSON.parse(localStorage.getItem('gafferPlays') || '{}');
    for (let name in saved) {
        const opt = document.createElement('option');
        opt.value = "CUSTOM_" + name;
        opt.innerText = name;
        group.appendChild(opt);
    }
}

function applyCustomTactic(name) {
    const saved = JSON.parse(localStorage.getItem('gafferPlays') || '{}');
    const data = saved[name];
    if (!data) return;
    const w = field.clientWidth, h = field.clientHeight;
    const move = (el, pos) => {
        el.style.left = (pos[0] * w) + 'px';
        el.style.top = (pos[1] * h) + 'px';
    };
    try {
        for (let i in data.red) if (redTeam[i]) move(redTeam[i], data.red[i]);
        for (let i in data.blue) if (blueTeam[i]) move(blueTeam[i], data.blue[i]);
        const ball = document.querySelector('.ball');
        if (ball && data.ball) move(ball, data.ball);
    } catch(e) { console.log(e); }
}

function createPiece(num, color, x, y) {
    const p = document.createElement('div');
    p.className = 'piece ' + color;
    if (num === 'ball') p.classList.add('ball'); else p.innerText = num;
    p.style.left = x + 'px';
    p.style.top = y + 'px';

    p.onpointerdown = (e) => {
        e.preventDefault();
        p.style.transition = 'none';
        p.setPointerCapture(e.pointerId);
        const half = p.offsetWidth / 2;
        p.onpointermove = (ev) => {
            const rect = field.getBoundingClientRect();
            p.style.left = (ev.clientX - rect.left - half) + 'px';
            p.style.top = (ev.clientY - rect.top - half) + 'px';
        };
        p.onpointerup = () => {
            p.onpointermove = null;
            setTimeout(() => {
                p.style.transition = 'left 0.6s cubic-bezier(0.23, 1, 0.32, 1), top 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            }, 10);
        };
    };
    layer.appendChild(p);
    return p;
}

function resetBoard() {
    if (!layer) return;
    layer.innerHTML = "";
    const w = field.clientWidth;
    const h = field.clientHeight;
    for (let i = 1; i <= 11; i++) {
        redTeam[i] = createPiece(i, 'red', 20, 20 + (i * 40));
        blueTeam[i] = createPiece(i, 'blue', w - 55, 20 + (i * 40));
    }
    createPiece('ball', 'ball', w / 2, h / 2);
    sizePieces();
}

/* Player pieces sized the same way as Chalk Talk's baseball/hockey boards
   (~4% of field width, 14px floor) instead of the old fixed 34px. */
function sizePieces() {
    const size = Math.max(14, field.clientWidth * 0.04);
    const font = Math.max(6, size * 0.32);
    for (let i = 1; i <= 11; i++) {
        [redTeam[i], blueTeam[i]].forEach(el => {
            if (!el) return;
            el.style.width = size + 'px';
            el.style.height = size + 'px';
            el.style.fontSize = font + 'px';
        });
    }
}

function togglePhase() {
    currentPhase = (currentPhase === 'defense') ? 'attack' : 'defense';
    applyTactics();
}

function setTool(tool, color) { drawMode = true; currentColor = color; }
function clearCanvas() { ctx.clearRect(0, 0, canvas.width, canvas.height); }
