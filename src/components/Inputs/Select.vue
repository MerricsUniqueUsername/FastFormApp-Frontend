<template>
  <div class="relative">
    <div
      @click="toggleDropdown"
      class="flex items-center justify-between w-full p-2 border border-gray-300 rounded cursor-pointer bg-white input transition-all duration-150"
      ref="inputBox"
    >
      <span v-if="selectedOption" class="truncate">{{ selectedOption }}</span>
      <span v-else class="text-gray-400 truncate placeholder">{{ placeholder }}</span>
      <svg
        class="w-5 h-5 text-gray-400 transform transition-transform duration-200"
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

    <!-- Dropdown menu with fixed positioning and inline style for top/left/width -->
    <div
      v-show="isOpen"
      ref="dropdownMenu"
      class="menu fixed z-[550] bg-white border border-gray-300 shadow-lg rounded max-h-60 overflow-y-auto"
      :style="dropdownPosition"
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
      isOpen: false,
      dropdownPosition: {}, // Will store { top: 'Xpx', left: 'Ypx', width: 'Zpx' }
    }
  },
  computed: {
    selectedOption() {
      return this.modelValue;
    },
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.$nextTick(() => {
          this.calculateDropdownPosition();
        });
      }
    },
    selectOption(option) {
      this.$emit('update:modelValue', option);
      this.isOpen = false;
      // No need to reset isDroppedAbove, as we no longer use it directly in styling
    },
    calculateDropdownPosition() {
      if (!this.$refs.inputBox || !this.$refs.dropdownMenu) {
        return;
      }

      const inputRect = this.$refs.inputBox.getBoundingClientRect();
      const dropdownRect = this.$refs.dropdownMenu.getBoundingClientRect();

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

      const dropdownHeight = dropdownRect.height > 0 ? dropdownRect.height : 240; // max-h-60 estimated height

      const spaceBelow = viewportHeight - inputRect.bottom;
      const spaceAbove = inputRect.top;

      const offset = 4; // Margin/offset from the input field (corresponds to mt-1/mb-1)

      let top, left;

      // Determine if it should drop above
      const shouldDropAbove = (spaceBelow < dropdownHeight + offset) && (spaceAbove >= dropdownHeight + offset);

      if (shouldDropAbove) {
        top = inputRect.top - dropdownHeight - offset; // Position above input
      } else {
        top = inputRect.bottom + offset; // Position below input
      }

      // Calculate left position (aligned with input's left edge)
      left = inputRect.left;

      // Adjust if dropdown goes off-screen to the right
      const rightEdgeOfDropdown = left + inputRect.width; // We want dropdown width to match input width
      if (rightEdgeOfDropdown > viewportWidth - 5) { // 5px buffer from right edge
        left = viewportWidth - inputRect.width - 5;
      }
      // Adjust if dropdown goes off-screen to the left
      if (left < 5) { // 5px buffer from left edge
        left = 5;
      }

      // Ensure top doesn't go off-screen vertically
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
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleScroll, true);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll, true);
  }
}
</script>

<style scoped>
/* Basic styling for the input */
.input {
  min-height: 40px; /* Ensure consistent height */
}

/* Placeholder text color */
.placeholder {
  color: #9CA3AF; /* gray-400 */
}

/* Ensure selected option text doesn't wrap */
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>