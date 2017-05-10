<template lang="pug">
  .custom-item-component
    .custom-input-title
      input(
        v-model="customLabel"
        :placeholder="placeholderForLabel"
        @change="onChangeLabelValue()"
      )
    column-select-component.custom-input-value(
      v-if = "isRelateByColumn"
      :value.sync = "customValue"
      :sheet-columns = "sheetColumns"
      @change="onChangeColValue()"
    )
    .custom-input-value(v-if="!isRelateByColumn")
      input(
        v-model="customValue"
        :placeholder="placeholderForInput"
        @change="onChangeColValue()"
      )
    .custom-item-delete
      span(@click="remove") x
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
      ColumnSelectComponent,
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
    display: table;
    margin-top: 0.5rem;

    .custom-input-title,
    .custom-input-value,
    .custom-item-delete {
      display: table-cell;
    }

    .custom-input-value {
      width: 2rem;

      > input {
        min-width: 8.5rem;
        height: 2.0rem;
      }
    }

    .custom-input-title {
      width: 12rem;

      > input {
        min-width: 10.5rem;
        height: 2.0rem;
      }
    }

    .custom-item-delete span {
      margin-left: 0.5rem;
      text-transform: uppercase;
      background-color: #d64937;
      color: white;
      border-color: #d64937;
      border-style: solid;
      width: 1rem;
      text-align: center;
    }
  }
</style>
