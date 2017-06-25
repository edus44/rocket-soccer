<template>
    <g>
        <circle :cx="x" :cy="y" :r="r"></circle>
        <!-- <circle :cx="x" :cy="y" :r="r" fill="rgba(255,0,0,.5)"></circle> -->
        <!-- <circle :cx="x" :cy="y" r="1.5" fill="green"></circle> -->
    </g>
</template>

<script>
export default {
    props:['x','y','r']
}
</script>