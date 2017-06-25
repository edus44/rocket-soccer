
import EventEmitter from 'eventemitter3'
import TWEEN from '@tweenjs/tween.js'



/**
 * bus Mixin to listen to lifecycle hooks
 * @type {Object}
 */
const busMixin = {

    /**
     * Initialize events preset at $options.bus
     * @return {void}
     */
    created(){
        if (typeof this.$options.bus == 'object'){
            for(let evName in this.$options.bus){
                this.$bus.on(evName,this.$options.bus[evName].bind(this))
            }
        }
    },

    /**
     * Remove listeners saved in _busListeners
     * @return {void}
     */
    beforeDestroy(){
        if (this._busListeners && this._busListeners.length){
            for(let i in this._busListeners){
                this.$bus.removeListener(this._busListeners[i][0],this._busListeners[i][1])
            }
        }
    }
}


function getBus(){
    let bus = new EventEmitter()

    let _on = bus.on.bind(bus)

    bus.on = function(evName,fn){
        _on(evName,fn)

        if (!this._busListeners) this._busListeners = []

        this._busListeners.push([evName,fn])
    }

    return bus
}


function startAnimation(bus){
    let lastDraw = Date.now()

    function animate(){
        requestAnimationFrame(animate)
        // setTimeout(animate,1000/15)

        let frameTime = Date.now() - lastDraw
        let accuracy = frameTime / (1000/60)

        if (TWEEN.getAll().length){
            TWEEN.update()
            bus.emit('tweenTick',frameTime,accuracy)
        }

        bus.emit('tick',frameTime,accuracy)

        lastDraw = Date.now()
    }
    animate()
}


/**
 * Plugin install
 * @param  {Vue} Vue 
 * @return {void}
 */
export default Vue => {

    // Avoid multiple installs
    if (Vue.prototype.$bus) return

    Vue.prototype.$bus = getBus()
    Vue.mixin(busMixin)

    startAnimation(Vue.prototype.$bus)
}