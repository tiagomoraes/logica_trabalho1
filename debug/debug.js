// MAIN CODE
console.log('(Digite "exit" para sair)')
console.log('\nTrabalho 1 de Lógica, por Tiago Moraes, 2018');
console.log('-------------------------------------------------------');

let exit = false;
while(!exit) {
    let readline = require('readline-sync'); //imports the read file module

    let fileName = readline.question("What's the file name?\n");
    console.log('\033c'); //cleans the terminal

    if (fileName != 'exit') {
        console.log('-------------------------------------------------------')

        let input = readInput(fileName);
        let formula = readFormula(input);

        let arrExp = formula.expressions;
        let arrValues = formula.values;

        for(let i = 0; i < arrExp.length; i++) {
            let isValidSet = true;
            for(let j = 0; j < arrExp[i].length; j++) {
                if(!isValid(arrExp[i][j])) {
                    isValidSet = false;
                }
            }

            console.log('Problema #' + (i+1));

            if(isValidSet) {
                let exp = joinSet(arrExp[i]);
                let map = mapVariables(exp, arrValues[i]);

                let result = false;

                let resultUnformated = solve(exp, map);
                if(resultUnformated == false) {
                    result = false;
                } else {
                    result = true;
                }

                if(result) {
                    if(arrExp[i].length > 1) {
                        console.log('A valoracao-verdade satisfaz o conjunto.')
                    } else {
                        console.log('A valoracao-verdade satisfaz a proposicao.')
                    }
                } else {
                    if(arrExp[i].length > 1) {
                        console.log('A valoracao-verdade nao satisfaz o conjunto.')
                    } else {
                        console.log('A valoracao-verdade nao satisfaz a proposicao.')
                    }
                }
            } else {
                if(arrExp[i].length > 1) {
                    console.log('Ha uma palavra nao legitima no conjunto.​')
                } else {
                    console.log('A palavra nao e legitima.​​')
                }
            }

            console.log('\n');
        }
    }
}

// gets the input file name and returns an array with all the text lines on it
function readInput(fileName) {
    let fs = require("fs");
    let text  = fs.readFileSync('../Examples/' + fileName, "utf8").split('\n'); //  an array containing lines of text extracted from the file.
    return text;
}

function readFormula(text) {
    let result = { 'expressions': [], 'values': [] }
    text.shift(); // removes the first element of array
    result.expressions = readExpressions(text);
    result.values = readValues(text);
    return result;
}

function readExpressions(text) {
    let arrExpressions = [];
    for(let i = 0; i < text.length; i++) {
        arrExpressions[i] = ''; // initializes with an empty string
        for(let j = 0; j < text[i].length; j++) {
            if(text[i][j] !== ' ' && text[i][j] != 0 && text[i][j] != 1) { // if char is from expr
                arrExpressions[i] += text[i][j]; // concat the char
            }
        }
        arrExpressions[i] = arrExpressions[i].replace('{', '').replace('}', '').split(','); // replaces '{' and splits
    }
    return arrExpressions;
}

// gets the vlues array for each line
function readValues(text) {
    let arrValues = [];
    for(let i = 0; i < text.length; i++) {
        let value = [];
        for(let j = 0; j < text[i].length; j++) {
            if(text[i][j] !== ' ' && (text[i][j] == 0 || text[i][j] == 1)) {
                value.push(text[i][j]);
            }
        }
        arrValues.push(value);
    }
    return arrValues;
}

function isLetter(str) {
    let result = (str.length === 1) && (str.charCodeAt(0) >= 65 && str.charCodeAt(0) <= 90)
    return result;
}

// gets the most significative operator
function getMainOperation(exp) {
    let i = 1;
    let openPar = 0;
    let closePar = 0;

    while(i < exp.length - 1) {
        if(exp.charAt(i) === '(') {
            openPar++;
        } else if(exp.charAt(i) === ')') {
            closePar++;
        } else if(exp.charAt(i) === '~') {
            break;
        }

        i++;

        if(openPar === closePar) {
            break;
        }

    }

    return i;
}

//check if expression is valid
function isValid(exp) {
    if(exp.length === 1) { //base
        if(isLetter(exp)) {
            return true;
        } else {
            return false;
        }
    } else {
        let mainOp = getMainOperation(exp);

        if(exp.charAt(mainOp) == 'v') { //recursive cases
            return (isValid(exp.substring(1, mainOp)) && isValid(exp.substring(mainOp + 1, exp.length - 1)));
        } else if(exp.charAt(mainOp) == '>') {
            return (isValid(exp.substring(1, mainOp)) && isValid(exp.substring(mainOp + 1, exp.length - 1)));
        } else if(exp.charAt(mainOp) == '&') {
            return (isValid(exp.substring(1, mainOp)) && isValid(exp.substring(mainOp + 1, exp.length - 1)));
        } else if(exp.charAt(mainOp) == '~') {
            return (isValid(exp.substring(mainOp + 1, exp.length - 1)));
        } else {
            return false;
        }
    }
}

function joinSet(arrExp) {
    let result = '(';
    for(let i = 0; i < arrExp.length; i++) {
        if(isValid(arrExp[i])) {
            if(i === arrExp.length - 1) {
                result += arrExp[i];
            } else {
                result += (arrExp[i] + '&');
            }
        } else {
            return false;
        }
    }
    result += ')';
    return result;
}

function mapVariables(exp, arrValues) {
    // atribuir valor a cada variável, colocando o valor que ela vai ter em um array
    let arrMap = [[],[]]
    let cur = 0;
    for(let i = 0; i < exp.length; i++) {
        let letter = exp.charAt(i);
        if(letter.charCodeAt(0) >= 65 && letter.charCodeAt(0) <= 90) {
            if(!hasLetter(arrMap[0], letter)) {
                arrMap[0].push(letter);
                arrMap[1].push(arrValues[cur]);
                cur++;
            }
        }
    }
    return arrMap;
}

function hasLetter(arr, letter) {
    for(let i = 0; i < arr.length; i++) {
        if(arr[i] === letter) {
            return true;
        }
    }
    return false;
}

// this is the v() funnction
function findVal(arrMap, letter) {
    for(let i = 0; i < arrMap[0].length; i++) {
        if(arrMap[0][i] === letter) {
            return arrMap[1][i];
        }
    }
    return -1;
}

function solve(exp, arrMap) {
    if(isLetter(exp)) { // base case
        return findVal(arrMap, exp);
    } else { //recursive cases
        let mainOp = getMainOperation(exp);

        if(exp.charAt(mainOp) === 'v') {
            return (solve(exp.substring(1, mainOp), arrMap) || solve(exp.substring(mainOp + 1, exp.length - 1), arrMap));
        } else if(exp.charAt(mainOp) === '>') {
            return (!solve(exp.substring(1, mainOp), arrMap) || solve(exp.substring(mainOp + 1, exp.length - 1), arrMap));
        } else if(exp.charAt(mainOp) === '&') {
            return (solve(exp.substring(1, mainOp), arrMap) && solve(exp.substring(mainOp + 1, exp.length - 1), arrMap));
        } else if(exp.charAt(mainOp) === '~') {
            return (!solve(exp.substring(mainOp + 1, exp.length - 1), arrMap));
        }
    }
}