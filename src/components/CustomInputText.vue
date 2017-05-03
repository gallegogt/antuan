<template lang="pug">
  .row
    input.custom-input-title(v-bind:name='labelname' v-bind:placeholder="labelplaceholder")
    input(v-bind:name="name" v-bind:placeholder="placeholder")

</template>

<script>

export default {
  name: 'inputselect',
  props: {
    labelname: String,
    labelplaceholder: String,
    name: String,
    placeholder: String,
  },
  data() {
    return {
    }
  },
}

</script>

<style lang="scss">

  .custom-input-title {
    width: 180px;
    margin-right: 20px;
  }


</style>
