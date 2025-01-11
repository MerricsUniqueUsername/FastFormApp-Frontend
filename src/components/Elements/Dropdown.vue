<template>

  <!-- Custom menu -->
  <div ref="custom_menu" v-show="selected" class="fixed pointer-events-none">
    
    <!-- Inputs -->
    <div class="absolute bottom-0 left-[50%] translate-y-full -translate-x-1/2 pointer-events-auto text-white w-full">
      <div class="w-full" @input="handleChange" v-for="(option, index) in element.options" :key="index" type="text">
        <RemoveButton @click="removeAnswer(index)" class="absolute -translate-x-full translate-y-1/2" />
        <input class="p-1 w-full" v-model="element.options[index]">
      </div>
      <AddButton class="translate-y-full bottom-0 absolute -translate-x-1/2 left-[50%] pointer-events-auto" @click="addAnswer" />
    </div>

  </div>

    <div ref="element" class="my-6">
      <p @input="handleChange" ref="question" class="edit-text parent" v-text="element.question"/>
      <Select
        v-if="!element.multiselect"
        class="w-full"
        :options="element.options"
        :placeholder="element.placeholder"
      />
      <MultiSelect
        v-else
        class="w-full"
        :options="element.options"
        :placeholder="element.placeholder"
      />
    </div>
  
</template>
  
<script>
  import Select from 'primevue/select';
  import AddButton from '../MenuParts/AddButton.vue';
  import RemoveButton from '../MenuParts/RemoveButton.vue';
  import MultiSelect from 'primevue/multiselect';


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
    emits: ['change'],
    methods: {
      handleChange() {
        this.$emit('change');
        this.updateCustomMenu();
      },
      addAnswer() {
        this.element.options.push('New answer');
        this.handleChange();
      },
      removeAnswer(index) {
        this.element.options.splice(index, 1);
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
      window.addEventListener('scroll', this.updateCustomMenu);
    }
  }
  </script>