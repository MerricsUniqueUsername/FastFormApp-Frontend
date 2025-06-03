<template>

<!-- Selector for HTML element -->
<div ref="html_outline" v-show="!isDragging && selectedHTMLElement && formInteract" class="fixed border z-40 border-blue-400 pointer-events-none"></div>

<!-- Selector for element -->
<div v-show="!isDragging && formInteract && selectedElement" ref="outline" class="fixed pointer-events-none border-neutral-400 border-dashed border z-30">
  <div class="bg-red-500 text-white w-fit p-1 absolute top-[calc(50%-12px)] -right-8 rounded-full cursor-pointer !pointer-events-auto" @click="deleteSelectedElement">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
    </svg>
  </div>
</div>

  <!-- Content -->
  <div class="w-2/3 h-[calc(100%-30px)] bg-neutral-950" id="content">
    <div class="p-4 bg-white rounded-2xl m-3 shadow-sm h-full border border-neutral-500 formContainer overflow-y-auto" id="formContainer">

      <!-- Form -->
      <div ref="form" class="text-black m-16 relative form">

        <!-- Form elements -->
        <div
          v-for="(element) in form.elements"
          :key="element.id" 
        >
          <FormElement 
            @select="selectElement"
            @change="handleChange"
            :editing="formInteract" 
            :element="element" 
            ref="form_element"
          />
        </div>

      </div>

    </div>
  </div> 
</template>

<script>
import FormElement from './FormElement.vue'
import Sortable from 'sortablejs';

