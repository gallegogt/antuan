import Vue from 'vue'
import VeeValidate from 'vee-validate'
import App from './App'

Vue.use(VeeValidate)

/* eslint-disable no-unused-vars*/
const app = new Vue({
  el: '#app',
  render: h => h(App),
})

/*
function requireAll (r) { r.keys().forEach(r); }
requireAll(require.context('./', true, /\.pug$/));
*/
