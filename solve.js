// MAIN CODE

let readline = require('readline-sync'); //imports the read file module
let fs = require("fs"); // the module to read and write files

let fileName = readline.question("\nDigite o sub-diretorio do arquivo:\n");

let input = readInput(fileName);
let formula = readFormula(input);

let arrExp = formula.expressions;
let arrValues = formula.values;

let outputText = '';

for(let i = 0; i < arrExp.length; i++) {
  let isValidSet = true;
  for(let j = 0; j < arrExp[i].length; j++) {
    if(!isValid(arrExp[i][j])) {
      isValidSet = false;
    }
  }

  console.log('Problema #' + (i+1));
  outputText += 'Problema #' + (i+1) + '\n';

  if(i == arrExp.length - 1) {
    if(isValidSet) {
      let exp;
      if(arrExp[i].length > 1) {
        exp = joinSet(arrExp[i]);
      } else {
        exp = arrExp[i][0];
      }
      let map = mapVariables(exp, arrValues[i]);
  
      let result = false;
      let resultUnformated = solve(exp, map);
      if(resultUnformated == false) {
        result = false;
      } else {
        result = true;
      }
  
      if(result) {
        if(input[i].charAt(0) === '{') {
          console.log('A valoracao-verdade satisfaz o conjunto.\n');
          outputText += 'A valoracao-verdade satisfaz o conjunto.\n';
        } else {
          console.log('A valoracao-verdade satisfaz a proposicao.\n');
          outputText += 'A valoracao-verdade satisfaz a proposicao.\n';
        }
      } else {
        if(input[i].charAt(0) === '{') {
          console.log('A valoracao-verdade nao satisfaz o conjunto.\n');
          outputText += 'A valoracao-verdade nao satisfaz o conjunto.\n';
        } else {
          console.log('A valoracao-verdade nao satisfaz a proposicao.\n');
          outputText += 'A valoracao-verdade nao satisfaz a proposicao.\n';
        }
      }
    } else {
      if(input[i].charAt(0) === '{') {
        console.log('Ha uma palavra nao legitima no conjunto.\n');
        outputText += 'Ha uma palavra nao legitima no conjunto.\n';      
      } else {
        console.log('A palavra nao e legitima.\n');
        outputText += 'A palavra nao e legitima.\n';       
      }
    }
  } else {
    if(isValidSet) {
      let exp;
      if(arrExp[i].length > 1) {
        exp = joinSet(arrExp[i]);
      } else {
        exp = arrExp[i][0];
      }
      let map = mapVariables(exp, arrValues[i]);
  
      let result = false;
      let resultUnformated = solve(exp, map);
      if(resultUnformated == false) {
        result = false;
      } else {
        result = true;
      }
  
      if(result) {
        if(input[i].charAt(0) === '{') {
          console.log('A valoracao-verdade satisfaz o conjunto.\n');
          outputText += 'A valoracao-verdade satisfaz o conjunto.\n\n';
        } else {
          console.log('A valoracao-verdade satisfaz a proposicao.\n');
          outputText += 'A valoracao-verdade satisfaz a proposicao.\n\n';
        }
      } else {
        if(input[i].charAt(0) === '{') {
          console.log('A valoracao-verdade nao satisfaz o conjunto.\n');
          outputText += 'A valoracao-verdade nao satisfaz o conjunto.\n\n';
        } else {
          console.log('A valoracao-verdade nao satisfaz a proposicao.\n');
          outputText += 'A valoracao-verdade nao satisfaz a proposicao.\n\n';
        }
      }
    } else {
      if(input[i].charAt(0) === '{') {
        console.log('Ha uma palavra nao legitima no conjunto.\n');
        outputText += 'Ha uma palavra nao legitima no conjunto.\n\n';      
      } else {
        console.log('A palavra nao e legitima.\n');
        outputText += 'A palavra nao e legitima.\n\n';       
      }
    }
  }
}

fs.writeFileSync('saida.out', outputText);

// gets the input file name and returns an array with all the text lines on it
function readInput(fileName) {
  let fs = require("fs"); // the module to read and write files
  let text  = fs.readFileSync('./Examples/' + fileName, "utf8").split('\n'); //  an array containing lines of text extracted from the file.
  text.shift(); // removes the first element of array
  text = text.slice(0, -1);
  return text;
}

function readFormula(text) {
  let result = { 'expressions': [], 'values': [] }
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
  let i = 0;
  let openPar = 0;
  let closePar = 0;

  if(exp.charAt(1) == '~') {
    return 1;
  }

  while(i < exp.length - 1) {
    if(exp.charAt(i) === '(') {
      openPar++;
    } else if(exp.charAt(i) === ')') {
      closePar++;
    }

    i++;

    if(openPar === closePar + 1) {
      if(i <= exp.length-1 && (exp.charAt(i) === 'v' || exp.charAt(i) === '>' || exp.charAt(i) === '&' || exp.charAt(i) === '~')) {
        return i;
      }
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
  } else { //recursive cases
    let mainOp = getMainOperation(exp);

    if(exp.charAt(0) === '(' && exp.charAt(exp.length - 1) === ')') { 
      if(exp.charAt(mainOp) == 'v') {
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
}

function joinSet(arrExp) {
  let result;
  for(let i = 0; i < arrExp.length; i++) {
    if(isValid(arrExp[i])) {
      if(i === 0) {
        result = arrExp[i];
      } else {
        result = '(' + result + '&' + arrExp[i] + ')';
      }
    } else {
      return false;
    }
  }
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
      if(arrMap[1][i] == 0) {
        return false;
      } else {
        return true;
      }
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
      return ((!(solve(exp.substring(1, mainOp), arrMap))) || solve(exp.substring(mainOp + 1, exp.length - 1), arrMap));
    } else if(exp.charAt(mainOp) === '&') {
      return (solve(exp.substring(1, mainOp), arrMap) && solve(exp.substring(mainOp + 1, exp.length - 1), arrMap));
    } else if(exp.charAt(mainOp) === '~') {
      return (!(solve(exp.substring(mainOp + 1, exp.length - 1), arrMap)));
    }
  }
}