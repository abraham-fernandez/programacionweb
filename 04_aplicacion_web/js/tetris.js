document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let square;
    /*Función para pintar el tablero principal del juego*/
    const drawBoard = () => {
        for (let i = 0; i < 210; i++) {
            if (i < 200) {
                square = document.createElement('div')
            } else {
                square = document.createElement('div')
                square.classList.add('taken')
            }

            grid.append(square)
        }
    }
    drawBoard();
    /*Obtencién de elementos para después operar con ellos*/
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
        'orange',
        '#fd0003',
        '#f714f7',
        '#00f701',
        '#01f7f7'
    ]

    //Tetrominoes (figuras)
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]
    //posición inicial de donde parten las figuras (columna 4)
    let currentPosition = 4
    let currentRotation = 0

    console.log(theTetrominoes[0][0])

    //obtener de forma aleatoria el tetromino y su rotación
    let random = Math.floor(Math.random() * theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]

    //dibujar el Tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    //borrar the Tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''

        })
    }

    //función para manejar los controles del teclado (flechas)
    const control = (e) => {
        if (e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    }
    //asignación del evento
    document.addEventListener('keyup', control)

    //función para mover hacia abajo
    const moveDown = () => {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    //función para controlar si la figura llega abajo y pararla
    const freeze = () => {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //iniciar caida de la nueva figura
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    //función para mover a la izquierda controlando si es el limite del tablero o si hay otra pieza
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if (!isAtLeftEdge) currentPosition -= 1
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }
        draw()
    }

    //función para mover a la izquierda controlando si es el limite del tablero o si hay otra pieza
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
        if (!isAtRightEdge) currentPosition += 1
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }
        draw()
    }

    function isAtRight() {
        return current.some(index => (currentPosition + index + 1) % width === 0)
    }

    function isAtLeft() {
        return current.some(index => (currentPosition + index) % width === 0)
    }

    /*Obtenemos la posición actual. Luego, verificamos si la pieza está cerca del lado izquierdo.
      Agregamos 1 porque el índice de posición puede ser 1 menos que donde está la pieza (con la forma en que están indexadas).
      Usamos la posición real para verificar si está volteado hacia el lado derecho si es así,
      agregamos  uno para envolverlo nuevamente y comprobamos de nuevo.
      Posición de pase desde el principio, ya que el bloque largo podría necesitar moverse más.*/
    const checkRotatedPosition=(P)=> {
        P = P || currentPosition
        if ((P + 1) % width < 4) {
            if (isAtRight()) {
                currentPosition += 1
                checkRotatedPosition(P)
            }
        } else if (P % width > 5) {
            if (isAtLeft()) {
                currentPosition -= 1
                checkRotatedPosition(P)
            }
        }
    }

    // función para rotar los tetrominos
    const rotate=()=> {
        undraw()
        currentRotation++
        if (currentRotation === current.length) { //if the current rotation gets to 4, make it go back to 0
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        checkRotatedPosition()
        draw()
    }
    //iniciar variables para mostar el siguiente tetromino
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0


    //mostrar los tetrominos sin rotación
    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
        [0, 1, displayWidth, displayWidth + 1], //oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] //iTetromino
    ]

    //mostrar en el tablero pequeño el siguiente tetromino
    function displayShape() {
        //remove any trace of a tetromino form the entire grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    //añadir funcionalidad al botón para empezar o pausar
    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            displayShape()
        }
    })

    //función parar mostar la puntación
    const addScore=()=> {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }


    const gameOver=()=> {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'FIN'
            clearInterval(timerId)
        }
    }

})
