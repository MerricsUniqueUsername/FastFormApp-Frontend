<template> 
  <div ref="element" class="cursor-default parent" :class="{'selected' : selected}">
    <Header1 
      v-if="element.type === 'h1'" 
      :element="element" 
      :selected="selected"
    />
    <Paragraph 
      v-if="element.type === 'p'" 
      :element="element" 
      :selected="selected"
    />
    <Divider
      v-if="element.type === 'divider'" 
      :element="element" 
      :selected="selected"
    />
    <ShortResponse 
      v-if="element.type === 'short-response'" 
      :element="element" 
      :selected="selected"
    />
    <LongResponse 
      v-if="element.type === 'long-response'" 
      :element="element" 
      :selected="selected"
    />
    <MultipleChoice 
      v-if="element.type === 'radio'" 
      :multiselect="false"
      :element="element" 
      :selected="selected"
      @change="loadElements"
    />
    <MultipleChoice 
      v-if="element.type === 'checkbox'" 
      :multiselect="true"
      :element="element" 
      :selected="selected"
      @change="loadElements"
    />
    <Number 
      v-if="element.type === 'number'" 
      :element="element" 
      :selected="selected"
      @change="loadElements"
    />
    <Dropdown
      v-if="element.type === 'dropdown'" 
      :element="element" 
      :selected="selected"
      @change="loadElements"
    />
    <Email
      v-if="element.type === 'email'" 
      :element="element" 
      :selected="selected"
      @change="loadElements"
    />
    <PhoneNumber
      v-if="element.type === 'phone-number'" 
      :element="element" 
      :selected="selected"
      @change="loadElements"
    />
    <Date
      v-if="element.type === 'date'" 
      :element="element" 
      :selected="selected"
      @change="loadElements"
    />
    <LinearScale
      v-if="element.type === 'linear-scale'" 
      :element="element" 
      :selected="selected"
      @change="loadElements"
    />
    <Slider
      v-if="element.type === 'slider'"
      :element="element" 
      :selected="selected"
      @change="loadElements"
    />
    <Rating
      v-if="element.type === 'rating'"
      :element="element"
      :selected="selected"
      @change="loadElements"
    />
  </div>

</template>

<script>
import Header1 from './Elements/Header1.vue';
import Paragraph from './Elements/Paragraph.vue';
import Divider from './Elements/Divider.vue';
import ShortResponse from './Elements/ShortResponse.vue';
import LongResponse from './Elements/LongResponse.vue';
import MultipleChoice from './Elements/MultipleChoice.vue';
import Number from './Elements/Number.vue';
import Dropdown from './Elements/Dropdown.vue';
import Email from './Elements/Email.vue';
import PhoneNumber from './Elements/PhoneNumber.vue';
import Date from './Elements/Date.vue';
import LinearScale from './Elements/LinearScale.vue';
import Slider from './Elements/Slider.vue';
import Rating from './Elements/Rating.vue';

export default {
  name: 'FormElement',
  components: {
    Header1,
    Paragraph,
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
    Rating,
    Divider,
  },
  data() {
    return {
      selected: false,
    }
  },
  emits: ['select', 'change'],
  props: {
    element: {
      type: Object,
      required: true,
    },
    editing: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    loadElements(unselectHTML) {

      // Change
      this.$emit('change', unselectHTML)
    }
  },
  mounted() {
    if(this.editing) {

      // Edit if in editing mode
      this.$refs.element.addEventListener('mousedown', (event) => {

        // Make all 'edit-text' class elements editable
        const editTextElements = this.$refs.element.querySelectorAll('.edit-text');
        editTextElements.forEach((element) => {
          element.setAttribute('contenteditable', true);
        });

        // Set selected HTML to parent element
        let htmlTarget = event.target;
        try {
          while(!htmlTarget.classList.contains('parent')) {
            htmlTarget = htmlTarget.parentElement;
          }
        } catch(e) {}

        this.$emit('select', this.element, htmlTarget);
      });
    }

    this.loadElements();
  }
}
</script>

<style scoped>
.selected {
  @apply cursor-auto;
}
</style>