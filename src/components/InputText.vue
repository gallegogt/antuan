<template lang="pug">
  .row.inputtext
    label(v-bind:for='name') {{ labeltext }}
    input(v-bind:name="name" v-bind:value="value" v-bind:placeholder="placeholder")

</template>


<script>

export default {
  name: 'inputtext',
  props: {
    name: String,
    labeltext: String,
    value: String,
    placeholder: String,
  },
  data() {
    return {
    }
  },
}

</script>

<style>


</style>
