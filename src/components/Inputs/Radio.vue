<template>
    <div 
      class="radio-container inline-flex items-center cursor-pointer w-full"
      @click="selectRadio"
      :class="{ 'radio-disabled': disabled }"
    >
      <div 
        class="p-radiobutton p-component radio w-4 h-4 border-2 rounded-full flex items-center justify-center transition-colors"
        :class="[
          isChecked ? 'p-radiobutton-checked' : 'unchecked',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        ]"
      >
        <div 
          v-if="isChecked" 
          class="w-2 h-2 rounded-full"
        ></div>
      </div>
      
      <input 
        type="radio" 
        class="sr-only"
        :id="id"
        :value="value" 
        :name="name"
        :checked="isChecked" 
        :disabled="disabled"
        @change="handleChange"
      />
  
      <!-- Display the value next to the radio button -->
      <div 
        class="ml-2 text-sm font-medium text-gray-700 cursor-pointer text-edit w-full"
        :class="{ 'text-gray-400': disabled }"
        @click.stop="selectRadio"
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
    name: 'CustomRadio',
    props: {
      modelValue: {
        type: [String, Number, Boolean, Object],
        default: null
      },
      value: {
        type: [String, Number, Boolean, Object],
        default: null
      },
      name: {
        type: String,
        required: true
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
        if (this.modelValue === null && this.value === null) return true;
        return this.modelValue === this.value;
      },
      displayValue() {
        // Format the value for display
        if (this.value === null) return 'null';
        if (typeof this.value === 'object') return JSON.stringify(this.value);
        return String(this.value);
      }
    },
    methods: {
      selectRadio() {
        if (this.disabled) return;
        
        if (!this.isChecked) {
          this.$emit('update:modelValue', this.value);
          this.$emit('change', this.value);
        }
      },
      handleChange(event) {
        // This is mainly for accessibility when using keyboard navigation
        this.selectRadio();
      }
    }
  }
  </script>
  
  <style scoped>
  .radio-container:focus-within .radio {
    outline: 2px solid #4f46e5;
    outline-offset: 2px;
  }
  
  .radio-disabled {
    cursor: not-allowed;
  }
  </style>