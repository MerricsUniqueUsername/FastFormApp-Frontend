<template>

  <div>
    <!-- Custom menu -->
    <div ref="custom_menu" v-show="selected" class="fixed pointer-events-none z-10">
      
      <!-- Inputs -->
      <div class="absolute bottom-0 left-[50%] translate-y-full -translate-x-1/2 pointer-events-auto text-white w-full border border-gray-400 rounded-sm">
        <div class="w-full" @input="handleChange" v-for="(answers, index) in element.answers" :key="index" type="text">
          <RemoveButton @click="removeAnswer(index)" class="absolute -translate-x-full translate-y-1/2" />
          <input class="p-1 w-full text-black border-t border-t-gray-200" v-model="element.answers[index]">
        </div>
        <AddButton class="translate-y-full bottom-0 absolute -translate-x-1/2 left-[50%] pointer-events-auto" @click="addAnswer" />
      </div>

    </div>

    <div ref="element" class="my-6">
      <p @input="handleChange" ref="question" class="edit-text parent question" v-text="element.question"/>
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
      }
    },
    emits: ['change', 'input'],
    methods: {
      handleChange() {
        this.$emit('change');
      },
      addAnswer() {
        if(!this.element.answers) {
          this.element.answers = [];
        }
        this.element.answers.push('New answer');
        this.handleChange();
      },
      removeAnswer(index) {
        this.element.answers.splice(index, 1);
        this.handleChange();
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