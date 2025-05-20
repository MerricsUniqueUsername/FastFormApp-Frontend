<template>
  <div>
    <!-- Custom menu -->
<!--    <div ref="custom_menu" v-show="selected" class="fixed pointer-events-none">-->
<!--      <AddButton @click="addAnswer" class="absolute bottom-0 left-[50%] translate-y-full -translate-x-1/2 pointer-events-auto" />-->
<!--    </div>-->

    <div ref="element" class="my-6 w-full">
      <p @input="handleQuestionChange" ref="question" class="edit-text parent question w-full" v-text="element.question" v-once/>

      <div ref="answer" v-for="(answer, index) in element.answers" :key="index" class="flex items-center gap-2 select parent w-full">
        <RadioButton 
          v-if="!multiselect" 
          :id="'radio-' + index" 
          name="multiple-choice" 
          :value="answer" 
          v-model="value" 
          class="mt-1"
        />
        <Checkbox 
          v-if="multiselect" 
          :id="'checkbox-' + index" 
          :value="answer" 
          :modelValue="isValueSelected(answer)"
          @update:modelValue="toggleValue(answer)"
          class="mt-1"
        />
<!--        <RemoveButton v-if="selected" @click="removeAnswer(index)" class="pointer-events-auto absolute" />-->
      </div>
    </div>
  </div>
</template>

<script>
import RadioButton from '../Inputs/Radio.vue';
import Checkbox from '../Inputs/Checkbox.vue';
import AddButton from '../MenuParts/AddButton.vue';
import RemoveButton from '../MenuParts/RemoveButton.vue';

export default {
  name: 'MultipleChoice',
  components: {
    RadioButton,
    AddButton,
    RemoveButton,
    Checkbox,
  },
  data() {
    return {
      value: this.multiselect ? [] : null,
    };
  },
  props: {
    element: {
      type: Object,
      required: true,
    },
    selected: {
      type: Boolean,
      required: true,
    },
    multiselect: {
      type: Boolean,
      default: false,
    }
  },
  emits: ['change', 'input'],
  methods: {
    handleQuestionChange() {
      const value = this.$refs.question.innerText;
      this.element.question = value;
      this.$emit('change', {
        elementId: this.element.id,
        type: 'questionChange'
      });
    },
    handleAnswerChange(index, label) {
      this.element.answers[index] = label.innerText;
      this.$emit('change');
    },
    updateCustomMenu() {
      try {
        const customMenu = this.$refs.custom_menu;
        const element = this.$refs.element;
        const elementRect = element.getBoundingClientRect();

        customMenu.style.top = `${elementRect.top}px`;
        customMenu.style.left = `${elementRect.left}px`;
        customMenu.style.width = `${elementRect.width}px`;
        customMenu.style.height = `${elementRect.height}px`;
      } catch (error) {}  
    },
    addAnswer() {
      if(!this.element.answers) {
        this.element.answers = [];
      }
      
      // Create a new array instead of mutating the existing one
      const newAnswers = [...this.element.answers, 'New answer'];
      
      // Create a clone of the element to avoid modifying the original reference
      const updatedElement = {...this.element, answers: newAnswers};
      
      // Update the element with the new answers
      this.element.answers = newAnswers;
      
      // Wait for the DOM to update and pass the element's ID to identify which element changed
      this.$nextTick(() => {
        this.$emit('change', {
          elementId: this.element.id,
          type: 'addAnswer'
        });
      });
    },
    removeAnswer(index) {
      if (this.element.answers.length > 1) {
        // Create a new array without the removed answer
        const newAnswers = [...this.element.answers];
        newAnswers.splice(index, 1);
        
        // Update the element with the new answers
        this.element.answers = newAnswers;
      }
      
      this.$nextTick(() => {
        this.$emit('change', {
          elementId: this.element.id,
          type: 'removeAnswer'
        });
      });
    },
    // Helper methods for multiselect
    isValueSelected(val) {
      return this.multiselect ? this.value.includes(val) : this.value === val;
    },
    toggleValue(val) {
      if (this.multiselect) {
        if (this.value.includes(val)) {
          // Remove value if already selected
          this.value = this.value.filter(item => item !== val);
        } else {
          // Add value if not selected
          this.value = [...this.value, val];
        }
      } else {
        this.value = val;
      }
    }
  },
  created() {
    // Initialize value as an array when in multiselect mode
    if (this.multiselect && !Array.isArray(this.value)) {
      this.value = [];
    }
  },
  mounted() {
    // Load custom menu
    this.updateCustomMenu();
    window.addEventListener('resize', this.updateCustomMenu);
    document.getElementById('content').addEventListener('scroll', this.updateCustomMenu);

    this.$nextTick(() => {

      // Delete spans that find themself in here somehow if they do not have the class "needed"
      const spans = this.$refs.element.querySelectorAll('span:not(.needed)');
      spans.forEach(span => {
        if(span.textContent === '')
          span.remove();
      });
    });
  },
  watch: {
    element: {
      handler() {
        this.$nextTick(() => {
          this.updateCustomMenu();
        });
      },
      deep: true,
    },
    value: {
      immediate: true,
      handler(newVal) {
        this.$emit('input', newVal);
      }
    },
    multiselect: {
      immediate: true,
      handler(newVal) {
        // Reset value when switching between single/multi select modes
        this.value = newVal ? [] : null;
      }
    }
  }
};
</script>