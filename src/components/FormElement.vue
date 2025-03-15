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
    }
  },
  emits: ['select', 'change', 'input'],
  data() {
    return {
      selected: false,
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
     *
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
    }
  },
  mounted() {
    this.setupEditMode()
    this.loadElements()
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
    }
  }
}
</script>

<style scoped>
.selected {
  @apply cursor-auto;
}
</style>