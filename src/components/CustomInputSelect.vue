<template lang="pug">
  .row
    input.custom-input-title(v-bind:name='labelname' v-bind:placeholder='labelplaceholder')
    select(v-bind:name='name')
      option(v-for="option in options" v-bind:value='option.value') {{ option.optionLabel }}
    span.delete(@click='remove') x

</template>

<script>

export default {
  name: 'inputselect',
  props: {
    labelname: String,
    labelplaceholder: String,
    name: String,
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
  methods: {
    remove() {
      this.$emit('removeSelect', this)
    },
  },
}

</script>

<style lang="scss">

  .custom-input-title {
      width: 180px;
      margin-right: 20px;
  }

  .delete{
     margin-left: 0.2rem;
     /*padding-left: 1rem;*/
  }


</style>
