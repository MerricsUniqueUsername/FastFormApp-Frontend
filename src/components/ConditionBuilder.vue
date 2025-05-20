<!-- ConditionalBuilder.vue -->
<template>
  <div class="w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center flex-col">
    <!-- Main container with relative positioning -->
    <div class="relative border-neutral-700 border rounded-md shadow-lg bg-neutral-800">
      <!-- Fixed header with close button -->
      <div class="sticky top-0 z-10 border-b border-neutral-700 p-2 flex justify-end shadow-sm bg-neutral-900" style="border-top-left-radius: 5px; border-top-right-radius: 5px;">
        <button @click="$emit('close')" class="text-neutral-400 hover:text-neutral-200 p-1 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
          </svg>
        </button>
      </div>

      <!-- Scrollable content with original padding and max-height -->
      <div class="p-12 max-h-96 overflow-auto">
        <!-- Group container -->
        <div v-for="(group, groupIndex) in conditions" :key="groupIndex" 
             class="border border-neutral-700 rounded-sm p-4 bg-neutral-800 shadow-sm mb-4">
          
          <button @click="removeGroup(groupIndex)"
                class="bg-red-900 bg-opacity-30 p-1 px-2 mb-4 w-full rounded-md text-red-400 hover:text-red-300 text-sm">
            Remove Group
          </button>
          
          <!-- Condition operator (AND/OR) -->
          <div class="mb-4 flex items-center">
            <select v-model="group.operator"
                    class="border border-neutral-700 bg-neutral-700 rounded-sm px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-neutral-200">
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
          </div>

          <!-- Individual conditions -->
          <div class="space-y-3">
            <div v-for="(condition, condIndex) in group.conditions" :key="condIndex"
                 class="flex items-center space-x-2">
              <select v-model="condition.field"
                      class="border border-neutral-700 bg-neutral-700 rounded-sm px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-neutral-200">
                <option v-for="(variable, index) in variables" :key="index" :value="variable">{{ variable }}</option>
              </select>

              <select v-model="condition.operator"
                      class="border border-neutral-700 bg-neutral-700 rounded-sm px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-neutral-200">
                <option value="equals">equals</option>
                <option value="not_equals">not equals</option>
                <option value="greater_than">greater than</option>
                <option value="less_than">less than</option>
                <option value="contains">contains</option>
                <option value="not_contains">not contains</option>
                <option value="is_empty">is empty</option>
                <option value="is_not_empty">is not empty</option>
              </select>

              <input v-model="condition.value"
                     type="text"
                     class="border border-neutral-700 bg-neutral-700 rounded-sm px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-neutral-200"
                     placeholder="Value">

              <button @click="removeCondition(groupIndex, condIndex)"
                      class="text-red-400 hover:text-red-300 p-1.5 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Add condition button -->
          <button @click="addCondition(groupIndex)"
                  class="bg-blue-900 bg-opacity-30 p-1 px-2 rounded-md mt-3 text-sm text-blue-400 hover:text-blue-300">
            + Add Condition
          </button>
        </div>

        <!-- Add group button -->
        <button @click="addGroup"
                class="px-2 w-full py-1 bg-blue-900 bg-opacity-30 text-blue-400 hover:text-blue-300 rounded-md">
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
     * Load conditions from the selected element
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
     * Add a new group of conditions
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
     * Remove the group of conditions
     * @param groupIndex 
     */
    removeGroup(groupIndex) {
      this.conditions.splice(groupIndex, 1)
    },

    /**
     * Add new condition to the group
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