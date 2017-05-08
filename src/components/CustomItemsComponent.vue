<template lang="pug">
  div
    custom-item-component(
      v-for="item in itemList"
      :label.sync="item.label"
      :value.sync="item.value"
      :is-relate-by-column="item.isRelateByColumn"
      :sheet-columns="sheetColumns"
      :key="item.id"
      @remove="removeCustomItem(item.id)"
    )
    .row
      .newfieldlink
        a(@click="addNewCustomItem(true)")
          | + ítems desde columna
        a(@click="addNewCustomItem(false)")
          | + ítems personalizado
</template>

<script>
  import CustomItemComponent from './CustomItemComponent'
  /**
   * Componente CustomItems
   *
   * Representa un listado de los componentes
   * que se quieren asociar tanto al set como al box
   */
  export default {
    name: 'CustomItemsComponent',
    // propiedades que se comportan como un attributos
    // del componente en el renderizado del HTML
    props: {
      // Arreglo de elementos asociado dicho arrgeglo
      // tendría la siguiente estructura:
      // [{
      //    id: String,
      //    label: String,
      //    value: String,
      //    isRelateByColumn: Bool
      // }, ...]
      items: {
        type: Array,
        required: true,
      },
      // Listados de las columnas extraidas del GS SpreedSheet
      sheetColumns: {
        type: Array,
        required: true,
      },
    },
    // Registro de componentes asociado a este componente
    components: {
      CustomItemComponent,
    },
    /**
     * Deveuele el objeto data que el componente utiliza
     * para almacenar sus información
     *
     * @return {Object}
     */
    data() {
      return {
        // listado de los elementos
        itemList: [],
      }
    },
    /**
     * Evento que se emite cuando el component está montado
     */
    mounted() {
      this.itemList = this.items
    },
    // Objeto que contiene todos las funciones a ejecutar por
    // el componente
    methods: {
      /**
       * Adiciona un nuevo elemento personalizado
       *
       * @param {bool} isRelateByColumn Define si el elemento insertado va
       *                      a renderizar un select o un input
       */
      addNewCustomItem(isRelateByColumn) {
        this.itemList.push({
          id: Date.now(),
          label: '',
          value: isRelateByColumn ? '-1' : '',
          isRelateByColumn,
        })
        this.$emit('update:items', this.itemList)
      },
      /**
       * Elimina un elemento personalizado de la lista
       *
       * @param {Object} element elemento que se quiere
       *                  eliminar de la lista
       */
      removeCustomItem(elementId) {
        this.itemList =
          this.itemList.filter(item => item.id !== elementId)
        this.$emit('update:items', this.itemList)
      },
    },
  }

</script>
<style lang="scss" scoped>
  .newfieldlink {
    text-align: right;

    a {
      margin-right: 1rem;
      display: inline-block;
    }
  }
</style>
