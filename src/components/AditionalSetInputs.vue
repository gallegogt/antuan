<template lang="pug">

div
  custominputselect( v-for='input in customSelectInputs' v-bind:labelname='input.labelname' v-bind:labelplaceholder='input.labelplaceholder' v-bind:name='input.name' v-bind:key='input.id' )

  custominputtext( v-for='input in customTextInputs' v-bind:labelname='input.labelname' v-bind:labelplaceholder='input.labelplaceholder' v-bind:name='input.name' v-bind:placeholder='input.placeholder' v-bind:key='input.id' )

  .row
    .newfieldlink
      a(@click='addSelectInput(0)') + ítems desde columna
      a(@click='addTextInput(0)') + ítems personalizado

</template>

<script>

  import CustomInputSelect from './CustomInputSelect'
  import CustomInputText from './CustomInputText'

  export default{
    name: 'aditionalInputBox',
    components: {
      custominputselect: CustomInputSelect,
      custominputtext: CustomInputText,
    },
    data() {
      return {
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
      showAlert() {
        // alert(`hola desde ${this.textContent}`)
      },
      addTextInput(counter) {
        this.customTextInputs.push(
          {
            labelname: `labelname-${counter}`,
            labelplaceholder: `labelplaceholder-${counter}`,
            name: `name-${counter}`,
            placeholder: `placeholder-${counter}`,
            id: counter,
          },
        )
      },
      addSelectInput(counter) {
        this.customSelectInputs.push(
          {
            labelname: `labelname-${counter}`,
            labelplaceholder: `labelplaceholder-${counter}`,
            name: `name-${counter}`,
            id: counter,
          },
        )
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
