<template>
  <div class="editable-text">

    <template v-if="! editing">
      <span class="label" @dblclick="onEdit">{{tempText}}</span>
      <font-awesome-icon v-on:click="onEdit" class="et-button" icon="pen" />
    </template>


    <template v-if="editing">
      <input ref="textfield" @keypress="onKeyPress" v-model="tempText" id="input" type="text" />
      <font-awesome-icon class="btn-save" v-on:click="onSave" icon="check" />
      <font-awesome-icon class="btn-close" v-on:click="onClose" icon="times" />
    </template>


  </div>

</template>

<script>


export default {
    name: 'EditableText',
    props: {
      value: String
    },
    data() {
      return {
        editing: false,
        tempText: ""
      }
    },
    methods: {
      onKeyPress(e){
        if(e.keyCode === 13){
          this.onSave();
        }
      },
      onEdit(){
        this.editing = true;
        this.$refs.textfield.$el.focus();
      },
      onSave(){
        this.editing = false;
        this.$emit('input', this.tempText);
      },
      onClose(){
        this.editing = false;
        this.tempText = this.value;
      }
    },
    mounted() {
      this.tempText = this.value;
    }
}
</script>

<style scoped>

  .editable-text > .et-button{
    display: none;
  }

  .editable-text:hover > .et-button{
    display: inline;
    cursor: pointer;
  }

  .btn-close{
    margin-left: 5px;
    cursor: pointer;
  }

  .btn-save{
    margin-left: -40px;
    cursor: pointer;
  }

  #input{
    width: 100%;
    padding: 2px 40px 2px 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

</style>
