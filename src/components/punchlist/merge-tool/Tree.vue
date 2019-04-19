<template>
  <div :style="indent">
    <div v-if="structure[type].stringValue">
      {{ object[structure[type].stringValue] }}
    </div>
    <div v-else>
      <template v-for="field in filteredFields">
        <div v-if="field.type == 'number'">
          <span :key="field.name">{{ field.name }}</span>
          <span class="separator">:</span>
          <span>{{ object[field.name] }}</span>
        </div>

        <div v-if="field.type == 'string'">
          <span>{{ field.name }}</span>
          <span class="separator">:</span>
          <span>{{ object[field.name] }}</span>
        </div>

        <template v-if="field.type == 'ref'">
          <span>{{ field.name }}</span>
          <tree
            v-if="object[field.name]"
            :type="field.generic"
            :object="object[field.name]"
            :depth="depth + 1"
          />
          <span v-else>: null</span>
        </template>
      </template>
    </div>
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

    filteredFields() {
      return this.structure[this.type].fields.filter(field => !field.hide)
    },

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
