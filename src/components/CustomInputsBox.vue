<template lang="pug">

div

  custominputselect(v-for='input in customSelectInputs'
    v-bind:labelplaceholder='input.labelplaceholder'
    v-bind:labelvalue.sync='input.labelvalue'
    v-bind:value.sync='input.value'
    v-bind:key='input.id'
    v-on:removeSelect='removeSelect(input)'
    )
  custominputtext(v-for='input in customTextInputs'
    v-bind:labelplaceholder='input.labelplaceholder'
    v-bind:labelvalue.sync='input.labelvalue'
    v-bind:placeholder='input.placeholder'
    v-bind:value.sync='input.value'
    v-bind:key='input.id'
    v-on:removeText='removeText(input)'
    )



  .row
    .newfieldlink
      a(v-if="isSet" @click='addSelectInput("set")') + ítems desde columna
      a(v-if="isSet" @click='addTextInput("set")') + ítems personalizado

      a(v-if="!isSet" @click='addSelectInput("box")') + ítems desde columna
      a(v-if="!isSet" @click='addTextInput("box")') + ítems personalizado



</template>

<script>

  import CustomInputSelect from './CustomInputSelect'
  import CustomInputText from './CustomInputText'

  export default{
    name: 'aditionalInputBox',
    props: { isSet: String },
    components: {
      custominputselect: CustomInputSelect,
      custominputtext: CustomInputText,
    },
    data() {
      return {
        counter: 0,
        customTextInputs: [
        /*
          {
            labelname:'label-0',
            labelplaceholder:'label-0',
            name:'name-0',
            placeholder:'name-0',
            id:'0'
          }
        */
        ],
        customSelectInputs: [],
      }
    },
    methods: {
      addTextInput() {
        this.customTextInputs.push(
          {
            labelplaceholder: 'Título ítem',
            labelvalue: '',
            placeholder: 'Valor ítem',
            value: '',
            id: Date.now(),
          },
        )
      },
      addSelectInput() {
        this.customSelectInputs.push(
          {
            labelplaceholder: 'Título ítem',
            labelvalue: '',
            value: '',
            id: Date.now(),
          },
        )
      },
      removeSelect(element) {
        console.log('removeSelect: ', element)
        this.customSelectInputs
          .splice(
              this.customSelectInputs.indexOf(element), 1)
      },
      removeText(element) {
        console.log('removeText: ', element)
        this.customTextInputs
          .splice(
              this.customTextInputs.indexOf(element), 1)
      },
    },
  }

</script>
<style lang="scss" scoped>

.newfieldlink{
  text-align: right;
}

.newfieldlink a{
  margin-right: 1rem;
  display: inline-block;
}

</style>
