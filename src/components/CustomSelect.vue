<template>
  <div class="w-full">
    <div class="relative">
      <button 
        type="button" 
        class="flex items-center justify-between w-full px-4 py-2 text-sm text-left bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        @click="toggleDropdown"
      >
        <span>{{ selectedLabel || placeholder }}</span>
        <svg 
          class="w-5 h-5 ml-2 -mr-1 text-gray-400" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor" 
          aria-hidden="true"
        >
          <path 
            fill-rule="evenodd" 
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
            clip-rule="evenodd" 
          />
        </svg>
      </button>

      <div 
        v-if="isOpen" 
        class="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto"
      >
        <ul 
          class="py-1 text-sm text-gray-700" 
        >
          <li 
            v-for="option in options" 
            :key="option.value" 
            class="cursor-pointer hover:bg-gray-100"
            @click="selectOption(option)"
          >
            <div class="px-4 py-2">
              {{ option.label }}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuestionTypeSelector',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String,
      default: 'Select a type'
    },
    optionLabel: {
      type: String,
      default: 'label'
    },
    optionValue: {
      type: String,
      default: 'value'
    }
  },
  data() {
    return {
      isOpen: false
    };
  },
  computed: {
    selectedLabel() {
      const selected = this.options.find(option => option[this.optionValue] === this.modelValue);
      return selected ? selected[this.optionLabel] : '';
    }
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    selectOption(option) {
      this.$emit('update:modelValue', option[this.optionValue]);
      this.$emit('change', { value: option[this.optionValue] });
      this.isOpen = false;
      this.updateSelectedElement(option[this.optionValue]);
    },
    updateSelectedElement(value) {
      this.$emit('update-selected-element', value);
    },
    closeDropdown(e) {
      if (!this.$el.contains(e.target)) {
        this.isOpen = false;
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.closeDropdown);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeDropdown);
  }
};
</script>