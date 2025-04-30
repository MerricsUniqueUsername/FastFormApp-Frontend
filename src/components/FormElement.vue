<template>
  <div ref="element" class="cursor-default parent" :class="{'selected': selected}">
    <component 
      :is="componentMap[element.type]" 
      v-if="componentMap[element.type]"
      :element="element"
      :selected="selected"
      :multiselect="element.type === 'checkbox'"
      @change="loadElements"
      @input="input"
      ref="component"
      class="element"
    />
  </div>
</template>

<script>
import Header1 from './Elements/Header1.vue'
import Paragraph from './Elements/Paragraph.vue'
import Divider from './Elements/Divider.vue'
import ShortResponse from './Elements/ShortResponse.vue'
import LongResponse from './Elements/LongResponse.vue'
import MultipleChoice from './Elements/MultipleChoice.vue'
import Number from './Elements/Number.vue'
import Dropdown from './Elements/Dropdown.vue'
import Email from './Elements/Email.vue'
import PhoneNumber from './Elements/PhoneNumber.vue'
import Date from './Elements/Date.vue'
import LinearScale from './Elements/LinearScale.vue'
import Slider from './Elements/Slider.vue'
import Rating from './Elements/Rating.vue'

export default {
  name: 'FormElement',
  components: {
    Header1,
    Paragraph,
    Divider,
    ShortResponse,
    LongResponse,
    MultipleChoice,
    Number,
    Dropdown,
    Email,
    PhoneNumber,
    Date,
    LinearScale,
    Slider,
    Rating
  },
  props: {
    element: {
      type: Object,
      required: true
    },
    editing: {
      type: Boolean,
      default: false
    },
    view: {
      type: Boolean,
      default: false
    }
  },
  emits: ['select', 'change', 'input'],
  data() {
    return {
      firstLoad: false,
      selected: false,
      htmlStructure: null,
      value: "",
      componentMap: {
        'h1': 'Header1',
        'p': 'Paragraph',
        'divider': 'Divider',
        'short-response': 'ShortResponse',
        'long-response': 'LongResponse',
        'radio': 'MultipleChoice',
        'checkbox': 'MultipleChoice',
        'number': 'Number',
        'dropdown': 'Dropdown',
        'email': 'Email',
        'phone-number': 'PhoneNumber',
        'date': 'Date',
        'linear-scale': 'LinearScale',
        'slider': 'Slider',
        'rating': 'Rating'
      }
    }
  },
  methods: {

    /**
     * Handles input change
     */
    input(value) {
      this.value = value;
    },

    /**
     * Loads element
     */
    loadElements(unselectHTML) {
      this.$emit('change', unselectHTML)
    },

    /**
     * Makes all things avaliable that are in edit mode
     */
    setupEditMode() {
      if (!this.editing) return

      this.$refs.element.addEventListener('mousedown', this.handleMouseDown)
    },

    /**
     * Handle mouse for editing
     */
    handleMouseDown(event) {

      // Check if editing
      if (!this.editing) return event.preventDefault() // Prevent default behaviour (like link click)

      // Make all 'edit-text' class elements editable
      this.$refs.element.querySelectorAll('.edit-text')
        .forEach(element => element.setAttribute('contenteditable', true))

      // Find parent element with 'parent' class
      let htmlTarget = event.target
      while (htmlTarget && !htmlTarget.classList.contains('parent')) {
        htmlTarget = htmlTarget.parentElement
      }

      if (htmlTarget) {
        this.$emit('select', this.element, htmlTarget)
      }
    },


    /**
     * Distribute all givenClass and givenId to their elements
     */
    distributeAttributes() {
      this.element.classIdPaths.forEach((item) => {
        const element = this.locateElement(item.path)
        if (element) {
          if (item.givenClass) {
            // Get the previous givenClass value
            const previousGivenClass = element.getAttribute('givenClass');
            
            // Update the givenClass attribute
            element.setAttribute('givenClass', item.givenClass);
            
            // If there was a previous givenClass, replace the last occurrence with the new one
            if (previousGivenClass && element.className.includes(previousGivenClass)) {
              // Find the last occurrence of previousGivenClass in the className string
              const lastIndex = element.className.lastIndexOf(previousGivenClass);
              
              if (lastIndex !== -1) {
                // Replace only the last occurrence
                const beforePart = element.className.substring(0, lastIndex);
                const afterPart = element.className.substring(lastIndex + previousGivenClass.length);
                element.className = beforePart + item.givenClass + afterPart;
              }
            } else {
              // If no previous givenClass or it's not in the class string, just append
              element.className += ' ' + item.givenClass;
            }
            
            // Clean up any double spaces that might occur
            element.className = element.className.replace(/\s+/g, ' ').trim();
          }
          
          if (item.givenId) {
            element.setAttribute('givenId', item.givenId);
            element.id = item.givenId; // Set id to givenId value
          }
        }
      });
    },

    /**
     * Update HTML structure
     */
    updateHTMLStructure() {
      if(this.view || !this.firstLoad) {
        this.firstLoad = true
        return
      }
      this.element.classIdPaths = this.getHTMLStructure(this.$refs.element)
    },

    /**
     * Locate an HTML element with a path
     * @param path - Path to the element in the HTML structure as array of numbers
     * @return {Element} - The target element at the specified path
     */
    locateElement(path) {
      let currentNode = this.$refs.element;

      for(let i = 0; i < path.length; i++) {
        currentNode = currentNode.children[path[i]];
      }
      return currentNode;
    },


    /**
     * Get paths to elements with givenClass or givenId attributes
     * @param {Element} element - Root DOM element to scan
     * @return {Array} Array of objects containing path arrays and attribute values
     */
    getHTMLStructure(element) {
      const results = [];
      
      // Recursive function to process nodes and build paths
      function processNode(node, currentPath = []) {
        // Skip non-element and comment nodes
        if (node.nodeType !== Node.ELEMENT_NODE || node.nodeType === Node.COMMENT_NODE) {
          return;
        }
        
        // Check if this node has either givenClass or givenId
        const givenClass = node.attributes['givenClass'] ? node.attributes['givenClass'].value : '';
        const givenId = node.attributes['givenId'] ? node.attributes['givenId'].value : '';
        
        // If node has either attribute, add it to results
        if (givenClass || givenId) {
          results.push({
            path: [...currentPath],
            givenClass,
            givenId
          });
        }
        
        // Process children with updated path
        const children = Array.from(node.childNodes).filter(child => 
          child.nodeType === Node.ELEMENT_NODE
        );
        
        children.forEach((child, index) => {
          processNode(child, [...currentPath, index]);
        });
      }
      
      // Start processing from the root
      processNode(element);
      
      return results;
    }
  },
  mounted() {
    this.setupEditMode()
    this.loadElements()
    this.$nextTick(() => {
      this.updateHTMLStructure();
      this.distributeAttributes()
    })
  },
  beforeUnmount() {
    // Clean up event listener
    if (this.editing) {
      this.$refs.element.removeEventListener('mousedown', this.handleMouseDown)
    }
  },

  // Watch for value to change
  watch: {
    value: {
      handler(newVal) {
        this.$emit('input')
      },
      deep: true
    },
    // Watch for element type to change
    element: {
      handler(newVal) {
        this.$nextTick(() => {
          this.$emit('change');
          this.distributeAttributes();
        })
      },
      deep: true
    },
  }
}
</script>

<style scoped>
.selected {
  @apply cursor-auto;
}
</style>

<style>
[contenteditable="true"] {
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;   /* for old support */
  overflow-wrap: break-word; /* modern browsers including Firefox */
}
</style>