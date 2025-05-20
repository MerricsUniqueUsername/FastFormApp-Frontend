<template>
  <div class="font-picker relative">
    <!-- Input area - clickable to open, holds the search input and toggle arrow -->
    <div
        class="flex items-center justify-between w-full p-1.5 text-left bg-neutral-800 border border-neutral-700 rounded-md shadow-sm text-neutral-300 hover:border-neutral-600 transition-all duration-200 focus-within:outline-none focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500"
        @click="openDropdownAndFocusInput"
    >
      <!-- Search Input -->
      <input
          ref="searchInput"
          type="text"
          v-model="searchText"
          @input="filterFonts"
          @focus="openDropdown"
          @blur="handleBlur"
          @keydown.enter.prevent="selectFirstFilteredFont"
          placeholder="Search fonts..."
          class="flex-grow bg-transparent outline-none px-1.5 text-neutral-300 placeholder-neutral-500"
          :style="{ fontFamily: isTyping ? 'inherit' : selectedFont }"
      />
      <!-- Toggle Arrow Icon -->
      <svg
          class="w-4 h-4 ml-2 text-neutral-400 cursor-pointer"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          @click.stop="toggleDropdown"
      >
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>

    <!-- Dropdown Menu -->
    <div
        v-if="isOpen"
        class="absolute z-10 w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-md shadow-lg h-48 overflow-auto"
    >
      <ul class="py-1">
        <li
            v-for="font in filteredFonts"
            :key="font"
            @mousedown.prevent="selectFont(font)"
            class="px-3 py-2 cursor-pointer hover:bg-neutral-800 text-neutral-300 transition duration-150"
            :style="{ fontFamily: font }"
            :class="{ 'bg-neutral-600/30': selectedFont === font }"
        >
          {{ font }}
        </li>
        <li v-if="filteredFonts.length === 0" class="px-3 py-2 text-neutral-500">No fonts found.</li>
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
      selectedFont: this.modelValue, // The font that is currently selected and emitted
      searchText: this.modelValue, // The text currently in the input field (user typing)
      isOpen: false, // Dropdown visibility state
      allFonts: [
        'Arial',
        'Times New Roman',
        'Courier New',
        'Verdana',
        'Georgia',
        'Comic Sans MS',
        'Impact',
        'Trebuchet MS',
        'Lucida Sans Unicode',
        'Tahoma',
        'Palatino Linotype',
        'Book Antiqua',
        'Lucida Console',
        'Garamond',
        'Arial Black',
        'Segoe UI',
        'Roboto', // Common web font
        'Open Sans', // Common web font
        'Lato', // Common web font
        'Montserrat', // Common web font
        'Oswald', // Common web font
        'Source Sans Pro', // Common web font
        'Raleway', // Common web font
        'Ubuntu', // Common web font
        'Merriweather', // Common web font
        'Noto Sans', // Common web font
        'PT Sans', // Common web font
        'Playfair Display', // Common web font
        'Nunito', // Common web font
        'Quicksand', // Common web font
        'Pacifico', // Script font
        'Lobster', // Script font
        'Permanent Marker', // Display font
        'Bebas Neue', // Display font
        'Fira Code', // Monospace
        'Roboto Mono', // Monospace
        'Inconsolata', // Monospace
        'Space Mono', // Monospace
        'Lora', // Serif
        'Cabin', // Sans-serif
        'Exo 2', // Sans-serif
        'Titillium Web', // Sans-serif
        'Archivo Narrow', // Sans-serif
        'Crimson Text', // Serif
        'Indie Flower', // Script
        'Satisfy', // Script
      ], // List of available fonts
      filteredFonts: [], // Fonts filtered by search text
      isTyping: false, // Flag to determine if the user is actively typing
    };
  },
  emits: ['update:modelValue'],
  mounted() {
    this.filterFonts(); // Initialize filtered fonts on mount
    document.addEventListener('click', this.closeOnOutsideClick);
  },
  beforeUnmount() { // Use beforeUnmount in Vue 3
    document.removeEventListener('click', this.closeOnOutsideClick);
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen; // Toggle dropdown visibility
      if (this.isOpen) {
        this.filterFonts(); // Ensure list is current when opening
        this.$nextTick(() => {
          this.$refs.searchInput.focus(); // Focus input when opening
        });
      } else {
        // When closing via toggle, ensure searchText matches selectedFont
        this.searchText = this.selectedFont;
        this.isTyping = false; // Exit typing state
      }
    },
    openDropdown() {
      if (!this.isOpen) {
        this.isOpen = true;
        this.filterFonts(); // Ensure list is current when opening
      }
      this.isTyping = true; // User is interacting with the input, likely typing
    },
    openDropdownAndFocusInput() {
      this.openDropdown();
      this.$nextTick(() => {
        this.$refs.searchInput.focus();
      });
    },
    selectFont(font) {
      this.selectedFont = font; // Update selected font
      this.searchText = font; // Update search text to the selected font name
      this.isOpen = false; // Close the dropdown
      this.isTyping = false; // Exit typing state
      this.$emit('update:modelValue', this.selectedFont); // Emit the updated font name
      // Ensure the input loses focus programmatically after selection
      this.$nextTick(() => {
        // Wait a moment to prevent blur happening before select logic finishes
        setTimeout(() => {
          this.$refs.searchInput.blur();
        }, 0);
      });
    },
    filterFonts() {
      const lowerCaseSearchText = this.searchText.toLowerCase();
      this.filteredFonts = this.allFonts.filter(font =>
          font.toLowerCase().includes(lowerCaseSearchText)
      );
      // Keep the dropdown open while typing if it's not already
      if (!this.isOpen && this.searchText.length > 0) {
        this.isOpen = true;
      }
      // The case where search text is cleared and dropdown closes on blur is handled by handleBlur/closeOnOutsideClick
    },
    selectFirstFilteredFont() {
      if (this.filteredFonts.length > 0) {
        this.selectFont(this.filteredFonts[0]);
      } else {
        // If no fonts match and user hits enter, revert to selected font
        this.handleBlur();
      }
      this.$nextTick(() => {
        this.$refs.searchInput.blur(); // Blur input after selection/attempt
      });
    },
    closeOnOutsideClick(e) {
      // Check if the click is outside the component's root element
      if (this.isOpen && !this.$el.contains(e.target)) {
        this.isOpen = false;
        // When closing from outside click, also ensure searchText matches selectedFont
        this.searchText = this.selectedFont;
        this.isTyping = false; // Exit typing state
      }
    },
    handleBlur() {
      // Use a small delay to allow mousedown.prevent on list items to register before blur logic runs
      setTimeout(() => {
        // Check if the typed text is a valid font name (case-insensitive check)
        const lowerCaseSearchText = this.searchText.toLowerCase();
        const foundFont = this.allFonts.find(font => font.toLowerCase() === lowerCaseSearchText);

        if (foundFont && foundFont !== this.selectedFont) {
          // If a valid font name was typed and it's different from the current selection
          // Update selectedFont and emit. selectFont handles searchText update and closing.
          this.selectFont(foundFont);
        } else if (!foundFont) {
          // If the typed text is NOT a valid font name, revert the input text
          this.searchText = this.selectedFont;
        }
        // If foundFont exists and is the same as selectedFont, do nothing (already correct)

        // Regardless of validation outcome, exit typing state on blur
        this.isTyping = false;

      }, 50); // Small delay
    }
  },
  watch: {
    // Watch for changes in the `modelValue` prop (from v-model)
    modelValue(newFont) {
      // Only update if the prop value is different from the currently selected font
      if (newFont !== this.selectedFont) {
        this.selectedFont = newFont;
        this.searchText = newFont; // Keep search text in sync with prop/selected
        this.filterFonts(); // Re-filter in case the new font is not in the original list
      }
    }
  }
};
</script>

<style scoped>
/* Basic styling for the container */
.font-picker {
  font-family: sans-serif; /* Default fallback */
}

/* Styles for the search input */
.font-picker input {
  /* Remove default browser focus outline */
  outline: none;
}

/* Apply selected font style to the input only when not actively typing */
/* This is handled by the inline style binding using `isTyping` */

/* Styles for the font family in the dropdown list items */
.font-picker ul li {
  font-family: inherit; /* Ensures the applied font is used for preview */
}

/* Override default browser focus outline for the wrapper div */
.font-picker .focus-within\:outline-none:focus-within {
  outline: none;
}

/* You might want to add custom scrollbar styles for dark/neutral themes here */
/* Example using common prefixes: */
/* .font-picker .overflow-auto::-webkit-scrollbar { width: 8px; }
.font-picker .overflow-auto::-webkit-scrollbar-track { background: #334155; border-radius: 4px; } // neutral-800
.font-picker .overflow-auto::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; } // neutral-700
.font-picker .overflow-auto::-webkit-scrollbar-thumb:hover { background: #64748b; } // neutral-600 */
/* For Firefox: */
/* .font-picker .overflow-auto { scrollbar-width: thin; scrollbar-color: #475569 #334155; } */

</style>