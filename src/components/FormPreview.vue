<template>

  <!-- Selector for element -->
  <div ref="outline" class="fixed border border-dashed z-20 border-gray-500 pointer-events-none"></div>

  <!-- Selector for HTML element -->
  <div ref="html_outline" v-show="selectedHTMLElement" class="fixed border z-30 border-blue-400 pointer-events-none"></div>

  <!-- Content -->
  <div class="w-2/3 h-full bg-gray-100 overflow-y-auto" id="content">
    <div class="p-4 m-5 bg-white rounded-md shadow-sm border border-gray-300">

      <!-- Form -->
      <div ref="form" class="text-black m-16 relative">

        <!-- Form elements -->
        <FormElement 
          @select="selectElement"
          @change="handleChange"
          :editing="true" 
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
  input-border
  shadow
  transition
  padding
  input-color
  w-full;
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
  bg-gray-200
  accent-black
  w-[50%];
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