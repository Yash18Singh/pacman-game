const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

c.canvas.hidden = true

const modal = document.getElementById('modal')
const scoreEl = document.getElementById('scoreEl')
const bigScoreEl = document.getElementById('bigScoreEl')
const startGameBtn = document.getElementById('startGameBtn')

//SOUNDS
let gameMusic = new Audio('./sounds/pacman_music.mp3')
let bigPelletMusic = new Audio('./sounds/pacman_eatfruit.wav')
let pelletMusic = new Audio('./sounds/pacman_chomp.wav')
let death = new Audio('./sounds/pacman_death.wav')

canvas.height = window.innerHeight
canvas.width = window.innerWidth

//variables
let boundaries = []
let pellets = []
let bigPellets = 0
let lastKey
let score = 0
let player
let ghosts
let map

function init(){
    pellets = []
    bigPellets = 0
    score = 0
    player = new Player({
        position:{
            x:Boundary.width + Boundary.width/2,
            y:Boundary.height + Boundary.height/2,
        },
        velocity:{
            x:0,
            y:0
        },
        radius:15,
    })
    ghosts = [
        new Ghost({
            position:{
                x:Boundary.width * 6 + Boundary.width/2,
                y:Boundary.height + Boundary.height/2 
            },
            velocity:{
                x:Ghost.speed,
                y:0
            },
            radius:15,
            color:'red'
        }),
    
        new Ghost({
            position:{
                x:Boundary.width * 6 + Boundary.width/2,
                y:Boundary.height * 3 + Boundary.height/2
            },
            velocity:{
                x:0,
                y:Ghost.speed
            },
            radius:15,
            color:'green'
        }),
    ]
    scoreEl.innerHTML = 0
    bigScoreEl.innerHTML = 0
    modal.style.display = 'none'
    c.canvas.hidden = false
    gameMusic.play()
    gameMusic.volume = 0.3
}

setInterval(()=>{
    gameMusic.currentTime = 0
    gameMusic.play()
    gameMusic.volume = 0.3
},211000)


if(canvas.width < 450){
     map = [
        ['1', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
        ['|', ' ', '.', '.', '.', '.', '.', '.', '.', '|'],
        ['|', '.', 'b', '.', '[', ']', '.', 'b', '.', '|'],
        ['|', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
        ['|', '.', '[', ']', '.', '.', '.', 'b', '.', '|'],
        ['|', '.', '.', '.', '.', '^', '.', '.', '.', '|'],
        ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '|'],
        ['|', '.', '.', '.', '.', '_', '.', '.', '.', '|'],
        ['|', '.', '[', ']', '.', '.', '.', 'b', '.', '|'],
        ['|', '.', '.', '.', '.', '^', '.', '.', '.', '|'],
        ['|', '.', 'b', '.', '[', '5', ']', '.', '^', '|'],
        ['|', '.', '.', '.', '.', '.', '.', '.', '_', '|'],
        ['4', '-', '-', '-', '-', '-', '-', '-', '-', '3']
      ]
      
} else if(canvas.width > 450){
    map = [
        ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
        ['|', ' ', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.','.',  '|'],
        ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '[', '-', ']','.',  '|'],
        ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '.', '.', '.','.',  '|'],
        ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', 'b', '.', 'b','.',  '|'],
        ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '.', '.', '.','.',  '|'],
        ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '[', '-', ']','.',  '|'],
        ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '.', '.', '.','.',  '|'],
        ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '[', '7', ']','.',  '|'],
        ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '.', '|', '.','.',  '|'],
        ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '[', '5', ']','.',  '|'],
        ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.','.',  '|'],
        ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-','-',  '3']
    ]
}




function createImage(src){
    const image = new Image()
    image.src=src
    return image
}


//BOUNDARY
class Boundary{
    static width = 40
    static height = 40

    constructor({position, image}){
        this.position = position 
        this.width = 40
        this.height = 40
        this.image = image
    }

    draw(){
        // c.fillStyle = 'blue'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)

        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

//GHOST
class Ghost{
    static width = 30
    static height = 30
    static speed = 1

    constructor({position, velocity, radius, color}){
        this.position = position
        this.velocity = velocity
        this.radius = radius
        this.color = color
        this.prevCollision = []
        this.speed = 1
    }

    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, Math.PI * 2, 0, false);
        c.fillStyle = this.color
        c.fill()
        c.closePath()
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x 
        this.position.y += this.velocity.y
    }
}

//PLAYER
class Player{
    constructor({position, velocity, radius}){
        this.position = position
        this.velocity = velocity 
        this.radius = radius
        this.radians = 0.75
        this.openRate = 0.05
        this.rotation = 0
    }

