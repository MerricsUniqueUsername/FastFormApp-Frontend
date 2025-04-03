<template>
    <div class="relative">
      <div 
        @click="toggleDropdown" 
        class="flex items-center justify-between w-full p-2 border border-gray-300 rounded cursor-pointer bg-white input"
      >
        <span v-if="selectedOption" class="truncate">{{ selectedOption }}</span>
        <span v-else class="text-gray-400 truncate placeholder">{{ placeholder }}</span>
        <svg 
          class="w-5 h-5 text-gray-400" 
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
            @click="selectOption(option)"
            class="px-3 py-2 hover:bg-gray-100 cursor-pointer menu-choice"
          >
            {{ option }}
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Select',
    props: {
      modelValue: {
        type: [String, Number, null],
        default: null
      },
      options: {
        type: Array,
        default: () => []
      },
      placeholder: {
        type: String,
        default: 'Select an option'
      }
    },
    data() {
      return {
        isOpen: false
      }
    },
    computed: {
      selectedOption() {
        return this.modelValue;
      }
    },
    methods: {
      toggleDropdown() {
        this.isOpen = !this.isOpen;
      },
      selectOption(option) {
        this.$emit('update:modelValue', option);
        this.isOpen = false;
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