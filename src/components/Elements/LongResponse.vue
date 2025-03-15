<template>

  <div class="my-6">
    <p @input="handleChange" ref="question" class="edit-text parent question" v-text="element.question"/>
    <textarea rows="4" v-model="value"></textarea>
  </div>

</template>

<script>
export default {
  name: 'LongResponse',
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
  emits: ['input'],
  data() {
    return {
      value: ''
    }
  },
  methods: {
    handleChange() {
      const value = this.$refs.question.innerText;
      this.element.question = value;
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