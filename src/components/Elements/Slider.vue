<template>

  <div class="my-6">
    <p @input="handleChange" ref="question" class="edit-text parent" v-text="element.question"/>
    <input 
      class="w-full" 
      type="range"
      :min="element.min"
      :max="element.max"
      :step="element.step"
      :value="element.value"
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
      }
    },
    data() {
      return {
        value: 0,
      }
    },
    emits: ['change'],
    methods: {
      handleChange() {
        const value = this.$refs.question.innerText;
        this.element.question = value;
        this.$emit('change');
      }
    }
  }
</script>