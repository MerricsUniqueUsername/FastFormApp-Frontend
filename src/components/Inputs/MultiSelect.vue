<template>
  <div class="relative">
    <div 
      @click="toggleDropdown" 
      class="flex items-center justify-between w-full border border-gray-300 rounded cursor-pointer bg-white input"
    >
      <div class="flex flex-wrap gap-1 max-w-full">
        <template v-if="selectedValues.length > 0">
          <div 
            v-for="(selected, index) in selectedValues" 
            :key="index"
            class="selected-choice flex items-center bg-blue-100 text-blue-800 rounded px-2 py-1 text-sm"
          >
            <span class="truncate">{{ selected }}</span>
            <button 
              @click.stop="removeValue(selected)" 
              class="ml-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </template>
        <span v-else class="text-gray-400 truncate placeholder">{{ placeholder }}</span>
      </div>
      <svg 
        class="w-5 h-5 text-gray-400 flex-shrink-0" 
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path 
          fill-rule="evenodd" 
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
          clip-rule="evenodd" 
        />
      </svg>
    </div>
    
    <div 
      v-show="isOpen" 
      class="menu absolute z-10 w-full mt-1 bg-white border border-gray-300 shadow-lg rounded max-h-60 overflow-y-auto"
    >
      <ul class="py-1">
        <li 
          v-for="(option, index) in options" 
          :key="index"
          @click="toggleOption(option)"
          class="menu-choice hover:bg-gray-100 cursor-pointer flex items-center"
        >
          <div class="flex items-center ">
            <div 
              class="checkbox w-4 h-4 mr-2 border rounded flex items-center justify-center" 
              :selected="isSelected(option)"
            >
              <svg v-if="isSelected(option)" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            {{ option }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MultiSelect',
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    options: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: 'Select options'
    }
  },
  data() {
    return {
      isOpen: false
    }
  },
  computed: {
    selectedValues() {
      return this.modelValue || [];
    }
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    isSelected(option) {
      return this.selectedValues.includes(option);
    },
    toggleOption(option) {
      const newValue = [...this.selectedValues];
      const index = newValue.indexOf(option);
      
      if (index === -1) {
        newValue.push(option);
      } else {
        newValue.splice(index, 1);
      }
      
      this.$emit('update:modelValue', newValue);
    },
    removeValue(option) {
      const newValue = this.selectedValues.filter(item => item !== option);
      this.$emit('update:modelValue', newValue);
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.isOpen = false;
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }
}
</script>