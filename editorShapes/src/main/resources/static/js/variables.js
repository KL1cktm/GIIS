const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const toggleMode = document.getElementById('toggleMode');
const logArea = document.getElementById('logArea');
const toolButtons = document.querySelectorAll('[data-tool]');
const algorithmButtons = document.querySelectorAll('[data-alg]');
const clearBtn = document.getElementById('clearCanvas');
const algorithmSelector = document.getElementById('algorithmSelector');
const colorInput = document.getElementById('lineColor');


let points = [];
let selectedTool = 'Pen';
let selectAlgorithm = 'DDA';
let debugMode = false;