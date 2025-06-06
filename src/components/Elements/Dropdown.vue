<template>

  <div>
    <div ref="element" class="my-6">
      <p @input="handleQuestionChange" ref="question" class="edit-text parent question w-full" v-text="element.question" v-once/>
      <Select
        v-if="!element.multiselect"
        class="w-full"
        :options="element.answers"
        :placeholder="element.placeholder"
        v-model="value"
      />
      <MultiSelect
        v-else
        class="w-full"
        :options="element.answers"
        :placeholder="element.placeholder"
        v-model="value"
      />
    </div>
  </div>
  
</template>
  
<script>
  import Select from '../Inputs/Select.vue';
  import AddButton from '../MenuParts/AddButton.vue';
  import RemoveButton from '../MenuParts/RemoveButton.vue';
  import MultiSelect from '../Inputs/MultiSelect.vue';


  export default {
    name: 'Dropdown',
    components: {
      Select,
      AddButton,
      RemoveButton,
      MultiSelect,
    },
    props: {
      element: {
        type: Object,
        required: true,
      },
      selected: {
        type: Boolean,
        required: true,
      }
    },
    data() {
      return {
        value: null,
        localAnswers: [],
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
      
      handleChange() {
        this.$emit('change', {
          elementId: this.element.id,
          type: 'questionChange'
        });
      },
      
      addAnswer() {
        if(!this.element.answers) {
          this.element.answers = [];
        }
        
        // Create a new array instead of mutating the existing one
        const newAnswers = [...this.element.answers, 'New answer'];
        
        // Update both the element and local answers
        this.element.answers = newAnswers;
        this.localAnswers = [...newAnswers];
        
        // Emit change event with element identification
        this.$emit('change', {
          elementId: this.element.id,
          type: 'addAnswer'
        });
      },
      removeAnswer(index) {
        // Don't allow removing the last answer
        if (this.localAnswers.length <= 1) {
          return;
        }
        
        // Create a new array without the removed answer
        const newAnswers = [...this.localAnswers];
        newAnswers.splice(index, 1);
        
        // Update both the element and local answers
        this.element.answers = [...newAnswers];
        this.localAnswers = newAnswers;
        
        // Emit change event with element identification
        this.$emit('change', {
          elementId: this.element.id,
          type: 'removeAnswer'
        });
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
    },
    mounted() {
      // Initialize local answers with a copy of element answers
      this.localAnswers = [...(this.element.answers || [])];
      
      this.updateCustomMenu();
      window.addEventListener('resize', this.updateCustomMenu);
      const contentElement = document.getElementById('content');
      if (contentElement) {
        contentElement.addEventListener('scroll', this.updateCustomMenu);
      }
    },
    watch: {
      element: {
        handler(newVal) {
          this.$nextTick(() => {
            this.updateCustomMenu();
            
            // Keep local answers in sync with element answers
            if (newVal.answers && JSON.stringify(this.localAnswers) !== JSON.stringify(newVal.answers)) {
              this.localAnswers = [...newVal.answers];
            }
          });
        },
        deep: true,
      },
      value: {
        immediate: true,
        handler(newVal) {
          this.$emit('input', newVal);
        }
      }
    }
  }
  </script>