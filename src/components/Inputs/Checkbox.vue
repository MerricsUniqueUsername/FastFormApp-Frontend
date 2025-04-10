<template>
  <div 
    class="checkbox-container inline-flex items-center cursor-pointer"
    @click="toggleCheckbox"
    :checked="{ 'checkbox-disabled': disabled }"
  >
    <div 
      class="checkbox w-4 h-4 border rounded-sm flex items-center justify-center transition-colors"
      :class="[
        modelValue ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      ]"
      :selected="modelValue"
    >
      <svg 
        v-if="modelValue" 
        class="w-3 h-3 text-white" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="3" 
          d="M5 13l4 4L19 7"
        ></path>
      </svg>
    </div>
    <input 
      type="checkbox" 
      class="sr-only"
      :id="id"
      :value="value" 
      :checked="isChecked" 
      :disabled="disabled"
      @change="handleChange"
    />

    <!-- Display the value next to the checkbox -->
    <div 
      class="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
      :class="{ 'text-gray-400': disabled }"
      @click.stop="toggleCheckbox"
    >
      {{ displayValue }}
    </div>
    
    <!-- Original label if provided -->
    <label 
      v-if="label" 
      :for="id" 
      class="ml-2 text-sm font-medium text-gray-700"
      :class="{ 'text-gray-400': disabled }"
    >
      {{ label }}
    </label>
  </div>
</template>

<script>
export default {
  name: 'CustomCheckbox',
  props: {
    modelValue: {
      type: [Boolean, Array],
      default: false
    },
    value: {
      type: [String, Number, Boolean, Object],
      default: null
    },
    label: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'change'],
  computed: {
    isChecked() {
      if (Array.isArray(this.modelValue)) {
        return this.modelValue.includes(this.value);
      }
      return !!this.modelValue;
    },
    displayValue() {
      // Format the value for display
      if (this.value === null) return 'null';
      if (typeof this.value === 'object') return JSON.stringify(this.value);
      return String(this.value);
    }
  },
  methods: {
    toggleCheckbox() {
      if (this.disabled) return;
      
      if (Array.isArray(this.modelValue)) {
        let newValue = [...this.modelValue];
        
        if (this.isChecked) {
          newValue.splice(newValue.indexOf(this.value), 1);
        } else {
          newValue.push(this.value);
        }
        
        this.$emit('update:modelValue', newValue);
      } else {
        this.$emit('update:modelValue', !this.modelValue);
      }
      
      this.$emit('change', this.isChecked);
    },
    handleChange(event) {
      // This is mainly for accessibility when using keyboard navigation
      this.toggleCheckbox();
    }
  }
}
</script>

<style scoped>
.checkbox-container:focus-within .checkbox {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}

.checkbox-disabled {
  cursor: not-allowed;
}
</style>