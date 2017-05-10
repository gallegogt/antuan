<template lang="pug">
  .input-text-component.inline-group
    label
      | {{ labelText }}
    input(
      v-model="lastValue"
      :placeholder="placeholder"
      @change="updateValue"
    )
</template>

<script>
  /**
   * Componente InputTextComponent
   */
  export default {
    name: 'InputTextComponent',
    // propiedades que se comportan como un attributos
    // del componente en el renderizado del HTML
    props: {
      labelText: {
        type: String,
        required: true,
      },
      value: {
        required: true,
      },
      placeholder: String,
    },
    /**
     * Deveuele el objeto data que el componente utiliza
     * para almacenar sus información
     *
     * @return {Object}
     */
    data() {
      return {
        lastValue: '',
      }
    },
    /**
     * Evento que se emite cuando el component está montado
     */
    mounted() {
      this.lastValue = this.value
    },
    // Objeto que contiene todos las funciones a ejecutar por
    // el componente
    methods: {
      /**
       * Notifica al padre de cambio en el componente
       */
      updateValue() {
        this.$emit('update:value', this.lastValue)
      },
    },
  }
</script>

<style lang="scss">
  .input-text-component {
    > input {
      min-width: 8.5rem;
      height: 2.0rem;
    }
  }

</style>
