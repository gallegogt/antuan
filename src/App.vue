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
        div
          column-select-component(
            :value.sync = "clothingInfo.colClothing"
            label = "Prenda"
            :sheet-columns = "sheetColumns"
            v-validate="'required|not_in:-1'"
            data-vv-scope="scope-step-1"
            data-vv-value-path="value"
            data-vv-name="clothing"
            :has-error="errors.has('scope-step-1.clothing')"
          )
          span(v-show="errors.has('scope-step-1.clothing')" class="help is-danger")
            | {{ errors.first('scope-step-1.clothing') }}
        div
          column-select-component(
            :value.sync = "clothingInfo.colSize"
            label = "Talla"
            :sheet-columns = "sheetColumns"
            v-validate="'required|not_in:-1'"
            data-vv-scope="scope-step-1"
            data-vv-value-path="value"
            data-vv-name="size"
            :has-error="errors.has('scope-step-1.size')"
          )
          span(v-show="errors.has('scope-step-1.size')" class="help is-danger")
              | {{ errors.first('scope-step-1.size') }}

        div
          column-select-component(
            :value.sync = "clothingInfo.colAmount"
            label = "Cantidad"
            :sheet-columns = "sheetColumns"
            v-validate="'required|not_in:-1'"
            data-vv-scope="scope-step-1"
            data-vv-value-path="value"
            data-vv-name="amount"
            :has-error="errors.has('scope-step-1.amount')"
          )
          span(v-show="errors.has('scope-step-1.amount')" class="help is-danger")
              | {{ errors.first('scope-step-1.amount') }}

      .input-box.step-2(v-show='!isVisibleSetp1' data-vv-scope="scope-step-2")
        p
          b Define ítems incluidos en el Set
        .row
          label(for='notContainsSet')
            | No contiene sets
          input#no-set(name='notContainsSet' type='checkbox' v-model="set.notContainsSet")

        .set-info
          div
            column-select-component(
              :value.sync = "set.groupBy"
              label = "Agrupar por"
              :sheet-columns = "sheetColumns"
              v-validate="'required|not_in:-1'"
              data-vv-scope="scope-step-2"
              data-vv-value-path="value"
              data-vv-name="gropuBy"
              :has-error="errors.has('scope-step-2.gropuBy')"
            )
            span(v-show="errors.has('scope-step-2.gropuBy')" class="help is-danger")
              | {{ errors.first('scope-step-2.gropuBy') }}

          div
            column-select-component(
              :value.sync = "set.correlativeNumber"
              label = "Nº Correlativo"
              :sheet-columns = "sheetColumns"
              v-validate="'required|not_in:-1'"
              data-vv-scope="scope-step-2"
              data-vv-value-path="value"
              data-vv-name="correlativeNumber"
              :has-error="errors.has('scope-step-2.correlativeNumber')"
            )
            span(v-show="errors.has('scope-step-2.correlativeNumber')" class="help is-danger")
              | {{ errors.first('scope-step-2.correlativeNumber') }}

        custom-items-component(
          :items.sync="set.customItems"
          :sheet-columns="sheetColumns"
        )

        p
          b Define ítems incluidos en el Box

        div
          input-text-component(
            :value.sync="box.setsAmount"
            label-text="Cantidad de set por caja"
            placeholder="1"
            v-validate="'required|min_value:1'"
            data-vv-scope="scope-step-2"
            data-vv-value-path="value"
            data-vv-name="boxSetsAmount"
          )
          span(v-show="errors.has('scope-step-2.boxSetsAmount')" class="help is-danger")
            | {{ errors.first('scope-step-2.boxSetsAmount') }}

        div
          input-text-component(
            :value.sync="box.provider"
            label-text="Proveedor"
            placeholder="Antuan Juri S.A."
            v-validate="'required'"
            data-vv-scope="scope-step-2"
            data-vv-value-path="value"
            data-vv-name="boxProvider"
          )
          span(v-show="errors.has('scope-step-2.boxProvider')" class="help is-danger")
            | {{ errors.first('scope-step-2.boxProvider') }}

        input-text-component(
          :value.sync="box.receiver"
          label-text="Destinario"
          placeholder="Destinario"
          v-validate="'required'"
          data-vv-scope="scope-step-2"
          data-vv-value-path="value"
          data-vv-name="boxReceiver"
        )
        span(v-show="errors.has('scope-step-2.boxReceiver')" class="help is-danger")
          | {{ errors.first('scope-step-2.boxReceiver') }}

        input-text-component(
          :value.sync="box.purchaseOrder"
          label-text="Orden de Compra"
          placeholder="Orden de Compra"
          v-validate="'required'"
          data-vv-scope="scope-step-2"
          data-vv-value-path="value"
          data-vv-name="boxPurchaseOrder"
        )
        span(v-show="errors.has('scope-step-2.boxPurchaseOrder')" class="help is-danger")
          | {{ errors.first('scope-step-2.boxPurchaseOrder') }}


        custom-items-component(
          :items.sync="box.customItems"
          :sheet-columns="sheetColumns"
        )

    .button-section
      button.step-1.siguiente(v-show="isVisibleSetp1" @click="validateData('scope-step-1')")
        | Siguiente >>
      button.step-2.atras(v-show="!isVisibleSetp1" @click="validateData('scope-step-2')")
        | << Atrás
      button.step-2.generar(@click="generate")
        | Generar
