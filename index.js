const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')  // context to draw shapes

canvas.width = 1024;
canvas.height = 576;

// game background
ctx.fillRect(0, 0, canvas.width, canvas.height) // starting co-ordinate (0,0)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    }, 
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128,
    }, 
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6,
})


const controlButtons = new Sprite({
    position: {
        x: 0,
        y: 0,
    }, 
    imageSrc: './img/controlButtons.png'
})


const player = new Fighter({
    position: {
        x: 0,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x: 0,
        y: 0,
    },
})

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0,
    },
})

const keys = {
    d: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    w: {
        pressed: false,
    },

    ArrowRight: {
        pressed: false,
    },
    ArrowLeft: {
        pressed: false,
    },
    ArrowUp: {
        pressed: false,
    },
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    controlButtons.update()
    shop.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    // Player movements
    if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
    } else if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
    }

    // Enemy movements
    if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
    } else if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    }

    // Detect for collision
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking
    ) {
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector('#enemyHealthTracker').style.width = enemy.health + '%'
    }

    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking
    ) {
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealthTracker').style.width = player.health + '%'
    }

    // end the game based on health
    if (player.health <= 0 || enemy.health <= 0) {
        determineWinner({ player, enemy, timerId })
    }
}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        // Player key functionalities
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break 
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            player.velocity.y = -20
            break
        case ' ':
            player.attack()
            break

        // Enemy key functionalities
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break 
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -20
            break
        case 'ArrowDown':
            enemy.attack()
            break
    }

})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break

        case 'a':
            keys.a.pressed = false
            break

        case 'w':
            keys.w.pressed = false
            break

        // Enemy key functionalities
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break

        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break

        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            break
    }

})