const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const toggleMode = document.getElementById('toggleMode');
const logArea = document.getElementById('logArea');
const toolButtons = document.querySelectorAll('[data-tool]');
const curveToolButtons = document.querySelectorAll('#toolSelector + .dropdown-menu [data-tool="Curve"]');
const algorithmButtons = document.querySelectorAll('#algorithmSelector + .dropdown-menu [data-alg]');
const algorithmButtonsSecond = document.querySelectorAll('#algorithmSelectorSecond + .dropdown-menu [data-alg]');
const clearBtn = document.getElementById('clearCanvas');
const algorithmSelector = document.getElementById('algorithmSelector');
const algorithmSelectorSecond = document.getElementById('ElementSelectorSecond');
const algorithmSelectorCurve = document.getElementById('ElementSelectorCurve');
const colorInput = document.getElementById('lineColor');


let points = [];
let selectedTool = 'Pen';
let selectAlgorithm = 'DDA';
let selectLine2 = 'Circle';
let selectCurveLine = 'Hermite';
let debugMode = false;
let radius = 10;
let a = 10;
let b = 5;
let numberOfPoints = 4;
let degree = 3;
let position = true;
