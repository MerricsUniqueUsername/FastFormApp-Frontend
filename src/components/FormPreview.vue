<template>

  <!-- Selector for element -->
  <div v-show="formInteract" ref="outline" class="fixed border border-dashed z-20 border-gray-500 pointer-events-none"></div>

  <!-- Selector for HTML element -->
  <div ref="html_outline" v-show="selectedHTMLElement && formInteract" class="fixed border z-30 border-blue-400 pointer-events-none"></div>

  <!-- Content -->
  <div class="w-2/3 h-full bg-gray-100 overflow-y-auto" id="content">
    <div class="p-4 m-5 bg-white rounded-md shadow-sm border border-gray-300 formContainer">

      <!-- Form -->
      <div ref="form" class="text-black m-16 relative form">

        <!-- Form elements -->
        <FormElement 
          @select="selectElement"
          @change="handleChange"
          :editing="formInteract" 
          v-for="(element, index) in form.elements" 
          :key="index" 
          :element="element" 
          ref="form_element"
        />

      </div>

    </div>
  </div> 
</template>

<script>
import FormElement from './FormElement.vue'

export default {
  name: 'FormPreview',
  emits: ['select'],
  inject: ['formInteract'],
  components: {
    FormElement,
  },
  props: {
    form: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      selectedElement: null,
      selectedHTMLElement: null,
      test: 1,
    }
  },
  methods: {

    /**
     * Handle input change in form elements
     * @param unselectHTML
     */
    handleChange(unselectHTML) {
      this.updateSelector(unselectHTML);
    },
    

    /**
     * Select the element that is clicked
     * @param element 
     */
    selectElement(element, target) {

      // Update variables
      const allElements = this.$refs.form_element;
      const selectedElement = allElements.filter(el => el.element === element)[0];
      this.selectedHTMLElement = target;
      this.selectedElement = selectedElement;

      // Remove selected from all elements
      allElements.forEach(el => el.selected = false);

      // Add selected to selected element
      selectedElement.selected = true;

      // Emit select event
      this.$emit('select', element);

      // Update selector
      this.updateSelector();
    },

    /**
     * Update selector position to show over selectedElement
     */
    updateSelector(unselectHTML) {

      // If no selected element, return
      if(!this.selectedElement) return;

      // Remove selected HTML if needed
      if(unselectHTML == 'true') {
        this.selectedHTMLElement = null;
      }

      // Puts ohtline overlaying selected element using client rect
      const rect = this.selectedElement.$refs.element.getBoundingClientRect();
      this.$refs.outline.style.top = `${rect.top}px`;
      this.$refs.outline.style.left = `${rect.left}px`;
      this.$refs.outline.style.width = `${rect.width}px`;
      this.$refs.outline.style.height = `${rect.height}px`;

      // Put html outline overlaying selected HTML element
      if(!this.selectedHTMLElement) return;
      const htmlRect = this.selectedHTMLElement.getBoundingClientRect();
      this.$refs.html_outline.style.top = `${htmlRect.top}px`;
      this.$refs.html_outline.style.left = `${htmlRect.left}px`;
      this.$refs.html_outline.style.width = `${htmlRect.width}px`;
      this.$refs.html_outline.style.height = `${htmlRect.height}px`;

    },

    /**
     * Update CSS for manual CSS
     */
    updateCSS() {
      // If DOM not loaded, return
      if(Object.keys(this.$refs).length == 0) return;

      // Add style tag to form ref it it does not exist
      if(!this.$refs.form.querySelector('style.customCSS')) {
        const style = document.createElement('style');
        style.classList.add('customCSS');
        this.$refs.form.appendChild(style);
      }

      // Get style
      const style = this.$refs.form.querySelector('style.customCSS');
      style.innerHTML = `#content .formContainer { ${this.form.css} }`;
    },

    /**
     * Update the theme of the form
     * @param theme 
     */
    updateTheme(theme) {

      // If DOM not loaded, return
      if(Object.keys(this.$refs).length == 0) return;

      // Add style tag to form ref it it does not exist
      if(!this.$refs.form.querySelector('style.theme')) {
        const style = document.createElement('style');
        style.classList.add('theme');
        this.$refs.form.appendChild(style);
      }

      // Get style
      const style = this.$refs.form.querySelector('style.theme');
      style.innerHTML = `
        .form .element {
          font-family: ${theme.fontFamily};
        }
        .form .element h1 {
          color: #${theme.headerColor};
        }
        .form .element p {
          color: #${theme.paragraphColor};
        }
        .form .element .question {
          color: #${theme.questionColor};
        }
        .form .element input, .form .input {
          background-color: #${theme.inputBackgroundColor};
          border: 1px solid #${theme.inputBorderColor};
          color: #${theme.inputTextColor};
          padding: ${theme.inputPadding}px;
          font-size: ${theme.inputFontSize}px !important;
          box-shadow: 0px ${theme.shadowSize * 1.5}px ${theme.shadowSize * 2.5}px rgba(0, 0, 0, ${0.2 + theme.shadowSize * 0.01});
          border-radius: ${theme.borderRadius}px;
        }
        .form .element input::placeholder, .form .input::placeholder {
          color: #${theme.inputPlaceholderColor};
          font-size: ${theme.inputFontSize}px;
        }
        .form .element input:hover, .form .input:hover {
          background-color: #${theme.inputBackgroundColorHover};
          border-color: #${theme.inputBorderColorHover};
          color: #${theme.inputTextColorHover};
        }
        .form .element input:hover::placeholder, .form .placeholder {
          color: #${theme.inputPlaceholderColorHover};
        }
        .form .element input:focus {
          background-color: #${theme.inputFocusBackgroundColor};
          border-color: #${theme.inputFocusBorderColor};
          color: #${theme.inputFocusTextColor};
          outline: none;
        }
        .form .element textarea {
          background-color: #${theme.inputBackgroundColor};
          border: 1px solid #${theme.inputBorderColor};
          color: #${theme.inputTextColor};
          padding: ${theme.inputPadding}px;
          font-size: ${theme.inputFontSize}px;
          box-shadow: 0px ${theme.shadowSize * 1.5}px ${theme.shadowSize * 2.5}px rgba(0, 0, 0, ${0.2 + theme.shadowSize * 0.01});
          border-radius: ${theme.borderRadius}px;
        }
        .form .element textarea::placeholder {
          color: #${theme.inputPlaceholderColor};
          font-size: ${theme.inputFontSize}px;
        }
        .form .element textarea:hover {
          background-color: #${theme.inputBackgroundColorHover};
          border-color: #${theme.inputBorderColorHover};
          color: #${theme.inputTextColorHover};
        }
        .form .element textarea:hover::placeholder {
          color: #${theme.inputPlaceholderColorHover};
        }
        .form .element textarea:focus {
          background-color: #${theme.inputFocusBackgroundColor};
          border-color: #${theme.inputFocusBorderColor};
          color: #${theme.inputFocusTextColor};
          outline: none;
        }

        .form .menu {
          background-color: #${theme.dropdownBackgroundColor};
          border: 1px solid #${theme.dropdownBorderColor};
          color: #${theme.dropdownTextColor};
          box-shadow: 0px ${theme.shadowSize * 1.5}px ${theme.shadowSize * 2.5}px rgba(0, 0, 0, ${0.2 + theme.shadowSize * 0.01});\
          border-radius: ${theme.borderRadius}px;
          font-size: ${theme.dropdownFontSize}px;
        }
        .form .menu:hover {
          border-color: #${theme.dropdownBorderColorHover};
        }
        .form .menu .menu-choice {
          padding: ${theme.dropdownPadding}px;
          cursor: pointer;
          transition: background-color 0.2s ease, color 0.2s ease;
        }
        .form .menu .menu-choice:hover {
          background-color: #${theme.dropdownBackgroundColorHover};
          color: #${theme.dropdownTextColorHover};
        }
        .form .selected-choice {
          background-color: #${theme.inputTextColor}16;
          color: #${theme.inputTextColor};
        }
        .form .menu .menu-choice .checkbox {
          border-color: #${theme.inputBorderColor};
          background-color: #${theme.inputBackgroundColor};
          box-shadow: 0px ${theme.shadowSize * 1.5}px ${theme.shadowSize * 2.5}px rgba(0, 0, 0, ${0.2 + theme.shadowSize * 0.01});
        }
        .form .menu .menu-choice .checkbox:hover {
          border-color: #${theme.inputBorderColorHover};
          background-color: #${theme.inputBackgroundColorHover};
        }
        .form .menu .menu-choice .checkbox[selected = "true"] {
          background-color: #${theme.selectedColor} !important;
          border-color: #${theme.selectedColor} !important;
          color: #${theme.selectedFontColor} !important;
        }

        .form .element .p-radiobutton.p-component {
          border-color: #${theme.inputBorderColor};
          background-color: #${theme.inputBackgroundColor};
          box-shadow: 0px ${theme.shadowSize * 1.5}px ${theme.shadowSize * 2.5}px rgba(0, 0, 0, ${0.2 + theme.shadowSize * 0.01});
        }
        .form .element .p-radiobutton.p-component:hover {
          border-color: #${theme.inputBorderColorHover};
          background-color: #${theme.inputBackgroundColorHover};
        }
        .form .element .p-radiobutton-checked.p-component {
          background-color: #${theme.selectedColor} !important;
          border-color: #${theme.selectedColor} !important;
        }

        .form .element .p-checkbox.p-component {
          border-color: #${theme.inputBorderColor};
          background-color: #${theme.inputBackgroundColor};
          box-shadow: 0px ${theme.shadowSize * 1.5}px ${theme.shadowSize * 2.5}px rgba(0, 0, 0, ${0.2 + theme.shadowSize * 0.01});
        }
        .form .element .p-checkbox.p-component:hover {
          border-color: #${theme.inputBorderColorHover};
          background-color: #${theme.inputBackgroundColorHover};
        }
        .form .element .p-checkbox-checked.p-component {
          background-color: #${theme.selectedColor} !important;
          border-color: #${theme.selectedColor} !important;
        }

        .form .scale-button {
          background-color: #${theme.inputBackgroundColor} !important;
          border-color: #${theme.inputBorderColor} !important;
          color: #${theme.inputTextColor} !important;
          box-shadow: 0px ${theme.shadowSize * 1.5}px ${theme.shadowSize * 2.5}px rgba(0, 0, 0, ${0.2 + theme.shadowSize * 0.01}) !important;
        }
        .form .scale-button:hover {
          background-color: #${theme.inputBackgroundColorHover} !important;
          border-color: #${theme.inputBorderColorHover} !important;
          color: #${theme.inputTextColorHover} !important;
        }
        .form .scale-button.chosen {
          background-color: #${theme.selectedColor} !important;
          border-color: #${theme.selectedColor} !important;
          color: #${theme.selectedFontColor} !important;
        }

        .form .star {
          color: #${theme.selectedColor};
          fill: #${theme.inputBackgroundColor};
        }
        .form .star:hover {
          color: #${theme.selectedColor} !important;
          fill: #${theme.selectedColor} !important;
        }
        .form .star svg[selected="true"] {
          color: #${theme.selectedColor} !important;
          fill: #${theme.selectedColor} !important;
        }

        input[type="range"] {
          accent-color: #${theme.selectedColor};
          box-shadow: none !important;
        }
        
      `;

    }
  },

  // Watch for changes in form
  watch: {
    form: {
      deep: true,
      handler() {
        this.updateSelector();
      }
    },
    'form.theme': {
      handler(newTheme) {
        if(newTheme) {
          this.updateTheme(newTheme);
        }
      },
      deep: true,
      immediate: true
    },
    'form.css': {
      handler(newCSS) {
        this.updateCSS();
      },
      deep: true,
      immediate: true
    }
  },

  mounted() {

    // Check if scroll
    document.getElementById('content').onscroll = () => {
      this.updateSelector();
    }

    // Check if resize screen
    window.onresize = () => {
      this.updateSelector();
    }

    // Wait a tick then update theme
    this.$nextTick(() => {
      this.updateTheme(this.form.theme);
      this.updateCSS();
    });

  }
}
</script>

