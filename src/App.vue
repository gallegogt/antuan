<template lang="pug">
  #app
    form#dataform
      h3.step-1(v-show='isVisibleSetp1')
        | 1 Identifica las prendas
      h3.step-2(v-show='!isVisibleSetp1')
        | 2 Seleccionemos los ítems de encabezado
      hr

      .input-box.step-1(v-show='isVisibleSetp1')
        p
          b Selecciona las columnas en las que se ubican las prendas, la talla y la cantidad:

        column-select-component(
          :value.sync = "clothingInfo.colClothing"
          label = "Prendas"
          :sheet-columns = "sheetColumns"
        )
        column-select-component(
          :value.sync = "clothingInfo.colSize"
          label = "Talla"
          :sheet-columns = "sheetColumns"
        )
        column-select-component(
          :value.sync = "clothingInfo.colAmount"
          label = "Cantidad"
          :sheet-columns = "sheetColumns"
        )

      .input-box.step-2(v-show='!isVisibleSetp1')
        p
          b Define ítems incluidos en el set
        .row
          label(for='notContainsSet')
            | No contiene sets
          input#no-set(name='notContainsSet' type='checkbox')

        .set-info
          column-select-component(
            :value.sync = "set.groupBy"
            label = "Agrupar por"
            :sheet-columns = "sheetColumns"
          )
          column-select-component(
            :value.sync = "set.correlativeNumber"
            label = "Nº Correlativo"
            :sheet-columns = "sheetColumns"
          )

        custom-items-component(
          :items.sync="set.customItems"
          :sheet-columns="sheetColumns"
        )

        p
          b Define ítems incluidos en el set

        inputtext(name="setporcaja" value="1" label="Cantidad de set por caja" placeholder="")
        inputtext(name="proveedor" value="Antuan Juri S.A." label="Proveedor" placeholder="")
        inputtext(name="destinatario" value="" label="Destinario" placeholder="")
        inputtext(name="orden_compra" value="" label="Orden de Compra" placeholder="")
      //
        custom-items-component(
          :items.sync="box.customItems"
          :sheet-columns="sheetColumns"
        )

    .button-section
      button.step-1.siguiente(v-show='isVisibleSetp1' @click='toggle')
        | Siguiente >>
      button.step-2.atras(v-show='!isVisibleSetp1' @click='toggle')
        | << Atrás
      button.step-2.generar
        | Generar

      span.code
        pre
          | {{ dataAsJSON }}


</template>

<script>
  import ColumnSelectComponent from './components/ColumnSelectComponent'
  import CustomItemsComponent from './components/CustomItemsComponent'

  import InputText from './components/InputText'
  import Antuan from './utils/antuan'

  const antuanStore = new Antuan()

  /**
   * Componente Principal
   */
  export default {
    name: 'app',
    // resgistro de los componentes
    components: {
      'column-select-component': ColumnSelectComponent,
      'custom-items-component': CustomItemsComponent,
      inputtext: InputText,
    },
    /**
     * Deveuele el objeto data que el componente utiliza
     * para almacenar sus información
     *
     * @return {Object}
     */
    data() {
      return {
        // TODO: Mejorar nombre de la variable
        isVisibleSetp1: true,
        // Listados de las columnas extraidas del GS SpreedSheet
        sheetColumns: [],
        // objeto que almacen las columnas para la ubicación
        // de las prendas, los valores iniciales de dichas
        // columnas es -1 para oblicar a los usuarios a seleccionar
        // una columna
        clothingInfo: {
          colClothing: '-1',
          colSize: '-1',
          colAmount: '-1',
        },
        // objeto Set
        set: {
          // Un identificador para el set
          id: Date.now(),
          // Columan que se usará para agrupar
          groupBy: '-1',
          // Columna que se usará como número correlativo
          correlativeNumber: '-1',
          // Arreglo de elementos personalizados que tendrá una
          //  estructura como la siguiente:
          // [{
          //    id: String,
          //    label: String,
          //    value: String,
          //    isRelateByColumn: Bool
          // }, ...]
          customItems: [],
        },
      }
    },
    /**
      * Evento que se emite cuando el component está montado
      */
    mounted() {
      // obtenemos los datos iniciales desde el servidor
      antuanStore.getGsSheetData().then((sheetColumns) => {
        this.sheetColumns = sheetColumns
      })
    },
    // Objeto que contiene todos las funciones a ejecutar por
    // el componente
    methods: {
      /**
       * TODO: Mejorar nombre
       */
      toggle() {
        this.isVisibleSetp1 = !this.isVisibleSetp1
      },
    },
    // Computed Values
    computed: {
      /**
       * Devuelve una cadena de texto que representa el modelo en forma
       * de JSON
       *
       * @return {String} Modelo en forma de JSON
       */
      dataAsJSON() {
        return JSON.stringify({
          sheetColumns: this.sheetColumns,
          clothingInfo: this.clothingInfo,
          set: this.set,
        })
      },
    },
  }
</script>

<style lang="scss">

  .code {
    display: block;
    background: #e2e0e4;
    font-size: 0.3rem;
    text-align: justify;
    pre {
      white-space: -moz-pre-wrap; /* Mozilla, supported since 1999 */
      white-space: -pre-wrap; /* Opera */
      white-space: -o-pre-wrap; /* Opera */
      white-space: pre-wrap; /* CSS3 - Text module (Candidate Recommendation) http://www.w3.org/TR/css3-text/#white-space */
      word-wrap: break-word; /* IE 5.5+ */
    }
  }


  .button-section {
    /*background-color: #00FFFF;*/
    position: absolute;
    bottom: 10px;
    width:90%;
    margin-left: 2%;
    margin-right: 2%;
    text-align: right;
    padding: 5px;
  }

  .row{
    margin-bottom: 0.5rem;
  }

  /*
  .step-1{
    display: none;
  }
  */
  .mandatory {
    color: #FF0000;
    margin-left: 2px;
  }

  .input-box{
    /* background-color: #FFFF00;*/
    overflow: auto;
    position: absolute;
    bottom: 50px;
    top: 70px;
    width: 90%;
    margin-left: 2%;
    margin-right: 2%;
    padding: 5px;
  }


  label {
    display: inline-block;
    width: 200px;
  }

  input {
    display: inline-block;
  }

  select {
    width: 130px;
  }

</style>
