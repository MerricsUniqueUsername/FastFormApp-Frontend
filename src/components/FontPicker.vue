<template>
  <div class="font-picker relative">
    <!-- Dropdown Button -->
    <button
      @click="toggleDropdown"
      class="flex items-center justify-between w-full p-1.5 text-left bg-gray-800 border border-gray-700 rounded-md shadow-sm text-gray-300 hover:border-gray-600 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
    >
      <span :style="{ fontFamily: selectedFont }">{{ selectedFont }}</span>
      <svg
        class="w-4 h-4 ml-2 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg h-48 overflow-auto"
    >
      <ul class="py-1">
        <li
          v-for="font in fonts"
          :key="font"
          @click="selectFont(font)"
          class="px-3 py-2 cursor-pointer hover:bg-gray-700 text-gray-300 transition duration-150"
          :style="{ fontFamily: font }"
          :class="{ 'bg-blue-600/20 border-l-2 border-blue-500': selectedFont === font }"
        >
          {{ font }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FontPicker',
  props: {
    modelValue: {
      type: String,
      default: 'Arial' // Default font
    }
  },
  data() {
    return {
      selectedFont: this.modelValue, // Local copy of the selected font
      isOpen: false, // Dropdown visibility state
      fonts: [
        'Arial',
        'Times New Roman',
        'Courier New',
        'Verdana',
        'Georgia',
        'Comic Sans MS',
        'Impact',
        'Trebuchet MS',
        'Lucida Sans Unicode',
        'Tahoma'
      ] // List of available fonts
    };
  },
  emits: ['update:modelValue'],
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen; // Toggle dropdown visibility
      
      // Close dropdown when clicking outside (add to mounted if not already in parent)
      if (this.isOpen) {
        this.$nextTick(() => {
          const closeOnOutsideClick = (e) => {
            if (!this.$el.contains(e.target)) {
              this.isOpen = false;
              document.removeEventListener('click', closeOnOutsideClick);
            }
          };
          document.addEventListener('click', closeOnOutsideClick);
        });
      }
    },
    selectFont(font) {
      this.selectedFont = font; // Update selected font
      this.isOpen = false; // Close the dropdown
      this.$emit('update:modelValue', this.selectedFont); // Emit the updated font name as an event to parent component (v-model)
    }
  },
  watch: {
    // Watch for changes in the `modelValue` prop (from v-model)
    modelValue(newFont) {
      if (newFont !== this.selectedFont) {
        this.selectedFont = newFont;
      }
    }
  }
};
</script>