<template lang="pug">
  .row
    label(:for='name') {{ labeltext }}
    select(:name='name')
      option(v-for="option in options" v-bind:value='option.value') {{ option.optionLabel }}


</template>

<script>

export default {
  name: 'inputselect',
  props: {
    name: String,
    labeltext: String,
  },
  data() {
    return {
      options: [
        {
          optionLabel: 'opción 1',
          value: '1',
        },
        {
          optionLabel: 'opción 2',
          value: '2',
        },
      ],
    }
  },
}


</script>

<style>



</style>