    draw(){
        c.save()
        c.translate(this.position.x, this.position.y)
        c.rotate(this.rotation)
        c.translate(-this.position.x, -this.position.y)
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI * 2 - 0.75, false)
        c.lineTo(this.position.x, this.position.y)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
        c.restore()
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x 
        this.position.y += this.velocity.y

        if(this.radians < 0 || this.radians > 0.75){
            this.openRate = -this.openRate 
        }
        this.radians += this.openRate
    }
}

//PALLET
class Pellet{
    constructor({position, radius}){
        this.position = position
        this.radius = radius
    }

    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, Math.PI * 2, 0, false);
        c.fillStyle = 'white'
        c.fill()
        c.closePath()
    }

    update(){
        this.draw()
    }
}




//structure of boundary






//making boundary
map.forEach((row, yIndex)=>{
    row.forEach((symbol, xIndex)=>{
        //selecting symbol for boundary
        switch(symbol){
            case '-':{
                boundaries.push(new Boundary({
                    position:{x:Boundary.width*xIndex, y:Boundary.height*yIndex},
                    image:createImage('./images/pipeHorizontal.png')
                }))
                break
            };

            case '|':{
                boundaries.push(new Boundary({
                    position:{x:Boundary.width*xIndex, y:Boundary.height*yIndex},
                    image:createImage('./images/pipeVertical.png')
                }))
                break
            };

            case '1':{
                boundaries.push(new Boundary({
                    position:{x:Boundary.width*xIndex, y:Boundary.height*yIndex},
                    image:createImage('./images/pipeCorner1.png')
                }))
                break
            };

            case '2':{
                boundaries.push(new Boundary({
                    position:{x:Boundary.width*xIndex, y:Boundary.height*yIndex},
                    image:createImage('./images/pipeCorner2.png')
                }))
                break
            };

            case '3':{
                boundaries.push(new Boundary({
                    position:{x:Boundary.width*xIndex, y:Boundary.height*yIndex},
                    image:createImage('./images/pipeCorner3.png')
                }))
                break
            };

            case '4':{
                boundaries.push(new Boundary({
                    position:{x:Boundary.width*xIndex, y:Boundary.height*yIndex},
                    image:createImage('./images/pipeCorner4.png')
                }))
                break
            };

            case 'b':{
                boundaries.push(new Boundary({
                    position:{x:Boundary.width*xIndex, y:Boundary.height*yIndex},
                    image:createImage('./images/block.png')
                }))
                break
            };

            case '[':{
                boundaries.push(new Boundary({
                    position:{x:Boundary.width*xIndex, y:Boundary.height*yIndex},
                    image: createImage('./images/capLeft.png')
                }))
                break
            };

            case ']':{
                boundaries.push(new Boundary({
                    position:{x:Boundary.width*xIndex, y:Boundary.height*yIndex},
                    image: createImage('./images/capRight.png')
                }))
                break
            };

            case '_':{
                boundaries.push(new Boundary({
                    position:{x:Boundary.width*xIndex, y:Boundary.height*yIndex},
                    image: createImage('./images/capBottom.png')
                }))
                break
            };

            case '^':{
                boundaries.push(new Boundary({
                    position:{x:Boundary.width*xIndex, y:Boundary.height*yIndex},
                    image: createImage('./images/capTop.png')
                }))
                break
            };

            case '+':{
                boundaries.push(new Boundary({
                    position:{x:Boundary.width*xIndex, y:Boundary.height*yIndex},
                    image: createImage('./images/pipeCross.png')
                }))
                break
            };

            case '+':{
                boundaries.push(new Boundary({
                    position:{x:Boundary.width*xIndex, y:Boundary.height*yIndex},
                    image: createImage('./images/pipeConnectorTop.png')
                }))
                break
            };

            case '5':{
                boundaries.push(new Boundary({
                    position:{x:Boundary.width*xIndex, y:Boundary.height*yIndex},
                    image: createImage('./images/pipeConnectorTop.png')
                }))
                break
            };

            case '6':{
                boundaries.push(new Boundary({
                    position:{x:Boundary.width*xIndex, y:Boundary.height*yIndex},
                    image: createImage('./images/pipeConnectorRight.png')
                }))
                break
            };

            case '7':{
                boundaries.push(new Boundary({
                    position:{x:Boundary.width*xIndex, y:Boundary.height*yIndex},
                    image: createImage('./images/pipeConnectorBottom.png')
                }))
                break
            };

            case '8':{
                boundaries.push(new Boundary({
                    position:{x:Boundary.width*xIndex, y:Boundary.height*yIndex},
                    image: createImage('./images/pipeConnectorLeft.png')
                }))
                break
            };

            case '.':{
                var newRadius
                var randomNumber = Math.random()

                if(randomNumber < 0.98){
                    newRadius = 3
                }
                else{
                    newRadius = 8
                    bigPellets = bigPellets + 1
                }

                if(bigPellets >= Math.floor(Math.random() * 6) + 2){
                    newRadius = 3
                }
                pellets.push(new Pellet({
                    position:{x: xIndex * Boundary.width + Boundary.width/2, y: yIndex * Boundary.height + Boundary.height/2},
                    radius:newRadius
                }))
                break
            };
        }
    })
})


