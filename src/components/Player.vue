<template>
    <g>
        <Car :x="x" :y="y" :w="w" :h="h" :angle="angle" :id="id" :shift="shift"></Car>
    </g>
</template>

<script>

import TWEEN from '@tweenjs/tween.js'

import Car from './drawable/Car.vue'

let controls = {
    'a' : ['up','right','down','left'],
    'b' : ['w','d','s','a'],
    'c' : ['i','l','k','j'],
}

function random(minimum,maximum){
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
}
export default {
    components:{Car},
    data:()=>({
        w:44,
        h:50,
        angle:0,
        x:random(50,window.innerWidth-50),
        y:random(50,window.innerHeight-50),
        shift:10,
    }),
    props:['id'],
    created(){
        this.move = {
            multiplier: 5,
            speed:0,
            dir:0,
            in:400,
            out:500,
            tween:null,
            pressed:{'-1':false,'1':false},
        }
        this.turn = {
            multiplier: 3,
            speed:0,
            dir:0,
            in:200,
            out:200,
            tween:null,
            pressed:{'-1':false,'1':false},
        }

        let c = controls[this.id]
        this.$wasd(c[0] + 'Press',   this.start.bind(this,'move',1))
        this.$wasd(c[0] + 'Release', this.stop.bind(this,'move',1))
        this.$wasd(c[1] + 'Press',   this.start.bind(this,'turn',1))
        this.$wasd(c[1] + 'Release', this.stop.bind(this,'turn',1))
        this.$wasd(c[2] + 'Press',   this.start.bind(this,'move',-1))
        this.$wasd(c[2] + 'Release', this.stop.bind(this,'move',-1))
        this.$wasd(c[3] + 'Press',   this.start.bind(this,'turn',-1))
        this.$wasd(c[3] + 'Release', this.stop.bind(this,'turn',-1))

    },
    wasd:{
        spacePress(){this.move.multiplier=15},
        spaceRelease(){this.move.multiplier=5}
    },
    methods:{
        start(type,dir){
            let unit = this[type]
            unit.pressed[dir] = true

            // Stop tween if coming from other dir
            if (unit.tween)
                unit.tween.stop()

            unit.dir = dir
            unit.tween = new TWEEN.Tween(unit)
                .to({speed: 1 * dir},unit.in)
                .easing(TWEEN.Easing.Quadratic.In)
                .start()
        },

        stop(type,dir){
            let unit = this[type]
            unit.pressed[dir] = false

            // Only stop if dir is the current dir
            if (unit.dir == dir){
                // Check if there is previous dir active
                if (unit.pressed[dir*-1]){
                    this.start(type,dir*-1)
                }else{
                    unit.tween.stop()
                    unit.tween = new TWEEN.Tween(unit)
                        .to({speed: 0},unit.out)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start()
                }
            }
        },
    },
    bus:{
        tick(frameTime,accuracy){
            let dX = 0, dY = 0, dA = 0

            if (this.turn.speed){
                // This allows going backwards thanks to speed sign.
                // The offset set a minimum speed when not moving and 
                // turn less when going backwards
                let relSpeed = this.move.speed + .3

                dA = this.turn.speed * accuracy * relSpeed * this.turn.multiplier

                // Set new angle 
                this.angle += dA
            }

            if (this.move.speed){
                
                let x = dX = this.x
                let y = dY = this.y
                
                // Calc radians
                let rads = this.angle * (Math.PI/180)

                let moveSpeed = this.move.speed * accuracy * this.move.multiplier

                // Apply speed movement
                x += Math.sin(rads) * moveSpeed
                y -= Math.cos(rads) * moveSpeed

                // Bounding limits
                // TODO: take size into accounts
                x = Math.min(Math.max(x,0),window.innerWidth)
                y = Math.min(Math.max(y,0),window.innerHeight)

                // Apply
                this.x = x
                this.y = y

                // Delta
                dX = x - dX
                dY = y - dY
            }

            if (dX || dY || dA || !this.zeroNotified){
                this.$bus.emit('updatePlayer',this.id,{
                    x:this.x,
                    y:this.y,
                    angle:this.angle,
                    w:this.w,
                    h:this.h,
                    dX: dX/frameTime,
                    dY: dY/frameTime,
                    dA: dA/frameTime,
                    mass:20,
                })

                this.zeroNotified = !dX && !dY && !dA
            }
        }
    }
}
</script>