<style>

/* Style */
.input-border {
  @apply 
  rounded-sm 
  border border-solid
  border-gray-400
}
.input-color {
  @apply
  text-gray-800
  bg-gray-50
}
.placeholder {
  @apply
  !text-gray-500
  text-sm
}
.input-border:hover {
  @apply
  border-gray-700;
}
.shadow {
  @apply
  shadow-sm;
}
.transition {
  @apply
  transition-all
  duration-150;
}
.padding {
  @apply
  p-1.5;
}
.dropdown {
  @apply
  shadow
  padding
  bg-gray-50
  rounded-md
  input-border;
}
.dropdown-option {
  @apply
  text-gray-600
  hover:text-gray-900
  hover:!bg-gray-100
  transition
  duration-150
  rounded-sm
  cursor-pointer
  p-1.5;
}

/* Apply placeholders */
::placeholder {
  @apply
  placeholder
}
.p-placeholder {
  @apply
  placeholder;
}

/* Header */
h1 {
  @apply
  text-3xl
  text-gray-800
  font-bold;
}

/* Paragraph */
p {
  @apply
  text-gray-700
  leading-relaxed;
}

/* Divider */
.divider {
  @apply
  border-t
  border-gray-200
  my-4;
}

/* Short response */
.short-response {
  @apply
  input-border
  padding
  transition
  w-full
  input-color;
}

