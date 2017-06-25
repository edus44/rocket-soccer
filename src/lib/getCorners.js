

export default function getCorners(cx,cy,width,height,angle){
    let ph = angle * (Math.PI/180)

    let wc = width/2 * Math.cos(ph)
    let ws = width/2 * Math.sin(ph)

    let hs = height/2 * Math.sin(ph)
    let hc = height/2 * Math.cos(ph)

    return [
        [ cx - wc + hs, cy - ws - hc], // up left
        [ cx + wc + hs, cy + ws - hc], // up right
        [ cx + wc - hs, cy + ws + hc], // down right
        [ cx - wc - hs, cy - ws + hc], // down left
    ]
}