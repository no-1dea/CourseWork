'use strict';
const height = document.querySelector('.list').clientHeight/20;
const width = document.querySelector('.list').clientWidth/20;
const list = document.querySelector('.list');
for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        let block = document.createElement('div');
        block.classList.add('cell');
        block.style.left = `${20 * x}px`;
        block.style.top = `${20 * y}px`;
        block.setAttribute('id', `${y}_${x}`);
        list.appendChild(block)
        // block.addEventListener('click', (e) => {
        //     e.preventDefault();
        //     if (openList[y][x].type != Cell.TYPES.WALL && openList[y][x].type != Cell.TYPES.START && openList[y][x].type != Cell.TYPES.END ){
        //         block.removeAttribute("class");
        //         block.classList.add('wall');
        //         block.classList.add('cell');
        //         openList[y][x].type = Cell.TYPES.WALL;
        //         walls[y][x] = 1;
        //         btnStart.innerHTML = 'Start';
        //     } else if (openList[y][x].type != Cell.TYPES.START && openList[y][x].type != Cell.TYPES.END ){
        //         block.classList.remove('wall');
        //         openList[y][x].type = Cell.TYPES.CLEAN;
        //         walls[y][x] = 0;
        //         btnStart.innerHTML = 'Start';
        //     }
            
        // })
    }
}
function moveStart(e){
    e.target.classList.add('moving_Start');
}
function stopMoveStart(e){
    e.target.classList.remove('moving_Start');
}
function moveEnd(e){
    e.target.classList.add('moving_End');
}
function stopMoveEnd(e){
    e.target.classList.remove('moving_End');
}
let isEnd = false;
let isStart = false;
let isActive = false;
let isWall = false;
list.addEventListener('mousedown', (e) =>{
    isActive = true;
    if(e.target.classList.contains('start')){
        e.target.classList.remove('start');
        isStart = true;
    } else if(e.target.classList.contains('end')){
        e.target.classList.remove('end');
        isEnd = true;
    } else{
        if(e.target.classList.contains('wall')){
            isWall = true;
        }
    }
    
});
list.addEventListener('mouseup', (e) =>{
    if(isStart == true){
        e.target.removeAttribute("class");
        e.target.classList.add('start');
        e.target.classList.add('cell');
        isStart = false;
        startX = e.target.id.split('_')[1];
        startY = e.target.id.split('_')[0];
    }
    else if(isEnd == true){
        e.target.removeAttribute("class");
        e.target.classList.add('cell');
        e.target.classList.add('end');
        isEnd = false;
        endX = e.target.id.split('_')[1];
        endY = e.target.id.split('_')[0];
    }
    else if(isWall == true){
        isWall = false;
    }
    isActive = false;
});
list.addEventListener('mousemove', (e) =>{
    if(!isActive){
        return;
    }
    const targetX = e.target.id.split('_')[1];
    const targetY = e.target.id.split('_')[0];
    const targetCell = openList[targetY][targetX];

    if(isStart){
        e.target.addEventListener('mousemove', moveStart);
        e.target.addEventListener('mouseout', stopMoveStart);
    }
    else if(isEnd){
        e.target.addEventListener('mousemove', moveEnd);
        e.target.addEventListener('mouseout', stopMoveEnd);
    }
    else if(targetCell.type != Cell.TYPES.START &&  targetCell.type != Cell.TYPES.END){
        if (isWall == false ){
            e.target.removeAttribute("class");
            e.target.classList.add('wall');
            e.target.classList.add('cell');
            walls[targetY][targetX] = 1;
        } 
        else if (isWall == true){
            e.target.classList.remove('wall');
            walls[targetY][targetX]= 0;
        }
    }
    setTimeout(()=>{
        e.target.removeEventListener('mousemove', moveStart);
        e.target.removeEventListener('mousemove', stopMoveStart);
    }, 100)
    setTimeout(()=>{
        e.target.removeEventListener('mousemove', moveEnd);
        e.target.removeEventListener('mousemove', stopMoveEnd);
    }, 100)
    btnStart.innerHTML = 'Start';
    
});

const btnStart = document.querySelector('.button');
const btnClean = document.querySelector('.clean');
let startX = 2;
let startY = 5;
let endX = 0;
let endY = 0;
let min = 10000;
let answer = 0;
let walls = [];
let openList = [];
for (let y = 0; y < height; y++){
    walls[y] = [];
    openList[y] = [];
    for (let x = 0; x < width; x++){
        walls[y][x] = 0;
        openList[y][x] = 0;
        
    }
}

