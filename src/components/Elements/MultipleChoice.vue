<template>
  <!-- Custom menu -->
  <div ref="custom_menu" v-show="selected" class="fixed pointer-events-none">
    <AddButton @click="addAnswer" class="absolute bottom-0 left-[50%] translate-y-full -translate-x-1/2 pointer-events-auto" />
  </div>

  <div ref="element" class="my-6">
    <p @input="handleQuestionChange" ref="question" class="edit-text parent" v-text="element.question"/>

    <div ref="answer" v-for="(answer, index) in element.answers" :key="index" class="flex items-center gap-2">

      <!-- Single select -->
      <RadioButton v-if="!multiselect" :id="'radio-' + index" name="color" :value="answer" v-model="value" />
      <p v-if="!multiselect" @input="handleAnswerChange(index, $event.target)" class="parent w-full edit-text" :for="'radio-' + index">{{ answer }}</p>

      <!-- Multi select -->
      <Checkbox v-if="multiselect" :id="'checkbox-' + index" :value="answer" v-model="value" />
      <p v-if="multiselect" @input="handleAnswerChange(index, $event.target)" class="parent w-full edit-text" :for="'checkbox-' + index">{{ answer }}</p>

      <RemoveButton v-if="selected" @click="removeAnswer(index)" class="pointer-events-auto absolute" />
    </div>
  </div>
</template>

<script>
import RadioButton from 'primevue/radiobutton';
import Checkbox from 'primevue/checkbox';
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
      value: null,
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
  emits: ['change'],
  methods: {
    handleQuestionChange() {
      const value = this.$refs.question.innerText;
      this.element.question = value;
      this.$emit('change');
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
      this.element.answers.push('New answer');

      // Wait for the DOM to update
      this.$nextTick(() => {
        this.$emit('change');
      });
    },
    removeAnswer(index) {
      if (this.element.answers.length > 1) {
        this.element.answers.splice(index, 1);
      }
      this.$nextTick(() => {
        this.$emit('change', 'true');
      });
    },
  },
  mounted() {

    // Load custom menu
    this.updateCustomMenu();
    window.addEventListener('resize', this.updateCustomMenu);
    document.getElementById('content').addEventListener('scroll', this.updateCustomMenu);
  },
  watch: {
    element: {
      handler() {
        this.$nextTick(() => {
          this.updateCustomMenu();
        });
      },
      deep: true,
    }
  }
};
</script>
