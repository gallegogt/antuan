<template lang="pug">
  .custom-item-component
    input.custom-input-title(
      v-model="customLabel"
      :placeholder="placeholderForLabel"
      @change="onChangeLabelValue()"
    )
    column-select-component(
      v-if = "isRelateByColumn"
      :value.sync = "customValue"
      :sheet-columns = "sheetColumns"
      @change="onChangeColValue()"
    )
    input(
      v-if="!isRelateByColumn"
      v-model="customValue"
      :placeholder="placeholderForInput"
      @change="onChangeColValue()"
    )
    span.delete(@click="remove") x
</template>

<script>
  import ColumnSelectComponent from './ColumnSelectComponent'
  /**
   * Componente CustomItemComponent
   */
  export default {
    name: 'CustomItemComponent',
    // resgistro de los componentes
    components: {
      'column-select-component': ColumnSelectComponent,
    },
    // propiedades que se comportan como un attributos
    // del componente en el renderizado del HTML
    props: {
      label: {
        required: true,
        type: String,
      },
      placeholderForLabel: {
        required: false,
        type: String,
        default: 'Nuevo Label',
      },
      placeholderForInput: {
        required: false,
        type: String,
        default: 'Nuevo Valor',
      },
      value: {
        required: true,
        type: String,
      },
      sheetColumns: {
        type: Array,
        default: [],
      },
      isRelateByColumn: {
        type: Boolean,
        default: false,
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
        customValue: '',
        customLabel: '',
      }
    },
    /**
     * Evento que se emite cuando el component está montado
     */
    mounted() {
      this.customValue = this.value
      this.customLabel = this.label
    },
    // Objeto que contiene todos las funciones a ejecutar por
    // el componente
    methods: {
      /**
       * Notifica al padre para que elimine el elmento actual
       */
      remove() {
        this.$emit('remove')
      },
      /**
       * Actualiza el valor del label en el padre
       */
      onChangeLabelValue() {
        this.$emit('update:label', this.customLabel)
      },
      /**
       * Actualiza el valor del value en el padre
       */
      onChangeColValue() {
        this.$emit('update:value', this.customValue)
      },
    },
  }
</script>

<style lang="scss">
  .custom-item-component {
    .custom-input-title {
        width: 180px;
        margin-right: 20px;
    }

    .delete {
      margin-left: 0.2rem;
      /*padding-left: 1rem;*/
    }

    .column-select-component {
      display: inline-block
    }
  }
</style>