function listMin() {
    min = 10000;
    openList.forEach((i, index) => {
        i.forEach((item, n) => {
            if (item.activity == true) {
                min = Math.min(min, item.weight);
            }
        })
    });
    return min;
}

function arrow(y, x) {
    if (openList[y][x].distanceStart == 0) {
        openList[y][x].type = Cell.TYPES.START;
    } else {
        openList[y][x].type = Cell.TYPES.ROAD;
        arrow(openList[y][x].previousY, openList[y][x].previousX);
    }
}

function termsChanges(changesX, changesY, view, i) {
    if (
        (i.y + changesY) > -1 
        && (i.y + changesY) < height 
        && (i.x + changesX) > -1 
        && (i.x + changesX) < width 
        && openList[i.y + changesY][i.x + changesX].type != Cell.TYPES.WALL
        && openList[i.y + changesY][i.x + changesX].type != Cell.TYPES.START
    ) {
        if (view == 14) {
            if (openList[i.y + changesY][i.x].type == Cell.TYPES.WALL && openList[i.y][i.x + changesX].type == Cell.TYPES.WALL) {
                return 0
            }
            return 1
        }
        return 1
    }
    return 0
}

function range(changesX, changesY, view, i) {
    if (termsChanges(changesX, changesY, view, i)) {
        const currX = i.x + changesX;
        const currY = i.y + changesY;
        const currentCell = openList[currY][currX];
        const newWeight = 10 * (Math.abs(endX - currX) + Math.abs(endY - currY))
        if (currY == endY && currX == endX) {
            answer += 1;
            arrow(i.y, i.x);
            openList[currY][currX] = new Cell(
                currY, 
                currX, 
                i.x, 
                i.y, 
                i.distanceStart + view, 
                newWeight, 
                true, 
                Cell.TYPES.END
            );
        } else if (currentCell.weight == '' || currentCell.weight > i.distanceStart + view + newWeight) {
            currentCell.type = Cell.TYPES.ACTIVE;
            openList[currY][currX] = new Cell(
                currY, 
                currX, 
                i.x, 
                i.y, 
                i.distanceStart + view, 
                newWeight, 
                true, 
                Cell.TYPES.ACTIVE
            );
        }
    }
}

function takeSnapShot(openList){
    let snapShot = [];
    for(let y = 0; y < height; y++){
        snapShot[y] = [];
        for(let x = 0; x < width; x++){
            snapShot[y][x] = openList[y][x].type;
        }
    }
    return snapShot
}

class Cell {
    static TYPES = {START : 7, END: 9, WALL: 1, CLEAN: 0, ROAD: 8, ACTIVE: 2, VERIFIED: 6}
    constructor(y, x, previousX, previousY, distanceStart, distanceEnd, activity, type) {
        this.type = type;
        this.node = document.getElementById(`${y}_${x}`);
        this.y = y;
        this.x = x;
        this.previousX = previousX;
        this.previousY = previousY;
        this.distanceStart = distanceStart;
        this.distanceEnd = distanceEnd;
        if (distanceStart == '') {
            this.weight = '';
        } else {
            this.weight = this.distanceStart + this.distanceEnd;
        }
        this.activity = activity;
    }

    setPrevCell(cell) {
        this.previousX = cell.x;
        this.previousY = cell.y;
        this.distanceStart = cell.distanceStart + ((this.x !== cell.x && this.y !== cell.y) ? 14 : 10);
    }


}

const createOpenList = () => {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (startX == x && startY == y) {
                document.querySelector(`[id='${y}_${x}']`).classList.add('start');
                openList[y][x] = new Cell(y, x, x, y, 0, 10 * (Math.abs(endX - x) + Math.abs(endY - y)), true, Cell.TYPES.START);
            } else if (x == endX && endY == y) {
                openList[y][x] = new Cell(y, x, '', '', 10 * (Math.abs(endX - x) + Math.abs(endY - y)), 0, false, Cell.TYPES.END);
                document.querySelector(`[id='${y}_${x}']`).classList.add('end');
            } else if(walls[y][x] == 1) {
                openList[y][x] = new Cell(y, x, '', '', '', 10 * (Math.abs(endX - x) + Math.abs(endY - y)), false, Cell.TYPES.WALL);
                document.querySelector(`[id='${y}_${x}']`).classList.add('wall');
            } else{
                openList[y][x] = new Cell(y, x, '', '', '', 10 * (Math.abs(endX - x) + Math.abs(endY - y)), false, Cell.TYPES.CLEAN);
            }
        }
    }
}

