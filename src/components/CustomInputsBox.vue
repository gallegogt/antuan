<template lang="pug">

div

  custominputselect(v-for='input in customSelectInputs'
    v-bind:labelname='input.labelname'
    v-bind:labelplaceholder='input.labelplaceholder'
    v-bind:name='input.name' v-bind:key='input.id'
    v-on:removeSelect='removeSelect'
    )
  custominputtext(v-for='input in customTextInputs'
    v-bind:labelname='input.labelname'
    v-bind:labelplaceholder='input.labelplaceholder'
    v-bind:name='input.name'
    v-bind:placeholder='input.placeholder'
    v-bind:key='input.id'
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
      addTextInput(section) {
        this.counter = this.counter + 1
        this.customTextInputs.push(
          {
            labelname: `labelname-${section}-${this.counter}`,
            labelplaceholder: `labelplaceholder-${section}-${this.counter}`,
            name: `name-${section}-${this.counter}`,
            placeholder: `placeholder-${section}-${this.counter}`,
            id: `${section}-${this.counter}`,
          },
        )
      },
      addSelectInput(section) {
        this.counter = this.counter + 1
        this.customSelectInputs.push(
          {
            labelname: `labelname-${section}-${this.counter}`,
            labelplaceholder: `labelplaceholder-${section}-${this.counter}`,
            name: `name-${section}-${this.counter}`,
            id: `${section}-${this.counter}`,
          },
        )
      },
      removeSelect(element) {
        this.customSelectInputs
          .splice(
              this.customSelectInputs.indexOf(element), 1)
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
