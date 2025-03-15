<template>
  <div class="font-picker relative">
    <!-- Dropdown Button -->
    <button
      @click="toggleDropdown"
      class="flex items-center justify-between w-full p-1.5 text-left bg-white border border-gray-400 rounded-sm shadow-sm"
    >
      <span :style="{ fontFamily: selectedFont }">{{ selectedFont }}</span>
      <svg
        class="w-5 h-5 ml-2"
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
      class="absolute z-10 w-full mt-0.5 bg-white border border-gray-400 rounded-sm shadow-lg h-48 overflow-auto"
    >
      <ul class="py-1">
        <li
          v-for="font in fonts"
          :key="font"
          @click="selectFont(font)"
          class="px-2 py-2 cursor-pointer hover:bg-gray-50 transition duration-300"
          :style="{ fontFamily: font }"
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
    },
    selectFont(font) {
      this.selectedFont = font; // Update selected font
      this.isOpen = false; // Close the dropdown
      this.$emit('update:modelValue', this.selectedFont); // Emit the updated font name as an event to parent component  (v-model)
    }
  },
  watch: {
    // Watch for changes in the `value` prop (from v-model)
    modelValue(newFont) {
      if (newFont !== this.selectedFont) {
        this.selectedFont = newFont;
      }
    }
  }
};
</script>