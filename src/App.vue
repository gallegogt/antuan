<template lang="pug">
#app
  form#dataform
    h3.step-1(v-show='isVisibleSetp1') 1 Identifica las prendas
    h3.step-2(v-show='!isVisibleSetp1') 2 Seleccionemos los ítems de encabezado
    hr

    .input-box.step-1(v-show='isVisibleSetp1')
      p
        b Selecciona las columnas en las que se ubican las prendas, la talla y la cantidad:

      inputselect(name='prenda_col' labeltext='Prendas')
      inputselect(name='talla_col' labeltext='Talla')
      inputselect(name='cantidad_col' labeltext='Cantidad')


    .input-box.step-2(v-show='!isVisibleSetp1')
      p
        b Define ítems incluidos en el set

      .row
        label(for='notContainsSet') No contiene sets
        input#no-set(name='notContainsSet' type='checkbox')

      .set-info
        inputselect(name='agruparpor_col' labeltext='Agrupar por')
        inputselect(name='correlativo_col' labeltext='Nº Correlativo')

      aditionalsetinputs

      p
        b Define ítems incluidos en el set

      inputtext(name="setporcaja" value="1" labeltext="Cantidad de set por caja" placeholder="")
      inputtext(name="proveedor" value="Antuan Juri S.A." labeltext="Proveedor" placeholder="")
      inputtext(name="destinatario" value="" labeltext="Destinario" placeholder="")
      inputtext(name="orden_compra" value="" labeltext="Orden de Compra" placeholder="")

      aditionalsetinputs

  .button-section
    button.step-1.siguiente(v-show='isVisibleSetp1' @click='toggle') Siguiente >>
    button.step-2.atras(v-show='!isVisibleSetp1' @click='toggle') << Atrás
    button.step-2.generar Generar

</template>

<script>

// import CustomInputSelect from './components/CustomInputSelect'
// import CustomInputText from './components/CustomInputText'
import InputSelect from './components/InputSelect'
import InputText from './components/InputText'

import AditionalSetInputs from './components/AditionalSetInputs'

export default {
  name: 'app',
  components: {
    inputselect: InputSelect,
    inputtext: InputText,
    aditionalsetinputs: AditionalSetInputs,
  },
  data() {
    return {
      isVisibleSetp1: true,
    }
  },
  methods: {
    toggle() {
      this.isVisibleSetp1 = !this.isVisibleSetp1
    },
  },
}


</script>


<style lang="scss">


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
  .mandatory{
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


  label{
    display: inline-block;
    width: 200px;
  }

  input{
    display: inline-block;
  }

  select{
    width: 130px;
  }




</style>
