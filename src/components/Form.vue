<template>
  <div class="fixed w-screen h-screen overflow-auto bg-white z-50 formContainer">

    <!-- Close button -->
    <button class="absolute top-0 right-0 p-2" @click="$emit('close')">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
      </svg>
    </button>

    <!-- Form -->
    <div ref="form" class="p-4 text-black m-16 relative form">

      <!-- Form elements -->
      <FormElement
        :editing="false" 
        v-for="(element, index) in form.elements" 
        :key="index" 
        :element="element" 
        ref="form_element"
        @input="updateAnswers"
      />
        
    </div>
  </div>
</template>

<script>
import FormElement from './FormElement.vue'

export default {
  name: 'FormView',
  components: {
    FormElement,
  },
  emits: ['close'],
  props: {
    form: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      variables: [],
      answers: {},
      variableAnswers: {},
    }
  },

  methods: {

    /**
     * Update answers and variable answers for form
     */
    updateAnswers() {
      this.form.elements.forEach((element) => {

        try {
          // Find the correct form element in refs
          let formElementRef = this.$refs.form_element.find(ref => ref.element.id === element.id);

          if (formElementRef) {
            this.answers[element.id] = formElementRef.value;

            // Update variableAnswers JSON if the element has a name
            if (element.name) {
              this.variableAnswers[element.name] = formElementRef.value;
            }
          }
        } catch {}
      });
    },

    
    /**
     * Update variable list
     */
    getVariables() {
      const variables = new Set();

      this.form.elements.forEach((element) => {
        if(element.name)
          variables.add(element.name);
      });

      this.variables = Array.from(variables);
    },

    /**
     * Load answer JSON
     */
    loadAnswerJSON() {
      this.form.elements.forEach((element) => {
        this.answers[element.id] = '';
        if(element.name) {
          this.variableAnswers[element.name] = '';
        }
      });
    },

    /**
     * Replace all {variable_name} text with a span that holds the text of the variable name from the variableAnswers json
     */
     loadVariablesTextInput() {

      // Get all HTML elements from the form
      var form = this.$refs.form;
      var elements = form.querySelectorAll('*');

      // Loop through the elements
      for (var i = 0; i < elements.length; i++) {

        // Get the child nodes
        var element = elements[i];
        var childNodes = element.childNodes;
        
        // Loop through child nodes
        for (var j = 0; j < childNodes.length; j++) {
          var node = childNodes[j];
          
          if (node.nodeType === Node.TEXT_NODE) {

            // Put HTML in span
            node.nodeValue = node.nodeValue.replace(/\{([^{}]+)\}/g, '<span>{$1}</span>');
            
            // Get the wrapper
            var spanWrapper = document.createElement('span');
            spanWrapper.innerHTML = node.nodeValue;
            element.replaceChild(spanWrapper, node);

            // Loop through spans in the wrapper
            var spans = spanWrapper.querySelectorAll('span');
            for (var k = 0; k < spans.length; k++) {

              // Get the variable name
              var span = spans[k];
              var variableData = span.textContent.replace('{', '').replace('}', '').trim();

              // Split variable name by ":" {variable_name : default}
              var parts = variableData.split(':');
              var variableName = parts[0];
              var defaultData = parts.length > 1 ? parts[1] : '';
              
              span.setAttribute('variable_name', variableName.trim());
              span.setAttribute('default', defaultData.trim());
            }
          }
        }
      }
    },

    /**
     * Update reactive text with the variable values
     */
    updateReactiveText() {
      
      // Get all spans in DOM with a variable name
      var spans = document.querySelectorAll('[variable_name]');
      
      // Loop through the spans and assign their text
      for (var i = 0; i < spans.length; i++) {
        var span = spans[i];
        var variableName = span.getAttribute('variable_name');
        var defaultValue = span.getAttribute('default');
        var value = this.variableAnswers[variableName] || defaultValue;
        span.textContent = value;
      }
    },

    /**
     * Determine which questions are visible
     */
    updateVisibleQuestions() {
      var elements = this.$refs.form_element;
      for(var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var htmlElement = element.$el;
        var conditionGroups = element.element.conditions;

        // Check if all conditions are met
        if(conditionGroups.length > 0) {
          var visible = this.evaluateConditions(conditionGroups, this.variableAnswers);
          if(visible) {
            htmlElement.style.display = '';
          }
          else {
            htmlElement.style.display = 'none';
          }
        }
      }
    },

    /**
     * Check if conditions are met for a set of conditions and data
     */
    evaluateConditions(conditionGroups, data) {

      // If no condition groups, return true
      if (!conditionGroups || conditionGroups.length === 0) {
        return true;
      }

      // Evaluate each group and combine results
      return conditionGroups.every(group => {
        // Get results for all conditions in the group
        const conditionResults = group.conditions.map(condition => {
          const fieldValue = data[condition.field];
          const targetValue = condition.value;

          // Convert values to numbers if they're numeric strings
          const numericField = !isNaN(fieldValue) ? Number(fieldValue) : fieldValue;
          const numericTarget = !isNaN(targetValue) ? Number(targetValue) : targetValue;

          switch (condition.operator) {
            case 'equals':
              return numericField === numericTarget;
            case 'not_equals':
              return numericField !== numericTarget;
            case 'greater_than':
              return numericField > numericTarget;
            case 'less_than':
              return numericField < numericTarget;
            default:
              console.warn(`Unknown operator: ${condition.operator}`);
              return false;
          }
        });

        // Combine results based on group operator
        if (group.operator === 'AND') {
          return conditionResults.every(result => result);
        } else if (group.operator === 'OR') {
          return conditionResults.some(result => result);
        }
        
        // Default to false if no conditions are met
        console.warn('No conditions found for group');
        return false;
      });
    }

  },

  mounted() {

    // Load variables
    this.getVariables();

    // Load answers JSON
    this.loadAnswerJSON();

    // Load variable text inputs
    this.loadVariablesTextInput(this.variables);
  },

  /**
   * Watch for variable changes 
   */
  watch: {
    variableAnswers: {
      deep: true,
      handler() {
        this.updateReactiveText();
        this.updateVisibleQuestions();
      }
    }
  }
}
</script>