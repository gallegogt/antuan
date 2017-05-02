import Vue from 'vue'
import App from './App.vue'

new Vue({
  el: '#app',
  render: h => h(App)
})


function requireAll (r) { r.keys().forEach(r); }
requireAll(require.context('./', true, /\.pug$/));