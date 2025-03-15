<!-- ConditionalBuilder.vue -->
<template>
  <div class="w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center flex-col">
    <!-- Main container with relative positioning -->
    <div class="relative bg-white border-gray-300 border rounded-md shadow-lg">
      <!-- Fixed header with close button -->
      <div class="sticky top-0 z-10 border-b border-gray-200 p-2 flex justify-end shadow-sm bg-gray-50" style="border-top-left-radius: 5px; border-top-right-radius: 5px;">
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 p-1 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
          </svg>
        </button>
      </div>

      <!-- Scrollable content with original padding and max-height -->
      <div class="p-12 max-h-96 overflow-auto">
        <!-- Group container -->
        <div v-for="(group, groupIndex) in conditions" :key="groupIndex" 
             class="border border-gray-200 rounded-sm p-4 bg-white shadow-sm mb-4">
          
          <button @click="removeGroup(groupIndex)"
                class="bg-red-50 p-1 px-2 mb-4 w-full rounded-md text-red-500 hover:text-red-700 text-sm">
            Remove Group
          </button>
          
          <!-- Condition operator (AND/OR) -->
          <div class="mb-4 flex items-center">
            <select v-model="group.operator"
                    class="border border-gray-300 rounded-sm px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
          </div>

          <!-- Individual conditions -->
          <div class="space-y-3">
            <div v-for="(condition, condIndex) in group.conditions" :key="condIndex"
                 class="flex items-center space-x-2">
              <select v-model="condition.field"
                      class="border border-gray-300 rounded-sm px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option v-for="(variable, index) in variables" :key="index" :value="variable">{{ variable }}</option>
              </select>

              <select v-model="condition.operator"
                      class="border border-gray-300 rounded-sm px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="equals">equals</option>
                <option value="not_equals">not equals</option>
                <option value="greater_than">greater than</option>
                <option value="less_than">less than</option>
              </select>

              <input v-model="condition.value"
                     type="text"
                     class="border border-gray-300 rounded-sm px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     placeholder="Value">

              <button @click="removeCondition(groupIndex, condIndex)"
                      class="text-red-500 hover:text-red-700 p-1.5 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Add condition button -->
          <button @click="addCondition(groupIndex)"
                  class="bg-blue-50 p-1 px-2 rounded-md mt-3 text-sm text-blue-500 hover:text-blue-700">
            + Add Condition
          </button>
        </div>

        <!-- Add group button -->
        <button @click="addGroup"
                class="px-2 w-full py-1 bg-blue-50 text-blue-400 rounded-md">
          Add Group
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConditionalBuilder',
  data() {
    return {
      conditions: [
      ]
    }
  },
  props: {
    form: {
      type: Object,
      required: false,
    },
    selectedId: {
      type: Number,
      required: false,
    },
    variables: {
      type: Array,
      required: false,
    }
  },
  emits: ['close'],
  methods: {

    /**
     * Load conditions from selected element
     */
    loadConditions() {
      const element = this.getSelectedElement();
      if (element) {
        this.conditions = element.conditions || [];
      }
    },

    /**
     * Get the selected element
     */
    getSelectedElement() {
      return this.form.elements.find((element) => element.id === this.selectedId);
    },

    /**
     * Add new group of conditions
     */
    addGroup() {
      this.conditions.push({
        operator: 'AND',
        conditions: [
          {
            field: 'name',
            operator: 'equals',
            value: ''
          }
        ]
      })
    },

    /**
     * Remove group of conditions
     * @param groupIndex 
     */
    removeGroup(groupIndex) {
      this.conditions.splice(groupIndex, 1)
    },

    /**
     * Add new condition to group
     * @param groupIndex 
     */
    addCondition(groupIndex) {
      this.conditions[groupIndex].conditions.push({
        field: 'name',
        operator: 'equals',
        value: ''
      })
    },

    /**
     * Remove condition from group
     * @param groupIndex 
     * @param condIndex 
     */
    removeCondition(groupIndex, condIndex) {
      if (this.conditions[groupIndex].conditions.length > 1) {
        this.conditions[groupIndex].conditions.splice(condIndex, 1)
      }
    }
  },
  // Watch for changes in conditions
  watch: {
    conditions: {
      handler(newVal) {
        const element = this.getSelectedElement();
        if (element) {
          element.conditions = newVal;
        }
      },
      deep: true
    }
  }
}
</script>