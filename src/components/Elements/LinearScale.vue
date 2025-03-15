<template>

  <div>
    <!-- Custom menu -->
    <div ref="custom_menu" v-show="selected" class="fixed pointer-events-none">
      <div class="absolute bottom-0 left-[50%] translate-y-full -translate-x-1/2">
        <AddButton @click="add" class="pointer-events-auto" />
        <RemoveButton @click="remove" class="absolute left-0 top-[50%] -translate-y-1/2 -translate-x-full pointer-events-auto" />
      </div>
    </div>

    <div ref="element" class="my-6">
      <p @input="handleChange" ref="question" class="edit-text parent question" v-text="element.question" />

      <!-- Scale -->
      <div class="w-full h-7 flex flex-col items-center mt-2">
        <!-- Scale Numbers -->
        <div ref="scale" class="w-full flex justify-between">
          <div 
            v-for="n in element.num" 
            :key="n" 
            @click="select(n)"
            :class="{ 'chosen': value == n }"
            class="scale-button"
          >
            {{ n }}
          </div>
        </div>

        <div class="w-full flex justify-between mt-1">

        </div>
      </div>

      <!-- Labels -->
      <div class="w-full h-fit flex justify-between text-sm mt-0">
        <p ref="labelMin" @input="handleChange" class="parent edit-text w-24">{{ element.labelMin }}</p>
        <p ref="labelMax" @input="handleChange" class="parent edit-text w-24 text-right">{{ element.labelMax }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import AddButton from '../MenuParts/AddButton.vue';
import RemoveButton from '../MenuParts/RemoveButton.vue';

export default {
  name: 'LinearScale',
  components: {
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
  emits: ['change', 'input'],
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
      const labelMin = this.$refs.labelMin.innerText;
      const labelMax = this.$refs.labelMax.innerText;
      this.element.question = value;
      this.element.labelMin = labelMin;
      this.element.labelMax = labelMax;
      this.$emit('change');
    },
    select(n) {
      this.value = n;
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
  created() {

    // Remove the spans that magically find themselves in the scale list
    this.$nextTick(() => {
      var scale = this.$refs.scale;
      var span = scale.querySelectorAll('span');
      span.forEach((item, index) => {
        if(index === 0 || index === span.length - 1) {
          item.parentNode.removeChild(item);
        }
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
    }
  }
}
</script>
