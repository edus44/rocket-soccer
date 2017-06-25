<template>
    <g>
        <CircleBall :x="x" :y="y" :r="r"></CircleBall>
    </g>
</template>

<script>

import TWEEN from '@tweenjs/tween.js'
import CircleBall from './drawable/CircleBall.vue'

const toRad = Math.PI/180

function magnitude(x,y) {
    return Math.sqrt((x * x) + (y * y));
}

function random(minimum,maximum){
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
}

export default {
    components:{CircleBall},
    data:()=>({
        x:random(50,window.innerWidth-50),
        y:random(50,window.innerHeight-50),
        r: 30,
    }),
    created(){
        this.sX = random(-10,10)
        this.sY = random(-10,10)

        this.dumper = .8
    },
    bus:{
        tick(frameTime,accuracy){

            let dX=0,dY=0

            if (this.sX || this.sY){

                const r = this.r
                const h = window.innerHeight
                const w = window.innerWidth
                let x = dX = this.x
                let y = dY = this.y

                // Set new coordinates
                x += this.sX * accuracy
                y -= this.sY * accuracy

                // Limit Top
                if (y <= r){
                    this.sY *= - this.dumper
                    y = r
                }
                // Limit Bottom
                if(y >= h-r){
                    this.sY *= - this.dumper
                    y = h-r
                }
                // Limit Left
                if (x <= r){
                    this.sX *= - this.dumper
                    x = r
                }
                // Limit Right
                if(x >= w-r){
                    this.sX *= - this.dumper
                    x = w-r
                }
                let tween = TWEEN.Easing.Quadratic.Out

                // Friction
                let mag = magnitude(this.sX,this.sY)
                let friction = 0.010
                if (mag < 5){
                    friction = 0.02
                }
                this.sX *= 1 - friction
                this.sY *= 1 - friction

                // Minimum speed
                if (mag < 0.1){
                    this.sX = 0
                    this.sY = 0
                }

                // Apply
                this.x = x
                this.y = y

                // Delta
                dX = x - dX
                dY = y - dY
            }
            
            if (dX || dY || !this.zeroNotified){
                this.$bus.emit('updateBall',{
                    x:this.x,
                    y:this.y,
                    r:this.r,
                    dX: dX/frameTime,
                    dY: dY/frameTime,
                    mass:10,
                })

                this.zeroNotified = !dX && !dY
            }
        },
        hitBall(hit){
            this.sX = hit[0]*40
            this.sY = -hit[1]*40
        }
    }
}
</script>