

<template>
  <div class="root">
    <div class="my-table custom-panel">
      <div :style="placeRow(1)">
        <h5>Conflict during save new Defect</h5>
        <h6>Last update 12.03.2019 by Ivanov I.K.</h6>
      </div>
      <div class="roww" :style="placeRow(2)"></div>
      <div :style="placeCell(2, 1)"><span>Attribute</span></div>
      <div :style="placeCell(2, 2)"><span>Your value</span></div>
      <div :style="placeCell(2, 3)"><span>Remote value</span></div>
      <div :style="placeCell(2, 4)"><span>Result value</span></div>

      <template v-for="(field, i) in filteredFields">
        <!-- NUMBER -->

        <template v-if="field.type == 'number'">
          <div class="roww" :style="placeRow(i + 3, field)"></div>
          <div :style="placeCell(i + 3, 1)">
            <span>{{ field.name }}</span>
          </div>
          <div :style="placeCell(i + 3, 2)">
            <div
              class="textbox"
              :class="{
                selected:
                  meta[field.name].selected == 1 && meta[field.name].mutated
              }"
              @click="select(field, 1)"
            >
              <span>{{ first[field.name] }}</span>
            </div>
          </div>

          <div :style="placeCell(i + 3, 3)">
            <div
              class="textbox"
              :class="{
                selected:
                  meta[field.name].selected == 2 && meta[field.name].mutated
              }"
              @click="select(field, 2)"
            >
              <span>{{ second[field.name] }}</span>
            </div>
          </div>

          <div
            class="textbox"
            :class="{
              selected:
                meta[field.name].selected == 3 && meta[field.name].mutated
            }"
            :style="placeCell(i + 3, 4)"
          >
            <input
              v-if="meta[field.name].mutated"
              type="text"
              v-model="third[field.name]"
              @keydown="select(field, 3)"
            />
            <span v-else>{{ third[field.name] }}</span>
          </div>
        </template>

        <!-- STRING -->

        <template v-if="field.type == 'string'">
          <div class="roww" :style="placeRow(i + 3, field)"></div>
          <div :style="placeCell(i + 3, 1)">
            <span>{{ field.name }}</span>
          </div>
          <div :style="placeCell(i + 3, 2)">
            <div
              class="textbox"
              :class="{
                selected:
                  meta[field.name].selected == 1 && meta[field.name].mutated
              }"
              @click="select(field, 1)"
            >
              <span>{{ first[field.name] }}</span>
            </div>
          </div>

          <div :style="placeCell(i + 3, 3)">
            <div
              class="textbox"
              :class="{
                selected:
                  meta[field.name].selected == 2 && meta[field.name].mutated
              }"
              @click="select(field, 2)"
            >
              <span>{{ second[field.name] }}</span>
            </div>
          </div>

          <div :style="placeCell(i + 3, 4)">
            <div
              class="textbox"
              :class="{
                selected:
                  meta[field.name].selected == 3 && meta[field.name].mutated
              }"
            >
              <input
                v-if="meta[field.name].mutated"
                type="text"
                v-model="third[field.name]"
                @keydown="select(field, 3)"
              />
              <span v-else>{{ third[field.name] }}</span>
            </div>
          </div>
        </template>

        <!-- TIMESTAMP -->

        <template v-if="field.type == 'timestamp'">
          <div class="roww" :style="placeRow(i + 3, field)"></div>

          <!-- TIMESTAMP 1 -->

          <div :style="placeCell(i + 3, 1)">
            <span>{{ field.name }}</span>
          </div>

          <!-- TIMESTAMP 2 -->

          <div :style="placeCell(i + 3, 2)">
            <div
              class="textbox"
              :class="{
                selected:
                  meta[field.name].selected == 1 && meta[field.name].mutated
              }"
              @click="select(field, 1)"
            >
              <span>{{ first[field.name] | timestampToString }}</span>
            </div>
          </div>

          <!-- TIMESTAMP 3 -->

          <div :style="placeCell(i + 3, 3)">
            <div
              class="textbox"
              :class="{
                selected:
                  meta[field.name].selected == 2 && meta[field.name].mutated
              }"
              @click="select(field, 2)"
            >
              <span>{{ second[field.name] | timestampToString }}</span>
            </div>
          </div>

          <!-- TIMESTAMP 4 -->

          <div :style="placeCell(i + 3, 4)">
            <div
              class="textbox"
              :class="{
                selected:
                  meta[field.name].selected == 3 && meta[field.name].mutated
              }"
            >
              <input
                v-if="meta[field.name].mutated"
                type="text"
                v-model="third[field.name]"
                @keydown="select(field, 3)"
              />
              <span v-else>{{ third[field.name] | timestampToString }}</span>
            </div>
          </div>
        </template>

        <!-- REFERENCE -->

        <template v-if="field.type == 'ref'">
          <div class="roww" :style="placeRow(i + 3, field)"></div>

          <!-- REFERENCE 1 -->

          <div :style="placeCell(i + 3, 1)">
            <span>{{ field.name }}</span>
          </div>

          <!-- REFERENCE 2 -->

          <div :style="placeCell(i + 3, 2)">
            <div
              :class="{
                object: meta[field.name].mutated,
                selected:
                  meta[field.name].selected == 1 && meta[field.name].mutated,
                available:
                  meta[field.name].selected != 1 && meta[field.name].mutated
              }"
              @click="select(field, 1)"
            >
              <tree
                :type="field.generic"
                :object="first[field.name]"
                :depth="0"
              ></tree>
            </div>
          </div>

          <!-- REFERENCE 3 -->

          <div :style="placeCell(i + 3, 3)">
            <div
              :class="{
                object: meta[field.name].mutated,
                selected:
                  meta[field.name].selected == 2 && meta[field.name].mutated,
                available:
                  meta[field.name].selected != 2 && meta[field.name].mutated
              }"
              @click="select(field, 2)"
            >
              <tree
                :type="field.generic"
                :object="second[field.name]"
                :depth="0"
              ></tree>
            </div>
          </div>

          <!-- REFERENCE 4 -->

          <div :style="placeCell(i + 3, 4)">
            <div
              v-if="field.editable"
              :class="{
                object: meta[field.name].mutated,
                selected:
                  meta[field.name].selected == 3 && meta[field.name].mutated
              }"
              class="textbox"
            >
              <!-- todo:hardcode -->
              <select @change="select(field, 3)">
                <option value="1">A1</option>
                <option value="2">B1</option>
                <option value="3">C1</option>
              </select>
            </div>
            <div
              v-else
              :class="{
                object: meta[field.name].mutated,
                selected: meta[field.name].selected == 3
              }"
            >
              <tree
                :type="field.generic"
                :object="third[field.name]"
                :depth="0"
              ></tree>
            </div>
          </div>
        </template>

        <!-- ARRAY -->

        <template v-if="field.type == 'array'">
          <div class="roww" :style="placeRow(i + 3, field)"></div>
          <div :style="placeCell(i + 3, 1)">
            <span>{{ field.name }}</span>
          </div>
          <div :style="placeCell(i + 3, 2)">
            <div class="object-list">
              <div
                v-for="object in first[field.name]"
                class="object"
                @click="selectArrayItem(field, object.id, 1)"
                :class="{
                  selected: meta[field.name].selectedIds.includes(object.id),
                  available:
                    !meta[field.name].selectedIds.includes(object.id) &&
                    !meta[field.name].unchangedIds.includes(object.id)
                }"
              >
                <tree :type="field.generic" :object="object" :depth="0"></tree>
              </div>
            </div>
          </div>
          <div :style="placeCell(i + 3, 3)">
            <div class="object-list">
              <div
                v-for="object in second[field.name]"
                class="object"
                @click="selectArrayItem(field, object.id, 2)"
                :class="{
                  selected: meta[field.name].selectedIds.includes(object.id),
                  available:
                    !meta[field.name].selectedIds.includes(object.id) &&
                    !meta[field.name].unchangedIds.includes(object.id)
                }"
              >
                <tree :type="field.generic" :object="object" :depth="0"></tree>
              </div>
            </div>
          </div>
          <div :style="placeCell(i + 3, 4)">
            <div class="object-list">
              <div
                v-for="object in third[field.name]"
                class="object"
                :class="{
                  selected: meta[field.name].selectedIds.includes(object.id),
                  available:
                    !meta[field.name].selectedIds.includes(object.id) &&
                    !meta[field.name].unchangedIds.includes(object.id)
                }"
              >
                <tree :type="field.generic" :object="object" :depth="0"></tree>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import first from "./first";
