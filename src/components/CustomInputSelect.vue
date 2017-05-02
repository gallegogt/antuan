<template lang="pug">
  .row
    input.custom-input-title(v-bind:name='labelname' v-bind:placeholder='labelplaceholder')
    select(v-bind:name='name')
      option(v-for="option in options" v-bind:value='option.value') {{ option.optionLabel }}

</template>

<script>

export default {
  name: 'inputselect',
  props: {
    'labelname': String,
    'labelplaceholder': String,
    'name': String
  },
  data(){
    return {
      options:[
        {optionLabel: "opción 1", value:"1"},
        {optionLabel: "opción 2", value:"2"}
      ]
    }
  }
}

</script>

<style>

</style>