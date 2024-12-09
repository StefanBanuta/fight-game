const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');  

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7;

const background = new Sprite({
   position: {
    x : 0,
    y: 0
   },
   imageSrc : './img/background1.png' 
})

const shop = new Sprite({
    position: {
     x : 570,
     y: 271
    },
    imageSrc : './img/shop_asset.png' ,
    scale : 1.3,
    frameMax : 6
 })



const player = new Fighter({
    position : {
        x : 20,
        y : 0
    },
    velocity : {
        x : 0, 
        y : 0
    },
    offset : {
        x : 0,
        y : 0
    },
    imageSrc : './lumberjack/idle.png' ,
    scale : 5,
    frameMax : 9,
    offset : {
        x : 210,
        y : 248
    },
    sprites : {
        idle : {
            imageSrc : './lumberjack/idle.png' ,
            frameMax : 9
        },
        run : {
            imageSrc : './lumberjack/run.png' ,
            frameMax : 9
        },
        runback : {
            imageSrc : './lumberjack/runback.png' ,
            frameMax : 9
        },
        jump : {
            imageSrc : './lumberjack/jump.png' ,
            frameMax : 2
        },
        fall : {
            imageSrc : './lumberjack/fall.png' ,
            frameMax : 2
        },
        attack : {
            imageSrc : './lumberjack/attack.png' ,
            frameMax : 6
        },
        takeHit : {
            imageSrc : './lumberjack/HURT.png' ,
            frameMax : 4
        },
        death : {
            imageSrc : './lumberjack/death.png' ,
            frameMax : 6
        }
    },
    attackBox : {
        offset :{
            x : 40,
            y : 90
        },
        width : 100,
        height : 30
    }
    
})


const enemy = new Fighter({
    position : {
        x : 750,
        y : 0
    },
    velocity : {
        x : 0, 
        y : 0
    },
    offset : {
        x: 0,
        y : 0
    },

    imageSrc : './BearPaid/Grizzly/BearIdle.png' ,
    scale : 8,
    frameMax : 6,
    offset : {
        x : 30,
        y : 100
    },
    sprites : {
        idle : {
            imageSrc : './BearPaid/Grizzly/BearIdle.png' ,
            frameMax : 6
        },
        run : {
            imageSrc : './BearPaid/Grizzly/BearRun.png',
            frameMax : 5
        },
        runback : {
            imageSrc : './BearPaid/Grizzly/BearRunBack.png' ,
            frameMax : 5
        },
        jump : {
            imageSrc : './BearPaid/Grizzly/BearJump.png' ,
            frameMax : 11
        },
          attack : {
            imageSrc : './BearPaid/Grizzly/BearAttack.png' ,
            frameMax : 9
        },
        takeHit : {
            imageSrc : './BearPaid/Grizzly/BearHurt.png' ,
            frameMax : 10
        },
        death : {
            imageSrc : './BearPaid/Grizzly/diebear1.png' ,
            frameMax : 12
        }
    },
    attackBox : {
        offset :{
            x : -10,
            y : 70
        },
        width : 60,
        height : 50 
    }

})


const keys = {
    a : {
        pressed : false
    },
    d : {
        pressed : false
    },
    w : {
        pressed : false
    },
    ArrowRight : {
        pressed : false
    },
    ArrowLeft : {
        pressed : false
    },
    ArrowUp : {
        pressed : false
    }

}


decreseTimer();

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height);
    
    background.update();
    shop.update();

    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height);
    
    player.update();
    enemy.update();

//player movement
    player.velocity.x = 0;

    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
        player.switchSprite('runback');
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    }

//player jump
    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }
    
//enemy movement
    enemy.velocity.x = 0;

    
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5;
        enemy.switchSprite('runback');
    } else {
        enemy.switchSprite('idle');
    }

//enemy jump
    if (enemy.velocity.y < 0 ||  enemy.velocity.y > 0) {
        enemy.switchSprite('jump');
    }  


//detecting collision
    if (rectangularCollision({
        rectangle1 : player,
        rectangle2 : enemy
    }) && player.isAttacking
       && player.frameCurrent === 4) 
        {
        enemy.takeHit();
        player.isAttacking = false;
        gsap.to('#eneamyHelth', {
            width : enemy.health + '%'
    })
    }

    // if player miss 
    if (player.isAttacking && player.frameCurrent === 4) {
        player.isAttacking = false;
    }

    //enemy attack
    if (rectangularCollision({
        rectangle1 : enemy,
        rectangle2 : player
    }) && enemy.isAttacking 
        && enemy.frameCurrent === 4) 
        {
        player.takeHit();
        enemy.isAttacking = false;

        gsap.to('#playerHelth', {
                width : player.health + '%'
        })
    }

    //if enemy miss
    if (enemy.isAttacking && enemy.frameCurrent === 4) {
        enemy.isAttacking = false;
    }

    if (enemy.health <= 0 || player.health <= 0) {
        determinWinner({player, enemy, timerId});
    }


}

animate();


window.addEventListener('keydown', (event) => {
    if (!player.dead) {
        switch (event.key) {
            case "d":
                keys.d.pressed = true;
                player.lastKey = 'd';
                break;
            case 'a':
                keys.a.pressed = true;
                player.lastKey = 'a';
                break;
            case 'w':
                player.velocity.y = -20;
                break;
            case ' ':
                player.attack();
                break;
        }
    }
        
        //enemy keys
    if (!enemy.dead) {
        switch (event.key) {
            case "ArrowRight":
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
                break;
            case 'ArrowUp':
                enemy.velocity.y = -20;
                break;
            case 'ArrowDown':
                enemy.attack();
                break;
        }
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case "d":
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'w':
            keys.w.pressed = false;
            break;

        //enemy keys    
        case "ArrowRight":
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            break;
    }
})