import second from "./second";
import structure from "./structure.json";

import { timestampToString } from '../../../utils/formatters'

import Tree from "./Tree";

let third = {}
let meta = {}
for (let field of structure.defect.fields) {

  let firstIndexes = field.type == 'array'
    ? first[field.name].map(el => el.id)
    : [];

  let secondIndexes = field.type == 'array'
    ? second[field.name].map(el => el.id)
    : [];

  let union = firstIndexes.filter(function (n) {
    return secondIndexes.indexOf(n) > -1;
  });

  let selected = firstIndexes.filter(function (n) {
    return secondIndexes.indexOf(n) == -1;
  });

  meta[field.name] = {
    mutated: JSON.stringify(first[field.name]) != JSON.stringify(second[field.name]),
    selected: 1,
    unchangedIds: union,
    selectedIds: selected
  }
}

third = JSON.parse(JSON.stringify(first))

let objects = [first, second, third]

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
      third,
      objects,
      structure,
      meta
    };
  },
  filters: { timestampToString },
  methods: {

    select(field, objectIndex) {
      console.log(this.objects[objectIndex - 1])
      this.meta[field.name].selected = objectIndex
      this.third[field.name] = this.objects[objectIndex - 1][field.name];

    },

    selectArrayItem(field, id, objectIndex) {

      if (this.meta[field.name].unchangedIds.includes(id)) {
        return;
      }

      if (this.meta[field.name].selectedIds.includes(id)) {
        this.meta[field.name].selectedIds = this.meta[field.name].selectedIds.filter(el => el != id)
        this.third[field.name] = this.third[field.name].filter(el => el.id != id)
      } else {
        this.meta[field.name].selectedIds.push(id)
        this.third[field.name].push(this.objects[objectIndex - 1][field.name].filter(el => el.id == id)[0])
      }
    },

    placeRow(row, field) {
      return {
        gridRowStart: row,
        gridRowEnd: row + 1,
        gridColumnStart: 1,
        gridColumnEnd: 5
      }
    },

    placeCell(row, col) {
      return {
        gridRowStart: row,
        gridRowEnd: row + 1,
        gridColumnStart: col,
        gridColumnEnd: col + 1
      }
    }
  },
  computed: {
    filteredFields() {
      return structure.defect.fields.filter(field => !field.hide)
    }
  },
  mounted() { }
};
</script>

<style scoped>
.root {
  padding: 10px;
}

.my-table {
  display: grid;
  grid-template-columns: auto 1fr 1fr 1fr;
  /* grid-column-gap: 20px; */
  /* grid-row-gap: 20px; */

  padding: 5px;
}

.my-table > div {
  padding: 5px;
}

.object {
  background-color: #cccccc;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid black;
}

.object-list :not(:last-child) {
  margin-bottom: 5px;
}

.roww {
  border-bottom: 1px solid black;
}

.textbox {
  padding: 5px;
}

.selected {
  /* border: 5px solid #81c784; */
  background-color: rgba(129, 199, 132, 0.7);
  border-radius: 10px;
  border: 1px solid black;
}

.available {
  /* border: 5px solid #81c784; */
  background-color: rgba(255, 238, 88, 0.7);
  border-radius: 10px;
  border: 1px solid black;
}

select {
  width: 100%;
}
</style>
