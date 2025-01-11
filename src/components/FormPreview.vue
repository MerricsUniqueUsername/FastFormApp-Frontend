<template>

  <!-- Selector for element -->
  <div ref="outline" class="fixed border border-dashed z-20 border-gray-500 pointer-events-none"></div>

  <!-- Selector for HTML element -->
  <div ref="html_outline" v-show="selectedHTMLElement" class="fixed border z-30 border-blue-400 pointer-events-none"></div>

  <!-- Content -->
  <div class="w-2/3 bg-gray-100">
    <div class="p-4">

      <!-- Form -->
      <div ref="form" class="text-black m-16">

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
    window.onscroll = () => {
      this.updateSelector();
    }

    // Check if resize screen
    window.onresize = () => {
      this.updateSelector();
    }

  }
}
</script>