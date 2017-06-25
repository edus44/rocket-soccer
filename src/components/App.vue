<template>
    <div  class="app">
        <!-- <pre>{{debug}}</pre> -->
        <svg>
            <Player id="a"></Player>
            <Player id="b"></Player>
            <Player id="c"></Player>
            <Ball></Ball>
        </svg>
    </div>
</template>

<script>

import Player from './Player.vue'
import Ball from './Ball.vue'

import collision from '../lib/collision'

export default {
    components:{Player,Ball},
    data:()=>({
        debug:{},
    }),
    created(){
        this.fps = 0
        this.ball = {}
        this.players = {}
        this.hits = {}
    },
    methods:{
        checkHit(){
            this.hits = collision(this.ball,this.players)
            if (this.hits.ball)
                this.$bus.emit('hitBall',this.hits.ball)
        }
    },
    bus:{
        tick(frameTime,accuracy){
            this.checkHit()
            
            // let n = 60 / accuracy
            // this.fps -= Math.round((this.fps - n) / 10)

            // this.debug = JSON.stringify({
            //     fps:this.fps,
            //     ball:this.ball,
            //     players:this.players,
            //     hits:this.hits,
            // },null,4)

        },
        updatePlayer(id,data){
            this.players[id] = data
        },
        updateBall(data){
            this.ball = data
        }
    }
}






</script>

<style lang="scss">
    body,html{
        margin:0;
        width: 100%;
        height: 100%;
        display: flex;
    }

    div.app, svg{
        width: 100%;
        height: 100%;
        display: block;
    }
    div.app{
        pre{
            position: absolute;
        }
    }

</style>
