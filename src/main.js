import Vue from 'vue'
import App from './components/App.vue'
import Wasd from 'vue-wasd'
import BusPlugin from './plugins/BusPlugin'

Vue.use(Wasd)
Vue.use(BusPlugin)

new Vue({
    el: '#app',
    render: h => h(App)
})