/* Long response */
textarea {
  @apply
  w-full
  input-border
  padding
  shadow
  transition
  input-color;
}

/* Number input */
.p-inputnumber {
  @apply 
  w-full;
}
.p-inputnumber input {
  @apply rounded-sm;
}
.p-inputnumber-increment-button, .p-inputnumber-decrement-button {
  @apply 
  rounded-sm 
  m-1.5
  text-gray-700;
}
.p-inputnumber-button {
  @apply
  m-0
  mx-1
}

/* Multiple choice radio */
.p-radiobutton.p-component {
  @apply 
  w-4
  h-4
  shadow
  rounded-full
  border
  border-gray-400
}
.p-radiobutton.p-component.p-radiobutton-checked {
  @apply 
  bg-black
  border
  border-black
  transition
  duration-150
}

/* Multiple choice checkbox */
.p-checkbox.p-component {
  @apply 
  w-4
  h-4
  shadow
  input-border
}

/* Select */
.p-select.p-inputwrapper {
  @apply 
  input-border
  shadow
  transition
  padding
  input-color;
}
.p-select-list-container {
  @apply
  dropdown;
}
.p-select-list-container .p-select-option {
  @apply 
  dropdown-option;
}

/* Multiselect */
.p-multiselect.p-inputwrapper {
  @apply 
  input-border
  shadow
  transition
  padding
  bg-gray-50;
}
.p-multiselect-overlay.p-component {
  @apply
  dropdown;
}
.p-multiselect-list-container .p-multiselect-option {
  @apply 
  dropdown-option;
}
.p-multiselect-overlay .p-multiselect-header {
  @apply
  text-gray-600
  hover:text-gray-900
  transition
  duration-150
  rounded-sm
  cursor-pointer
  p-1.5;
}
.p-multiselect-overlay .p-checkbox {
  @apply
  input-border
  mr-2
  min-w-4
  min-h-4;
}

/* Slider (input range) */
.slider {
  @apply
  w-full;
}

/* Linear scale */
.scale-button {
  @apply 
  border 
  transition-all 
  duration-100 
  border-black 
  h-7 
  cursor-pointer 
  flex 
  items-center 
  justify-center 
  aspect-square 
  rounded-sm;
}
.scale-button.chosen {
  @apply 
  bg-black 
  text-white;
}

/* Email input */
.email-input {
  @apply 
  input-border
  shadow
  transition
  padding
  w-full
  input-color;
}

/* Date picker */
.p-datepicker > .p-datepicker-input {
  @apply 
  input-border
  shadow
  transition
  padding;
}
.p-datepicker.p-component.p-inputwrapper {
  @apply
  input-color;
  
}
.p-datepicker > .p-datepicker-input input {
  @apply bg-white;
} 
.p-datepicker-panel.p-component {
  @apply
  dropdown
}
.p-datepicker-panel .p-datepicker-select-year {
  @apply
  ml-2
}
.p-datepicker-day-cell.p-datepicker-other-month {
  @apply
  text-gray-500;
}

/* Star rating */
.p-rating-option {
  @apply 
  pr-2
}
</style>