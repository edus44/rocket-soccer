

import getCorners from './getCorners'
import lineCircleCollide from './lineCircleCollide'

export default function(ball,players){
    let hits = {}

    for(let id in players){
        let player = players[id]
        if (collide(player,ball)){
            let hit = calcImpact(player,ball)
            hits['player:'+id] = hit[0]
            hits.ball = hit[1]
        }
    }
    return hits
}


function collide(player,ball){

    // Check if it is worth search for collision
    let distance = getDistance(player,ball)
    let diagonal = magnitude(player.w/2,player.h/2)
    if (distance > diagonal + ball.r)
        return false

    let corners = getCorners(player.x,player.y,player.w,player.h,player.angle)

    // Check if corners are inside the circle
    for(let i=0;i<corners.length;i++){
        if (cornerInBall(corners[i],ball)){
            return true
        }
    }

    //Check if lines collide circle
    for(let i=0;i<corners.length;i++){
        let j = i < corners.length-1 ? i+1 : 0

        if (lineCircleCollide(corners[i], corners[j], [ball.x,ball.y], ball.r)){
            return true
        }
    }

    return false
}


function calcImpact(a,b){
    var mass1 = a.mass
    var mass2 = b.mass
    var velX1 = a.dX
    var velX2 = b.dX
    var velY1 = a.dY
    var velY2 = b.dY
    
    var newVelX1 = (velX1 * (mass1 - mass2) + (2 * mass2 * velX2)) / (mass1 + mass2)
    var newVelX2 = (velX2 * (mass2 - mass1) + (2 * mass1 * velX1)) / (mass1 + mass2)
    var newVelY1 = (velY1 * (mass1 - mass2) + (2 * mass2 * velY2)) / (mass1 + mass2)
    var newVelY2 = (velY2 * (mass2 - mass1) + (2 * mass1 * velY1)) / (mass1 + mass2)
        
    return [[newVelX1,newVelY1],[newVelX2,newVelY2]]
} 


function cornerInBall(corner, ball) {
    if (ball.r===0) return false
    var dx = ball.x - corner[0]
    var dy = ball.y - corner[1]
    return dx * dx + dy * dy <= ball.r * ball.r
}

function getDistance(a, b) {
    var dx = b.x - a.x
    var dy = b.y - a.y
    return Math.sqrt(dx * dx + dy * dy)
}


function magnitude(x,y) {
    return Math.sqrt((x * x) + (y * y));
}