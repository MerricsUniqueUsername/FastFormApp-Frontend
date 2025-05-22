<template>
  <div class="relative">
    <div
      @click="toggleDropdown"
      class="flex items-center justify-between w-full border border-gray-300 rounded cursor-pointer bg-white input px-3 py-2"
      ref="inputBox"
    >
      <div class="flex flex-wrap gap-1 max-w-full">
        <template v-if="selectedValues.length > 0">
          <div
            v-for="(selected, index) in selectedValues"
            :key="index"
            class="selected-choice flex items-center bg-blue-100 text-blue-800 rounded px-2 py-1 text-sm"
          >
            <span class="truncate needed">{{ selected }}</span>
            <button
              @click.stop="removeValue(selected)"
              class="ml-1 text-blue-800 hover:text-blue-900 focus:outline-none"
              aria-label="Remove item"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </template>
        <span v-else class="text-gray-400 truncate placeholder needed py-1">{{ placeholder }}</span>
      </div>
      <svg
        class="w-5 h-5 text-gray-400 flex-shrink-0 transform transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
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

    <!-- Dropdown menu with fixed positioning and inline style for top/left -->
    <div
      v-show="isOpen"
      class="menu fixed z-[550] w-full bg-white border border-gray-300 shadow-lg rounded max-h-60 overflow-y-auto"
      ref="dropdownMenu"
      :style="dropdownPosition"
    >
      <ul class="py-1">
        <li
          v-for="(option, index) in options"
          :key="index"
          @click="toggleOption(option)"
          class="menu-choice hover:bg-gray-100 cursor-pointer flex items-center px-3 py-2"
        >
          <div class="flex items-center">
            <div
              class="checkbox w-4 h-4 mr-2 border rounded flex items-center justify-center border-gray-400"
              :class="{ 'bg-blue-500 border-blue-500 text-white': isSelected(option) }"
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
      isOpen: false,
      dropdownPosition: {}, // Will store { top: 'Xpx', left: 'Ypx', width: 'Zpx' }
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
      if (this.isOpen) {
        // Use nextTick to ensure the dropdown menu is rendered before calculating its position
        this.$nextTick(() => {
          this.calculateDropdownPosition();
        });
      }
    },
    calculateDropdownPosition() {
      if (!this.$refs.inputBox || !this.$refs.dropdownMenu) {
        return;
      }

      const inputRect = this.$refs.inputBox.getBoundingClientRect();
      const dropdownRect = this.$refs.dropdownMenu.getBoundingClientRect();

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

      const dropdownHeight = dropdownRect.height > 0 ? dropdownRect.height : 250; // px (max-h-60)

      const spaceBelow = viewportHeight - inputRect.bottom;
      const spaceAbove = inputRect.top;

      const offset = 4; // Margin/offset from the input field (corresponds to mb-1/mt-1)

      let top, left;

      // Determine if it should drop above:
      // 1. Not enough space below (dropdownHeight + offset)
      // AND
      // 2. Enough space available above (spaceAbove)
      const shouldDropAbove = (spaceBelow < dropdownHeight + offset) && (spaceAbove >= dropdownHeight + offset);

      if (shouldDropAbove) {
        top = inputRect.top - dropdownHeight - offset; // Position above input
      } else {
        top = inputRect.bottom + offset; // Position below input
      }

      // Calculate left position (aligned with input's left edge initially)
      left = inputRect.left;

      // Adjust if dropdown goes off-screen to the right
      if (left + inputRect.width > viewportWidth) { // Use inputRect.width for consistent width
        left = viewportWidth - inputRect.width - 5; // 5px buffer from right edge
      }
      // Adjust if dropdown goes off-screen to the left (unlikely for fixed width)
      if (left < 0) {
        left = 5; // 5px buffer from left edge
      }

      // Ensure top doesn't go off-screen vertically (optional, depends on desired behavior)
      if (top < 0) {
        top = 0;
      }
      if (top + dropdownHeight > viewportHeight) {
        top = viewportHeight - dropdownHeight;
      }


      this.dropdownPosition = {
        top: `${top}px`,
        left: `${left}px`,
        width: `${inputRect.width}px` // Match width of the input box
      };
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
      // After selection, the dropdown usually stays open for MultiSelect
      // If you want it to close after any selection, uncomment the line below:
      // this.isOpen = false;
    },
    removeValue(option) {
      const newValue = this.selectedValues.filter(item => item !== option);
      this.$emit('update:modelValue', newValue);
      // If the dropdown is open, and a value is removed, recalculate position
      // in case removal changes the input's height (less items mean shorter input)
      if (this.isOpen) {
        this.$nextTick(() => {
          this.calculateDropdownPosition();
        });
      }
    },
    handleClickOutside(event) {
      if (this.$el && !this.$el.contains(event.target)) {
        this.isOpen = false;
      }
    },
    handleScroll() {
      if (this.isOpen) {
        this.calculateDropdownPosition();
      }
    },
    handleResize() {
      if (this.isOpen) {
        this.calculateDropdownPosition();
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
    window.addEventListener('scroll', this.handleScroll, true);
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('scroll', this.handleScroll, true);
    window.removeEventListener('resize', this.handleResize);
  }
}
</script>

<style scoped>
/* Added some padding to the input for better appearance */
.input {
  min-height: 40px; /* Ensure consistent height even with no selections */
  padding-top: 0.5rem; /* Equivalent to py-2 */
  padding-bottom: 0.5rem; /* Equivalent to py-2 */
  padding-left: 0.75rem; /* Equivalent to px-3 */
  padding-right: 0.75rem; /* Equivalent to px-3 */
}
.needed {
  white-space: nowrap; /* Prevents selected items/placeholder from wrapping prematurely */
  overflow: hidden;
  text-overflow: ellipsis;
}
.input > div:first-child {
  padding-right: 0.5rem; /* Add some space before the arrow */
}
.placeholder {
  padding-top: 0.25rem; /* Vertically align placeholder with selected choices */
  padding-bottom: 0.25rem;
}
</style>