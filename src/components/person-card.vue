<template>
  <div class="card">
    <h1>{{ pers.name }}</h1>
    <h2>age: {{ pers.age}}</h2>
  </div>
</template>

<script>
export default {
  name: 'PersonCard',
  props: {
    pers: {"id":0, "name":"", "age": 0}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.card {
  background: #fff;
  border-radius: 2px;
  display: inline-block;
  margin: 1rem;
  position: relative;
  width: 300px;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
}

</style>
