class Sprite {
    constructor( {position, imageSrc, scale = 1, frameMax = 1,  offset= {x : 0, y : 0}}) {
        this.position = position;
        this.width = 50;
        this.height = 100;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.frameMax = frameMax;
        this.frameCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 12;
        this.offset = offset;

    }

    draw() {  
        c.drawImage(this.image,
                    this.frameCurrent * (this.image.width / this.frameMax),
                    0,
                    this.image.width / this.frameMax,
                    this.image.height,
                    this.position.x - this.offset.x,
                    this.position.y - this.offset.y,
                    (this.image.width / this.frameMax )* this.scale,
                    this.image.height * this.scale
                );
    }

    animateFrame() {
        this.framesElapsed++;

        if (this.framesElapsed % this.framesHold === 0) {

            if (this.frameCurrent < this.frameMax - 1) {
                this.frameCurrent++; 
            } else {
                this.frameCurrent = 0;
            }
        }
    }

    update() {
        this.draw();
        this.animateFrame();       
      
    }


}


class Fighter extends Sprite {
    constructor( {
        position, velocity,
        color = 'red',
        imageSrc,
        scale = 1,
        frameMax = 1,
        offset= {x : 0, y : 0},
        sprites,
        attackBox = {offset : {}, width : undefined, height : undefined},
        }) {
        super ({
            position,
            imageSrc,
            scale,
            frameMax,
            offset
        }) 

        this.velocity = velocity; 
        this.width = 50;
        this.height = 150;
        this.lastKey;
        this.attackBox = {
            position : {
                x : this.position.x,
                y : this.position.y
            },
            offset : attackBox.offset,
            width : attackBox.width,
            height : attackBox.height 
        };
        this.color = color;
        this.isAttacking;
        this.health = 100;
        this.frameCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 8;
        this.sprites = sprites;
        this.dead = false;

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }


    update() {
        this.draw(); 
        if(!this.dead) this.animateFrame();

        //attack box
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;


        //gravity function
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 110) {
            this.velocity.y = 0;
            this.position.y = 316
        } else {
            this.velocity.y += gravity;
        }
    }

    attack() {
        this.switchSprite('attack')
        this.isAttacking = true;
    }

    takeHit() {
        this.health -= 20;

        if (this.health <= 0 ) {
            this.switchSprite('death');
        } else {
            this.switchSprite('takeHit');
        }

    }


    switchSprite(sprite) {
        if (this.image ===  this.sprites.death.image) {
            if (this.frameCurrent === this.sprites.death.frameMax - 1 ) {
                this.dead = true;
            }
            return 
        }

        if (
            this.image === this.sprites.attack.image && 
            this.frameCurrent < this.sprites.attack.frameMax - 1
        )
             return

        //override when fighter get hit
        if (
            this.image === this.sprites.takeHit.image && 
            this.frameCurrent < this.sprites.takeHit.frameMax - 1
        )
             return

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                  this.image = this.sprites.idle.image;
                  this.frameMax = this.sprites.idle.frameMax;
                  this.frameCurrent = 0;
                }
                break;
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.frameMax = this.sprites.run.frameMax;
                    this.frameCurrent = 0;
                }
                break;
            case 'runback':
                if (this.image !== this.sprites.runback.image){
                    this.image = this.sprites.runback.image;
                    this.frameMax = this.sprites.runback.frameMax;
                    this.frameCurrent = 0;
                }
                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.frameMax = this.sprites.jump.frameMax;
                    this.frameCurrent = 0;
                }
                break;
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.frameMax = this.sprites.fall.frameMax;
                    this.frameCurrent = 0;
                }
                break;
            case 'attack':
                if (this.image !== this.sprites.attack.image) {
                    this.image = this.sprites.attack.image;
                    this.frameMax = this.sprites.attack.frameMax;
                    this.frameCurrent = 0;
                }
                break;
            case 'takeHit':
            if (this.image !== this.sprites.takeHit.image) {
                this.image = this.sprites.takeHit.image;
                this.frameMax = this.sprites.takeHit.frameMax;
                this.frameCurrent = 0;
            }
            break;
            case 'death':
            if (this.image !== this.sprites.death.image) {
                this.image = this.sprites.death.image;
                this.frameMax = this.sprites.death.frameMax;
                this.frameCurrent = 0;
            }
            break;
                
        }
    }

    
}