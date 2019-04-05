

<template>
  <div>
    <h1>{{first}}</h1>

    <!-- <div v-for="field in structure.defect.fields" :key="field.name">
      <div v-if="field.type == 'number'">
        <span>{{field.name}} (number)</span>
        <span>{{first[field.name]}}</span>
        <span>-</span>
        <span>{{second[field.name]}}</span>
      </div>
      <div v-if="field.type == 'string'">
        <span>{{field.name}} (string)</span>
        <span>{{first[field.name]}}</span>
        <span>-</span>
        <span>{{second[field.name]}}</span>
      </div>
      <div v-if="field.type == 'ref'">
        <tree :type="field.generic" :value="first[field.name]"/>
      </div>
      <div v-if="field.type == 'array'">
        <div v-for="item in structure[field.generic].fields">{{item}}</div>
      </div>
    </div>-->

    <!-- <tree type="defect" :first="first" :second="second" depth="0"></tree> -->

    <br>
    <br>
    <br>
    <br>
    <br>
    <br>

    <div class="table">
      <template v-for="field in structure.defect.fields">
        <template v-if="field.type == 'number'">
          <span>{{field.name}} (number)</span>
          <span>{{first[field.name]}}</span>
          <span>{{second[field.name]}}</span>
          <span>-</span>
        </template>

        <template v-if="field.type == 'string'">
          <span>{{field.name}} (string)</span>
          <span>{{first[field.name]}}</span>
          <span>{{second[field.name]}}</span>
          <span>-</span>
        </template>

        <template v-if="field.type == 'ref'">
          <span>{{field.name}} (ref)</span>
          <div class="object">
            <tree :type="field.generic" :object="first[field.name]" :depth="0"></tree>
          </div>
          <div class="object">
            <tree :type="field.generic" :object="second[field.name]" :depth="0"></tree>
          </div>
          <!-- <span>{{first[field.name]}}</span> -->
          <!-- <span>{{second[field.name]}}</span> -->
          <span>-</span>
          <!-- <tree :type="field.generic" :value="first[field.name]"/> -->
        </template>

        <template v-if="field.type == 'array'">
          <span>{{field.name}} (array)</span>
          <div class="object-list">
            <div v-for="object in first[field.name]" class="object">
              <tree :type="field.generic" :object="object" :depth="0"></tree>
            </div>
          </div>
          <div class="object-list">
            <div v-for="object in second[field.name]" class="object">
              <tree :type="field.generic" :object="object" :depth="0"></tree>
            </div>
          </div>
          <!-- <span>{{first[field.name]}}</span> -->
          <!-- <span>{{second[field.name]}}</span> -->
          <span>-</span>
          <!-- <div v-for="item in structure[field.generic].fields">{{item}}</div> -->
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import first from "./first";
import second from "./second";
import structure from "./structure.json";

import Tree from "./Tree";

export default {
  components: {
    Tree
  },
  data() {
    return {
      kek: first,
      pek: "asdas",
      first,
      second,
      structure
    };
  },
  mounted() {}
};
</script>

<style>
.table {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-column-gap: 20px;
  grid-row-gap: 20px;

  background-color: coral;
  padding: 10px;
}

.object {
  background-color: #cccccc;
  padding: 5px;
  border-radius: 5px;
}

.object-list :not(:last-child) {
  margin-bottom: 5px;
}
</style>