const visualization = (steps) =>{
    let p = 0;
    for (let k = 0; k < steps.length; k++) {
        const i = steps[k];
        const prevStep = steps[k-1];
        for(let y = 0; y < height; y++){
            for(let x = 0; x < width; x++){
                if (
                    (k > 0 
                    && i[y][x] === prevStep[y][x])
                    || i[y][x] === Cell.TYPES.CLEAN
                ) {
                    continue;
                }
                if (i[y][x] == Cell.TYPES.ROAD){
                    p--;
                }
                setTimeout(()=>{
                    let element = openList[y][x].node;
                    if (i[y][x] == Cell.TYPES.ACTIVE){
                        element.removeAttribute("class");
                        element.classList.add('cell');
                        element.classList.add('active');
                    }
                    else if (i[y][x] == Cell.TYPES.VERIFIED){
                        element.removeAttribute("class");
                        element.classList.add('cell');  
                        element.classList.add('verified');
                    }
                    else if (i[y][x] == Cell.TYPES.ROAD){
                        p--;
                        element.removeAttribute("class");
                        element.classList.add('cell');
                        element.classList.add('road');
                    }
                }, 8 * (p++))
            } 
        }
    };
}
 
const algorithm = () =>{
    let steps = [];
    let countsteps = -1;
    while (answer == 0) {
        min = listMin();
        if (min == 10000) {
            answer += 1;
        }
        for(let y = 0; y < height; y++){
            for(let x = 0; x < width; x++){
                if (openList[y][x].weight == min && openList[y][x].activity == true) {
                    if (openList[y][x].y != startY || openList[y][x].x != startX) {
                        openList[y][x].type = Cell.TYPES.VERIFIED;
                    }
                    if(y == 8 && x == 10){
                        console.log( openList[y][x]);
                        debugger
                    }
                    range(0, 1, 10, openList[y][x]);
                    range(0, -1, 10, openList[y][x]);
                    range(1, 1, 14, openList[y][x]);
                    range(1, 0, 10, openList[y][x]);
                    range(1, -1, 14, openList[y][x]);
                    range(-1, 1, 14, openList[y][x]);
                    range(-1, 0, 10, openList[y][x]);
                    range(-1, -1, 14, openList[y][x]);
                    openList[y][x].activity = false;
                    min = 10000;
                    steps[countsteps+=1] = takeSnapShot(openList);
                }
            }
        }
    }
    return steps
}

const clean = (arg) =>{
    for(let y = 0; y < height; y++){
        for(let x = 0; x < width; x++){
            let element = openList[y][x].node;

            if(arg == Cell.TYPES.WALL && walls[y][x] == 1 ){
                walls[y][x] = 0;
                element.removeAttribute("class");
                element.classList.add('cell');
                openList[y][x].type = Cell.TYPES.CLEAN
                console.log(11);

            }
            if (openList[y][x].type == arg){
                element.removeAttribute("class");
                element.classList.add('cell');
                openList[y][x].type = Cell.TYPES.CLEAN;
            }
        }
    }

}

createOpenList();
// Нахождения пути
btnStart.addEventListener('click', () => {
    clean(Cell.TYPES.ACTIVE);
    clean(Cell.TYPES.ROAD);
    clean(Cell.TYPES.VERIFIED);
    createOpenList();
    min = 10000;
    answer = 0;
    visualization(algorithm());
    if (listMin() == 10000){
        document.querySelector('.length').innerHTML = `0`;
    }
    else{
        document.querySelector('.length').innerHTML = `${listMin()}`;
    }
    btnStart.innerHTML = 'Restart';
});

btnClean.addEventListener('click', () =>{
    document.querySelector('.length').innerHTML = `0`;
    clean(Cell.TYPES.WALL);
    clean(Cell.TYPES.ACTIVE);
    clean(Cell.TYPES.ROAD);
    clean(Cell.TYPES.VERIFIED);
    btnStart.innerHTML = 'Start';
});
