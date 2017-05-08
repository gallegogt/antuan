<template lang="pug">
  .column-select-component
    label(v-if="showLabel")
      | {{ label }}
    select(
      v-model="currentValue"
      @change="onChangeValue"
      )
      option(value="-1")
        | Seleccione la columna
      option(v-for="option in sheetColumns" v-bind:value="option.index")
        | {{ option.label }}
</template>

<script>
  /**
   * ColumnSelectComponent
   *
   * Agrupa un label y un select para visualizar y poder selecionar
   * la columna deseada
   */
  export default {
    name: 'ColumnSelectComponent',
    props: {
      // Propiedad requerida sheetColumns
      // arreglo de columnas, donde tienen la siguiente estructura
      // [ {label: 'contenido', index: 1}, ...]
      sheetColumns: {
        required: true,
        type: Array,
      },
      // Propiedad requerida label para el component
      // Texto que define el label del componente
      label: {
        required: false,
        type: String,
        default: '',
      },
      // Propiedad requerida Valor
      // Elemento donde el padre le pondrá un valor por defecto
      value: {
        required: true,
        type: String,
      },
    },
    /**
     * Deveuele el objeto data que el componente utiliza
     * para almacenar sus información
     *
     * @return {Object}
     */
    data() {
      return {
        currentValue: '-1',
      }
    },
    /**
     * Evento que se emite cuando el component está montado
     */
    mounted() {
      this.currentValue = this.value || '-1'
    },
    // Objeto que contiene todos las funciones a ejecutar por
    // el componente
    methods: {
      /**
       * Se ejecuta cada vez que se cambia el valor del select
       */
      onChangeValue() {
        const value = this.currentValue
        this.$emit('update:value', value)
        this.$emit('change', value)
      },
    },
    // Computed Values
    computed: {
      /**
       * Devuelve True si el label no es vacío
       *
       * @return {bool} Devuelve true si el label no es vacío
       */
      showLabel() {
        return this.label.length > 0
      },
    },
  }
</script>

<style>

</style>
