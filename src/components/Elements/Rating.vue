<template>

  <!-- Custom menu -->
  <div ref="custom_menu" v-show="selected" class="fixed pointer-events-none">
    <div class="absolute bottom-0 left-[50%] translate-y-full -translate-x-1/2">
      <AddButton @click="add" class="pointer-events-auto" />
      <RemoveButton @click="remove" class="absolute left-0 top-[50%] -translate-y-1/2 -translate-x-full pointer-events-auto" />
    </div>
  </div>

  <div ref="element" class="my-6">
    <p @input="handleChange" ref="question" class="edit-text parent" v-text="element.question"/>
    <Rating v-model="value" :stars="element.num" class="my-2" />
  </div>

</template>

<script>
import Rating from 'primevue/rating';
import AddButton from '../MenuParts/AddButton.vue';
import RemoveButton from '../MenuParts/RemoveButton.vue';

export default {
  name: 'Rate',
  components: {
    Rating,
    AddButton,
    RemoveButton,
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
      value: 0,
    }
  },
  emits: ['change'],
  methods: {
    add() {
      if(this.element.num >= 10) return;
      this.element.num++;
      this.handleChange();
    },
    remove() {
      if(this.element.num <= 2) return;
      this.element.num--;
      this.handleChange();
    },
    handleChange() {
      const value = this.$refs.question.innerText;
      this.element.question = value;
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
  },
  mounted() {
    this.updateCustomMenu();
    window.addEventListener('resize', this.updateCustomMenu);
    document.getElementById('content').addEventListener('scroll', this.updateCustomMenu());
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
}
</script>