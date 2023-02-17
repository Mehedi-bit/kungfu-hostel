const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')  // context to draw shapes

canvas.width = 1024;
canvas.height = 576;

// game background
ctx.fillRect(0, 0, canvas.width, canvas.height) // starting co-ordinate (0,0)