<template>

  <div class="my-6">
    <p @input="handleChange" ref="question" class="edit-text parent question" v-text="element.question" v-once/>
    <input 
      class="slider transition-all duration-150" 
      type="range"
      :min="element.min"
      :max="element.max"
      :step="element.step"
      v-model="value"
    />
    <p style="font-size: 0.75rem">{{ element.value }}</p>
  </div>
  
</template>
  
<script>

  export default {
    name: 'Slider',
    props: {
      element: {
        type: Object,
        required: true,
      },
      selected: {
        type: Boolean,
        required: true,
      },
    },
    data() {
      return {
        value: 0,
      }
    },
    emits: ['change', 'input'],
    methods: {
      handleChange() {
        const value = this.$refs.question.innerText;
        this.element.question = value;
        this.$emit('change');
      }
    },
    
    // Watch for changes in value
    watch: {
      value: {
        immediate: true,
        handler(newVal) {
          this.$emit('input', newVal);
        }
      }
    }
    
  }
</script>