//making player


//making ghosts



//PLAYER MOVEMENT

const keys = {
    w:{
        pressed: false
    },
    a:{
        pressed: false
    },
    s:{
        pressed: false
    },
    d:{
        pressed: false
    },
}



class PlayerMovement{
    constructor(){}
    up(){
        keys.w.pressed = true
        lastKey = 'w'
    }
    down(){
        keys.s.pressed = true
        lastKey = 's'
    }
    left(){
        keys.a.pressed = true
        lastKey = 'a'
    }
    right(){
        keys.d.pressed = true
        lastKey = 'd'
    }

    stopUp(){
        keys.w.pressed = false
    }
    stopDown(){
        keys.s.pressed = false
    }
    stopLeft(){
        keys.a.pressed = false
    }
    stopRight(){
        keys.d.pressed = false
    }
}

const playerMove = new PlayerMovement()

window.addEventListener('keydown', ({key})=>{
    switch(key){
        case 'w':{
            playerMove.up()
            break
        };
        case 'a':{
            playerMove.left()
            break
        };
        case 's':{
            playerMove.down()
            break
        };
        case 'd':{
            playerMove.right()
            break
        };
    }
})

window.addEventListener('keyup', ({key})=>{
    switch(key){
        case 'w':{
            playerMove.stopUp()
            break
        };
        case 'a':{
            playerMove.stopLeft()
            break
        };
        case 's':{
            playerMove.stopDown()
            break
        };
        case 'd':{
            playerMove.stopRight()
            break
        };
    }
})

function ghostCollidesWithBoundary({circle,rectangle}){
    const padding = Boundary.width/2 - circle.radius - 1
    return(
        circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding
          && circle.position.x + circle.radius +  circle.velocity.x >= rectangle.position.x - padding
          && circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding
          && circle.position.x - circle.radius + circle.velocity.x  <= rectangle.position.x + rectangle.width + padding
    )
}

function playerCollidesWithBoundary({circle,rectangle}){
    return(
        circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height 
          && circle.position.x + circle.radius +  circle.velocity.x >= rectangle.position.x 
          && circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y 
          && circle.position.x - circle.radius + circle.velocity.x  <= rectangle.position.x + rectangle.width 
    )
}



