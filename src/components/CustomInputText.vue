<template lang="pug">
  .row
    input.custom-input-title(
      v-bind:value='labelvalue'
      v-bind:placeholder="labelplaceholder"
      v-on:change="updateLabelValue()"
      )
    input(
      v-bind:value="value"
      v-bind:placeholder="placeholder"
      v-on:change="updateValue()"
      )
    span.delete(@click='remove') x

</template>

<script>

export default {
  name: 'inputselect',
  props: {
    labelplaceholder: String,
    labelvalue: String,
    placeholder: String,
    value: String,
  },
  data() {
    return {
      modelLabelValue: '',
      modelValue: '',
    }
  },
  methods: {
    updateLabelValue() {
      this.$emit('update:modelLabelValue', this.labelValue)
    },
    updateValue() {
      this.$emit('update:modelValue', this.value)
    },
    remove() {
      this.$emit('removeText')
    },
  },
}

</script>

<style lang="scss">

  .custom-input-title {
    width: 180px;
    margin-right: 20px;
  }


</style>