export default {
  name: 'FormPreview',
  emits: ['select', 'delete'],
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
      isDragging: false, // Added for drag operation
    }
  },
  methods: {

    /**
     * Delete selected element
     */
    deleteSelectedElement() {
      this.$emit('delete', this.selectedElement);
      this.selectedElement = null;
      this.selectedHTMLElement = null;
      this.updateSelector();
    },

    /**
     * Return all form elements
     */
    getElements() {
      return this.$refs.form_element;
    },

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

      // Puts outline overlaying selected element using client rect
      const rect = this.selectedElement.$refs.element.getBoundingClientRect();
      this.$refs.outline.style.top = `${rect.top}px`;
      this.$refs.outline.style.left = `${rect.left}px`;
      this.$refs.outline.style.width = `${rect.width}px`;
      this.$refs.outline.style.height = `${rect.height}px`;

      // Update custom menu position
      this.selectedElement.updateCustomMenu();

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

        .formContainer {
          background-color: #${theme.backgroundColor};
        }

        .form .divider {
          border-color: #${theme.borderColor};
        }

        .form .element {
          font-family: ${theme.fontFamily};
        }
        .form .element h1 {
          color: #${theme.headerColor};
        }
        .form .element p {
          color: #${theme.textColor};
        }
        .form .element .question {
          color: #${theme.textColor};
        }
        .form .label {
          color: #${theme.textColor};
        }
        .form .element input, .form .input {
          background-color: #${theme.inputBaseBackground};
          border: 1px solid #${theme.borderColor};
          color: #${theme.textColor};
          padding: ${theme.inputPadding}px;
          font-size: ${theme.inputFontSize}px !important;
          box-shadow: 0px ${theme.shadowSize * 1.5}px ${theme.shadowSize * 2.5}px rgba(0, 0, 0, ${0.2 + theme.shadowSize * 0.01});
          border-radius: ${theme.borderRadius}px;
        }
        .form .element input::placeholder, .form .input::placeholder {
          color: #${theme.placeholderColor} !important;
          font-size: ${theme.inputFontSize}px;
        }
        .form .element input:hover, .form .input:hover {
          background-color: #${theme.hoverBackground};
          border-color: #${theme.hoverBorderColor};
          color: #${theme.textColor};
        }
        .form .element input:hover::placeholder, .form .input:hover .placeholder {
          color: #${theme.hoverPlaceholderColor} !important;
        }

        .form .placeholder {
          color: #${theme.placeholderColor} !important;
          font-size: ${theme.inputFontSize}px !important;
        }
        .form .element input:focus {
          background-color: #${theme.hoverBackground};
          border-color: #${theme.focusBorderColor};
          color: #${theme.textColor};
          outline: none;
        }
        .form .element .p-inputnumber-button-group {
          margin-right: 9px;
          color: #${theme.textColor};
        }
        .form .element textarea {
          background-color: #${theme.inputBaseBackground};
          border: 1px solid #${theme.borderColor};
          color: #${theme.textColor};
          padding: ${theme.inputPadding}px;
          font-size: ${theme.inputFontSize}px;
          box-shadow: 0px ${theme.shadowSize * 1.5}px ${theme.shadowSize * 2.5}px rgba(0, 0, 0, ${0.2 + theme.shadowSize * 0.01});
          border-radius: ${theme.borderRadius}px;
        }
        .form .element textarea::placeholder {
          color: #${theme.placeholderColor};
          font-size: ${theme.inputFontSize}px;
        }
        .form .element textarea:hover {
          background-color: #${theme.hoverBackground};
          border-color: #${theme.hoverBorderColor};
          color: #${theme.textColor};
        }
        .form .element textarea:hover::placeholder {
          color: #${theme.hoverPlaceholderColor};
        }
        .form .element textarea:focus {
          background-color: #${theme.hoverBackground};
          border-color: #${theme.focusBorderColor};
          color: #${theme.textColor};
          outline: none;
        }

        .form .menu {
          background-color: #${theme.backgroundColor};
          border: 1px solid #${theme.borderColor};
          color: #${theme.textColor};
          box-shadow: 0px ${theme.dropdownShadowSize * 1.5}px ${theme.dropdownShadowSize * 2.5}px rgba(0, 0, 0, ${0.2 + theme.dropdownShadowSize * 0.01});\
          border-radius: ${theme.borderRadius}px;
          font-size: ${theme.dropdownFontSize}px;
        }
        .form .menu:hover {
          border-color: #${theme.hoverBorderColor};
        }
        .time-menu {
          background-color: #${theme.backgroundColor};
          border: 1px solid #${theme.borderColor};
          color: #${theme.textColor};
          box-shadow: 0px ${theme.dropdownShadowSize * 1.5}px ${theme.dropdownShadowSize * 2.5}px rgba(0, 0, 0, ${0.2 + theme.dropdownShadowSize * 0.01});\
          border-radius: ${theme.borderRadius}px;
          font-family: ${theme.fontFamily};
        }
        .time-menu:hover {
          border-color: #${theme.hoverBorderColor};        
        }
        .time-menu .time-header {
          border-bottom: 1px solid #${theme.borderColor};
        }
        .time-menu .not-day-in-month {
          color: #${theme.textColor}60;
        }
        .time-menu .selected-day {
          background-color: #${theme.accentColor} !important;
          color: #${theme.backgroundColor} !important;
          border-radius: 100%;
        }
        .time-menu .unselected-day:hover {
          background-color: #${theme.textColor}15 !important;
          color: #${theme.textColor} !important;
          border-radius: 100%;
        }
        .time-btn:hover {
          background-color: #${theme.textColor}15 !important;
          color: #${theme.textColor} !important;
        }
        .time-menu .am-pm-btn {
          background-color: #${theme.textColor}15 !important;
          color: #${theme.textColor} !important;
        }
        .time-menu .am-pm-btn:hover {
          background-color: #${theme.textColor}35 !important;
          color: #${theme.textColor} !important;
        }
        .form .menu .menu-choice {
          padding: ${theme.dropdownPadding}px;
          cursor: pointer;
          transition: background-color 0.2s ease, color 0.2s ease;
        }
        .form .menu .menu-choice:hover {
          background-color: #${theme.textColor}15;
          color: #${theme.textColor};
        }
        .form .selected-choice {
          background-color: #${theme.textColor}16;
          color: #${theme.textColor};
        }
        .form .checkbox {
          border-color: #${theme.borderColor};
          background-color: #${theme.inputBaseBackground};
          box-shadow: 0px ${theme.shadowSize * 1.5}px ${theme.shadowSize * 2.5}px rgba(0, 0, 0, ${0.2 + theme.shadowSize * 0.01});
        }
        .form .checkbox:hover {
          border-color: #${theme.hoverBorderColor};
          background-color: #${theme.hoverBackground};
        }
        .form .checkbox[selected = "true"] {
          background-color: #${theme.accentColor} !important;
          border-color: #${theme.accentColor} !important;
          color: #${theme.backgroundColor} !important;
        }

        .form .element .p-radiobutton.p-component {
          border-color: #${theme.borderColor};
          background-color: #${theme.inputBaseBackground};
          box-shadow: 0px ${theme.shadowSize * 1.5}px ${theme.shadowSize * 2.5}px rgba(0, 0, 0, ${0.2 + theme.shadowSize * 0.01});
        }
        .form .element .p-radiobutton.p-component:hover {
          border-color: #${theme.hoverBorderColor};
          background-color: #${theme.hoverBackground};
        }
        .form .element .p-radiobutton-checked.p-component {
          background-color: #${theme.accentColor} !important;
          border-color: #${theme.accentColor} !important;
        }

        .form .element .p-checkbox.p-component {
          border-color: #${theme.borderColor};
          background-color: #${theme.inputBaseBackground};
          box-shadow: 0px ${theme.shadowSize * 1.5}px ${theme.shadowSize * 2.5}px rgba(0, 0, 0, ${0.2 + theme.shadowSize * 0.01});
        }
        .form .element .p-checkbox.p-component:hover {
          border-color: #${theme.hoverBorderColor};
          background-color: #${theme.hoverBackground};
        }
        .form .element .p-checkbox-checked.p-component {
          background-color: #${theme.accentColor} !important;
          border-color: #${theme.accentColor} !important;
        }

        .form .scale-button {
          background-color: #${theme.inputBaseBackground} !important;
          border-color: #${theme.borderColor} !important;
          color: #${theme.textColor} !important;
          box-shadow: 0px ${theme.shadowSize * 1.5}px ${theme.shadowSize * 2.5}px rgba(0, 0, 0, ${0.2 + theme.shadowSize * 0.01}) !important;
        }
        .form .scale-button:hover {
          background-color: #${theme.hoverBackground} !important;
          border-color: #${theme.hoverBorderColor} !important;
          color: #${theme.textColor} !important;
        }
        .form .scale-button.chosen {
          background-color: #${theme.accentColor} !important;
          border-color: #${theme.accentColor} !important;
          color: #${theme.backgroundColor} !important;
        }

        .form .star {
          color: #${theme.accentColor};
          fill: #${theme.inputBaseBackground};
        }
        .form .star:hover {
          color: #${theme.accentColor} !important;
          fill: #${theme.accentColor} !important;
        }
        .form .star svg[selected="true"] {
          color: #${theme.accentColor} !important;
          fill: #${theme.accentColor} !important;
        }

        .form input[type="range"] {
          -webkit-appearance: none;
          appearance: none; 
          width: 100%;
          height: 6px;
          border-radius: 15px;
          background: #${theme.inputBaseBackground};
          cursor: pointer;
          outline: none;
        }

        .form input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none; 
          height: 15px;
          width: 15px;
          background-color: #${theme.accentColor};
          border-radius: 50%;
          border: none;
          transition: .2s ease-in-out;
        }

        .form input[type="range"]::-moz-range-thumb {
          height: 15px;
          width: 15px;
          background-color: #${theme.accentColor};
          border-radius: 50%;
          border: none;
          transition: .2s ease-in-out;
        }

        .form input[type="range"]::-webkit-slider-thumb:hover {
          box-shadow: 0 0 0 10px rgba(${theme.accentColor}, .1);
        }

        .form input[type="range"]:active::-webkit-slider-thumb {
          box-shadow: 0 0 0 13px rgba(${theme.accentColor}, .2);
        }

        .form input[type="range"]:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 13px rgba(${theme.accentColor}, .2);
        }

        .form input[type="range"]::-moz-range-thumb:hover {
          box-shadow: 0 0 0 10px rgba(${theme.accentColor}, .1);
        }

        .form input[type="range"]:active::-moz-range-thumb {
          box-shadow: 0 0 0 13px rgba(${theme.accentColor}, .2);
        }

        .form input[type="range"]:focus::-moz-range-thumb {
          box-shadow: 0 0 0 13px rgba(${theme.accentColor}, .2);
        }


        .form .input svg {
          color: #${theme.textColor};
        }
        
      `;

    }
  },

  // Watch for changes in form
  watch: {
    form: {
      deep: true,
      handler() {
        console.log('FormPreview.vue: watch form - received form.elements order:', JSON.stringify(this.form.elements.map(el => el.id)));
        this.$nextTick(() => {
          // Wait two ticks to ensure DOM is fully updated
          this.$nextTick(() => {
            this.updateSelector();
          });
        });
      }
    },
    'form.theme': {
      handler(newTheme) {
        if(newTheme) {
          this.updateTheme(newTheme);
        }
        setTimeout(() => {
          // Add a small delay to allow transitions to finish
          this.updateSelector();
        }, 120); // Adjust the delay as needed
      },
      deep: true,
      immediate: true
    },
    'form.css': {
      handler(newCSS) {
        this.updateCSS();
        this.updateSelector();
      },
      deep: true,
      immediate: true
    }
  },

  mounted() {

    // Check if scroll
    document.getElementById('formContainer').onscroll = () => {
      this.$nextTick(() => {
        this.updateSelector();
      });
    }

    // Check if resize screen
    window.onresize = () => {
      this.$nextTick(() => {
        this.updateSelector();
      });
    }

    // Wait a tick then update theme
    this.$nextTick(() => {
      this.updateTheme(this.form.theme);
      this.updateCSS();
    });

    // Initialize SortableJS
    if (this.$refs.form) {
      new Sortable(this.$refs.form, {
        animation: 150,
        handle: '.drag-handle',
        onStart: () => {
          this.isDragging = true;
        },
        onEnd: (evt) => {
          const elementToMove = this.form.elements.splice(evt.oldIndex, 1)[0];
          this.form.elements.splice(evt.newIndex, 0, elementToMove);
          this.$emit('reorder', this.form.elements);
          
          this.isDragging = false;
          this.$nextTick(() => {
            this.updateSelector();
          });
        },
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
      });
    }

  }
}
</script>

<style>

/* Style */
.input-border {
}
.input-color {
  @apply
  text-neutral-300
  bg-neutral-800
}
.placeholder {
  @apply
  !text-neutral-500
  text-sm
}
.input-border:hover {
  @apply
  border-neutral-700;
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
  bg-neutral-900
  !border-neutral-700
  rounded-md
  input-border;
}
.dropdown-option {
  @apply
  text-neutral-400
  hover:text-neutral-200
  hover:!bg-neutral-800
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
  text-neutral-800
  font-bold;
}

/* Paragraph */
p {
  @apply
  leading-relaxed;
}

/* Divider */
.divider {
  @apply
  border-t
  border-neutral-200
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
  w-full
  transition-all
}
.p-inputnumber input {
  @apply rounded-sm transition-all duration-150;
}
.p-inputnumber-increment-button, .p-inputnumber-decrement-button {
  @apply 
  rounded-sm 
  m-1.5
  text-neutral-700;
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
  border-neutral-400
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
  input-color
}
.p-select-list-container {
  @apply
  mt-1
  border
  dropdown;
}
.p-select-list-container .p-select-option {
  @apply 
  dropdown-option
}
.p-select-option.p-focus {
  @apply 
  !bg-neutral-800
  !text-neutral-200;
}
.p-select-option-selected {
  @apply 
  bg-neutral-800
  !text-neutral-200;
}

/* Multiselect */
.p-multiselect.p-inputwrapper {
  @apply 
  input-border
  shadow
  transition
  padding
  bg-neutral-50;
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
  text-neutral-600
  hover:text-neutral-900
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
  text-neutral-500;
}

/* Star rating */
.p-rating-option {
  @apply 
  pr-2
}
</style>