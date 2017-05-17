<template lang="pug">
  .main-component.ui.segment
    .step-header
      h3.step-1(v-show='isVisibleSetp1')
        | 1 Identifica las prendas
      h3.step-2(v-show='!isVisibleSetp1')
        | 2 Seleccionemos los ítems de encabezado
      hr
    .step-container
      .input-box.step-1(v-show='isVisibleSetp1')
        section
          .header
            h3
              | Selecciona las columnas en las que se ubican las prendas, la talla y la cantidad:
          .container
            div(:class="{'active-error': errors.has('scope-step-1.clothing')}")
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
              span(class="help error")
                | {{ errors.first('scope-step-1.clothing') }}
            div(:class="{'active-error': errors.has('scope-step-1.size')}")
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
              span(class="help error")
                  | {{ errors.first('scope-step-1.size') }}

            div(:class="{'active-error': errors.has('scope-step-1.amount')}")
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
              span(class="help error")
                  | {{ errors.first('scope-step-1.amount') }}

      .input-box.step-2(v-show='!isVisibleSetp1' data-vv-scope="scope-step-2")
        section
          .header
            h3
              | Define ítems incluidos en el Set
            div
              label(for='notContainsSet')
                | No contiene Sets
              input#no-set(name='notContainsSet' type='checkbox' v-model="set.notContainsSet")
          .container(v-if="!set.notContainsSet")
            div(:class="{'active-error': errors.has('scope-step-2.gropuBy')}")
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
              span(class="help error")
                | {{ errors.first('scope-step-2.gropuBy') }}

            div(:class="{'active-error': errors.has('scope-step-2.correlativeNumber')}")
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
              span(class="help error")
                | {{ errors.first('scope-step-2.correlativeNumber') }}

            custom-items-component(
              :items.sync="set.customItems"
              :sheet-columns="sheetColumns"
            )
        section
          .header
            h3
              | Define ítems incluidos en el Box
          .container
            div(
              v-if="!set.notContainsSet"
              :class="{'active-error': errors.has('scope-step-2.boxSetsAmount')}")
              input-text-component(
                :value.sync="box.setsAmount"
                label-text="Cantidad de Sets por caja"
                placeholder="1"
                v-validate="'required|min_value:1'"
                data-vv-scope="scope-step-2"
                data-vv-value-path="value"
                data-vv-name="boxSetsAmount"
              )
              span(class="help error")
                | {{ errors.first('scope-step-2.boxSetsAmount') }}

            div(:class="{'active-error': errors.has('scope-step-2.boxProvider')}")
              input-text-component(
                :value.sync="box.provider"
                label-text="Proveedor"
                placeholder="Antuan Juri S.A."
                v-validate="'required'"
                data-vv-scope="scope-step-2"
                data-vv-value-path="value"
                data-vv-name="boxProvider"
              )
              span(class="help error")
                | {{ errors.first('scope-step-2.boxProvider') }}

            div(:class="{'active-error': errors.has('scope-step-2.boxReceiver')}")
              input-text-component(
                :value.sync="box.receiver"
                label-text="Destinario"
                placeholder="Destinario"
                v-validate="'required'"
                data-vv-scope="scope-step-2"
                data-vv-value-path="value"
                data-vv-name="boxReceiver"
              )
              span(class="help error")
                | {{ errors.first('scope-step-2.boxReceiver') }}

            div(:class="{'active-error': errors.has('scope-step-2.boxPurchaseOrder')}")
              input-text-component(
                :value.sync="box.purchaseOrder"
                label-text="Orden de Compra"
                placeholder="Orden de Compra"
                v-validate="'required'"
                data-vv-scope="scope-step-2"
                data-vv-value-path="value"
                data-vv-name="boxPurchaseOrder"
              )
              span(v-show="errors.has('scope-step-2.boxPurchaseOrder')" class="help error")
                | {{ errors.first('scope-step-2.boxPurchaseOrder') }}

            custom-items-component(
              :items.sync="box.customItems"
              :sheet-columns="sheetColumns"
            )

    .step-footer
        button.step-1(v-show="isVisibleSetp1" @click="validateData('scope-step-1')")
          | Siguiente >>
        button.step-2(v-show="!isVisibleSetp1" @click="validateData('scope-step-2')")
          | << Atrás
        button.step-2.create(@click="generate" :disabled="isVisibleSetp1 || errors.any()")
          | Generar
    div(:class="['ui', {active: isLoading}, 'dimmer']")
      .ui.loader
  //
    .code
      pre
        | {{ getAsJSON }}
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
        // propiedad para indicar si se esta cargando los datos
        isLoading: false,
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
        // se muestra el loader
        this.isLoading = true
        this.$validator.validateAll('scope-step-2')
          .then(() => {
            Antuan.generatePosters(this.info)
              .then(() => {
                this.isLoading = false
                // TODO: cerrar el cuadro de diálogo
                google.script.host.close()
              })
              .catch(() => {
                // TODO: Mostrar Dialogo con la descripcion
                // del error
                this.isLoading = false
              })
          })
          .catch(() => {
            this.isLoading = false
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
      getAsJSON() {
        return JSON.stringify(this.info)
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
  .main-component {
    padding: 1rem;
    /*
    .step-header {

    }
    */
    .step-container {
      section {
        margin-top: 2rem;

        .header > div {
          margin-left: 1rem;

          > label {
            margin-right: 4.5rem;
            font-weight: bold;
            font-size: 0.91rem;
          }
          > input {
            width: 1rem;
            height: 1rem;
            text-align: center;
          }
        }

        .container {
          margin-left: 1rem;

          > div {
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
          }
        }
      }
    }

    .step-footer {
      text-align: right;
      padding: 5px;
    }
  }

  .inline-group {
      display: table;
      width: 25rem;

      > label,
      > input,
      > select {
        display: table-cell
      }
      > label {
        width: 12rem;
      }
    }

  .active-error {
    > .error {
      display: block;
      margin-left: 1rem;
      padding-top: 0.5rem;
    }

    input,
    select {
      border-style: solid;
      border-color: #dd4b4c;
    }
  }
  .error {
    display: none;
  }

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
</style>
