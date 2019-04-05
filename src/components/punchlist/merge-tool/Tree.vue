<template>
  <div :style="indent">
    <template v-for="field in structure[type].fields">
      <div v-if="field.type == 'number'">
        <span :key="field.name">{{field.name}}</span>
        <span class="separator">:</span>
        <span>{{object[field.name]}}</span>
      </div>

      <div v-if="field.type == 'string'">
        <span>{{field.name}}</span>
        <span class="separator">:</span>
        <span>{{object[field.name]}}</span>
      </div>

      <template v-if="field.type == 'ref'">
        <div>{{field.name}}</div>
        <tree :type="field.generic" :object="object[field.name]" :depth="depth + 1"/>
      </template>

      <!-- <template v-if="field.type == 'array'">
        <div>{{field.name}}</div>
        <div>
          <div v-for="(item, i) in first[field.name]">
            {{i}}
            <tree :type="field.generic" :first="item" :depth="depth + 1"/>
          </div>
        </div>
        <div>
          <div v-for="(item, i) in second[field.name]">
            {{i}}
            <tree :type="field.generic" :second="item" :depth="depth + 1"/>
          </div>
        </div>
      </template>-->
    </template>

    <!-- <button @click="ss">sada</button> -->
    <!-- <tree v-if="value != ''" :value="val"></tree> -->
  </div>
</template>

<script>
import structure from "./structure.json";

export default {
  name: "tree",
  props: ["type", "object", "depth"],
  data() {
    return {
      structure,
      kek: "sdasd"
    };
  },
  computed: {
    val() {
      let kek = this.value;
      return kek.substring(0, kek.length - 1);
    },

    indent() {
      return { marginLeft: `${this.depth * 20}px` };
    }
  },
  methods: {
    ss() {
      this.value.name = "sdasdve";
    }
  }
};
</script>

<style>
.separator {
  margin-right: 5px;
}
</style>