let animationId = null
function animate(){
    animationId =  requestAnimationFrame(animate)

    c.clearRect(0,0,canvas.width, canvas.height)


    //to not collide with objects inside
    if(keys.w.pressed && lastKey === 'w'){
        for(let i=0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if(playerCollidesWithBoundary({circle:{...player, velocity:{x:0,y:-3}}, rectangle:boundary})){
                 player.velocity.y = 0
                 break
            } else{
                player.velocity.y = -3
            }
        } 
    }
    else if(keys.a.pressed && lastKey === 'a'){
        for(let i=0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if(playerCollidesWithBoundary({circle:{...player, velocity:{x:-3,y:0}}, rectangle:boundary})){
                 player.velocity.x = 0
                 break
            } else{
                player.velocity.x = -3
            }
        } 
    }
    else if(keys.s.pressed && lastKey === 's'){
        for(let i=0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if(playerCollidesWithBoundary({circle:{...player, velocity:{x:0,y:3}}, rectangle:boundary})){
                 player.velocity.y = 0
                 break
            } else{
                player.velocity.y = 3
            }
        } 
    }
    else if(keys.d.pressed && lastKey === 'd'){
        for(let i=0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if(playerCollidesWithBoundary({circle:{...player, velocity:{x:3,y:0}}, rectangle:boundary})){
                 player.velocity.x = 0
                 break
            } else{
                player.velocity.x = 3
            }
        } 
    }

    //DRAWING BOUNDARIES
    boundaries.map((boundary)=>{
        boundary.draw()

        //player touching the boundaries
        if(playerCollidesWithBoundary({
            circle:player,
            rectangle:boundary
        }))
          {
                player.velocity.x = 0
                player.velocity.y = 0
          }
    })

    //DRAWING PLAYER
    player.update()

    //DRAWING PALLETES
    for(let i = pellets.length - 1; i>=0; i--){
       const pellet = pellets[i]
       pellet.draw()
    }  

    //REMOVING PALETTES
    pellets.map((pellet,index)=>{
        if(Math.hypot(pellet.position.x - player.position.x, pellet.position.y - player.position.y) < pellet.radius + player.radius){
            pellets.splice(index,1)
            if(pellet.radius === 8){
                score += 500
                bigPelletMusic.play()
                setTimeout(()=>{
                    bigPelletMusic.pause()
                    bigPelletMusic.currentTime = 0;
                },50)
            }
            if(pellet.radius === 3){
                score += 100
                pelletMusic.play()
                setTimeout(()=>{
                    pelletMusic.pause()
                    pelletMusic.currentTime = 0;
                },50)

            }
        }
        scoreEl.innerHTML = score
        bigScoreEl.innerHTML = score
    })

    //REGENERATING PALETTES
    if(pellets.length <= 0){
        map.forEach((row, yIndex)=>{
            row.forEach((symbol, xIndex)=>{
                switch(symbol){
                    case '.':{
                        var newRadius
                        var randomNumber = Math.random()
        
                        if(randomNumber < 0.95){
                            newRadius = 3
                        }
                        else{
                            newRadius = 8
                            bigPellets = bigPellets + 1
                        }
        
                        if(bigPellets >= Math.floor(Math.random() * 6) + 2){
                            newRadius = 3
                        }
                        pellets.push(new Pellet({
                            position:{x: xIndex * Boundary.width + Boundary.width/2, y: yIndex * Boundary.height + Boundary.height/2},
                            radius:newRadius
                        }))
                        break
                    };
                }
            })
        })
    }

     //DRAWING GHOSTS
     ghosts.map((ghost)=>{
        ghost.update()

        //ghost touching the player
        if(Math.hypot(ghost.position.x - player.position.x, ghost.position.y - player.position.y) < ghost.radius + player.radius){
            animationId = cancelAnimationFrame(animationId)
            gameMusic.pause()
            death.play()
            c.canvas.hidden = true
            modal.style.display = 'flex'
            gameMusic.currentTime = 0;
        }

        const collisions = []

        //checking if the boundaries are touching
        boundaries.map((boundary)=>{
                if(!collisions.includes('right') && ghostCollidesWithBoundary({circle:{...ghost, velocity:{x:ghost.speed,y:0}}, rectangle:boundary})){
                    collisions.push('right')
                } 
                if(!collisions.includes('left') && ghostCollidesWithBoundary({circle:{...ghost, velocity:{x:-ghost.speed,y:0}}, rectangle:boundary})){
                    collisions.push('left')
                } 
                if(!collisions.includes('up') && ghostCollidesWithBoundary({circle:{...ghost, velocity:{x:0,y:-ghost.speed}}, rectangle:boundary})){
                    collisions.push('up')
                } 
                if(!collisions.includes('down') && ghostCollidesWithBoundary({circle:{...ghost, velocity:{x:0,y:ghost.speed}}, rectangle:boundary})){
                    collisions.push('down')
                } 
        })

        if(collisions.length > ghost.prevCollision.length){
            ghost.prevCollision = collisions
        }

        if(JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollision)){
            if(ghost.velocity.x > 0){
                ghost.prevCollision.push('right')
            } 
            else if(ghost.velocity.x < 0){
                ghost.prevCollision.push('left')
            } 
            else if(ghost.velocity.y < 0){
                ghost.prevCollision.push('up')
            } 
            else if(ghost.velocity.y > 0){
                ghost.prevCollision.push('down')
            } 

            //checking possible paths
            const pathways = ghost.prevCollision.filter((collision)=>{
                return !collisions.includes(collision)
            })
            //console.log('pathways', {pathways})
            const direction = pathways[Math.floor(Math.random() * pathways.length)]
            //console.log({direction})

            switch(direction){
                case 'down':{
                    ghost.velocity.x = 0
                    ghost.velocity.y = ghost.speed
                    break
                }

                case 'up':{
                    ghost.velocity.x = 0
                    ghost.velocity.y = -ghost.speed
                    break
                }

                case 'right':{
                    ghost.velocity.x = ghost.speed
                    ghost.velocity.y = 0
                    break
                }

                case 'left':{
                    ghost.velocity.x = -ghost.speed
                    ghost.velocity.y = 0
                    break
                }
            }
            ghost.prevCollision = []
        }
    })

    if(player.velocity.x > 0){
        player.rotation = 0
    }
    else if(player.velocity.x < 0){
        player.rotation = Math.PI
    }
    else if(player.velocity.y > 0){
        player.rotation = Math.PI / 2
    }
    else if(player.velocity.y < 0){
        player.rotation = Math.PI * 1.5
    }
}



startGameBtn.addEventListener('click', ()=>{
    init()
    animationId = requestAnimationFrame(animate);
})




