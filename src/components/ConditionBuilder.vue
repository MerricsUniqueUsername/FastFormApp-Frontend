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
                      @change="onFieldChange(condition)"
                      class="border border-neutral-700 bg-neutral-700 rounded-sm px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-neutral-200">
                <option v-for="(variable, index) in variables" :key="index" :value="variable.name">{{ variable.name }}</option>
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

              <!-- Text input for most types -->
              <input v-if="!isMultipleChoice(condition) && !isDate(condition)"
                     v-model="condition.value"
                     type="text"
                     class="border border-neutral-700 bg-neutral-700 rounded-sm px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-neutral-200"
                     placeholder="Value">

              <!-- Select dropdown for multiple_choice -->
              <select v-if="isMultipleChoice(condition)"
                      v-model="condition.value"
                      class="border border-neutral-700 bg-neutral-700 rounded-sm px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-neutral-200">
                <option value="">Select an option</option> <!-- Default option -->
                <option v-for="(option, optIndex) in getOptionsForField(condition.field)" :key="optIndex" :value="option.value">
                  {{ option.text }}
                </option>
              </select>

              <!-- Date picker for date type -->
              <input v-if="isDate(condition)"
                     v-model="condition.value"
                     type="date"
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
      if (element && element.conditions) {
        this.conditions = element.conditions.map(group => ({
          ...group,
          conditions: group.conditions.map(condition => {
            const selectedVariable = this.variables.find(v => v.name === condition.field);
            return {
              ...condition,
              type: selectedVariable ? selectedVariable.type : null
            };
          })
        }));
      } else {
        this.conditions = [];
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
      let initialField = null;
      let initialType = null;
      if (this.variables && this.variables.length > 0) {
        initialField = this.variables[0].name;
        initialType = this.variables[0].type;
      }
      this.conditions.push({
        operator: 'AND',
        conditions: [
          {
            field: initialField,
            operator: 'equals',
            value: '',
            type: initialType // Add type property here
          }
        ]
      });
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
      let initialField = null;
      let initialType = null;
      if (this.variables && this.variables.length > 0) {
        initialField = this.variables[0].name;
        initialType = this.variables[0].type;
      }
      this.conditions[groupIndex].conditions.push({
        field: initialField,
        operator: 'equals',
        value: '',
        type: initialType // Add type property here
      });
    },

    /**
     * Handle field change to update condition type and reset value
     * @param condition
     */
    onFieldChange(condition) {
      const selectedVariable = this.variables.find(v => v.name === condition.field);
      if (selectedVariable) {
        condition.type = selectedVariable.type;
        condition.value = ''; // Reset value when field changes
      } else {
        condition.type = null;
        condition.value = '';
      }
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
    },

    /**
     * Check if the condition type is multiple_choice
     * @param condition
     */
    isMultipleChoice(condition) {
      return condition && condition.type === 'multiple_choice';
    },

    /**
     * Check if the condition type is date
     * @param condition
     */
    isDate(condition) {
      return condition && condition.type === 'date';
    },

    /**
     * Get options for a multiple_choice field
     * @param fieldName
     */
    getOptionsForField(fieldName) {
      if (!this.form || !this.form.elements) {
        return [];
      }
      const element = this.form.elements.find(el => el.name === fieldName);
      // For MultipleChoice elements, options are usually in an 'items' array
      // For Dropdown elements, they might be in an 'options' array.
      if (element && element.items && Array.isArray(element.items)) {
        return element.items;
      } else if (element && element.options && Array.isArray(element.options)) { // For Dropdown
        return element.options;
      }
      return [];
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
    },
    variables: { // Add this new watcher
      handler(newVariables, oldVariables) {
        if (JSON.stringify(newVariables) === JSON.stringify(oldVariables)) {
          return; // No actual change
        }
        this.conditions.forEach(group => {
          group.conditions.forEach(condition => {
            const selectedVariable = newVariables.find(v => v.name === condition.field);
            if (selectedVariable) {
              if (condition.type !== selectedVariable.type) {
                condition.type = selectedVariable.type;
                condition.value = ''; // Reset value because type changed
              }
            } else {
              // Field no longer exists in variables
              if (condition.type !== null) {
                condition.type = null;
                condition.value = ''; // Reset value
              }
            }
          });
        });
      },
      deep: true // Watch for changes in the array of objects
    }
  }
}
</script>