</template>

<script>
  import spanish from 'vee-validate/dist/locale/es' // eslint-disable-line
  import ColumnSelectComponent from './components/ColumnSelectComponent'
  import CustomItemsComponent from './components/CustomItemsComponent'
  import InputTextComponent from './components/InputTextComponent'
  import Antuan from './utils/antuan'

  const antuanStore = new Antuan()

  /**
   * Componente Principal
   */
  export default {
    name: 'app',
    // resgistro de los componentes
    components: {
      ColumnSelectComponent,
      CustomItemsComponent,
      InputTextComponent,
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
          // no se requiere set
          notContainsSet: false,
        },
        box: {
          // Un identificador para el set
          id: Date.now(),
          // Cantidad de Sets por caja
          setsAmount: 1,
          // Proveedor
          provider: '',
          // Destinatario
          receiver: '',
          // Orden de compra
          purchaseOrder: '',
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
      validateData(scope) {
        this.$validator.validateAll(scope)
          .then(() => {
            this.isVisibleSetp1 = !this.isVisibleSetp1
          })
          .catch(() => {
            // TODO: Existe error en el dato
          })
      },
      /**
       * Función para generar los carteles
       */
      generate() {
        this.$validator.validateAll('scope-step-2')
          .then(() => {
            // TODO: Modificar cuando se tengas los objetos reales
            Antuan.generatePosters(this.info)
              .then((info) => console.log(info)) // eslint-disable-line
          })
          .catch(() => {
            // TODO: Existe error en el dato
          })
      },
    },
    // Computed Values
    computed: {
      /**
       * Información para poder generar los carteles
       *
       * @return {Object} Objeto con la información requerida
       *                para generar los carteles
       */
      info() {
        return {
          clothingInfo: this.clothingInfo,
          set: this.set,
          box: this.box,
        }
      },
    },
    /**
     * Actualiza los locales para los mensajes de validación de
     * la applicación
     */
    created() {
      this.$validator.updateDictionary({
        es: {
          messages: spanish.messages,
          attributes: {
            clothing: 'Prenda',
            size: 'Talla',
            amount: 'Cantidad',
            gropuBy: 'Agrupar por',
            correlativeNumber: 'Nº Correlativo',
            boxSetsAmount: 'Cantidad set por cajas',
            boxProvider: 'Proveedor',
            boxReceiver: 'Destinatario',
            boxPurchaseOrder: 'Orden de Compra',
          },
        },
      })
      this.$validator.setLocale('es')
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
