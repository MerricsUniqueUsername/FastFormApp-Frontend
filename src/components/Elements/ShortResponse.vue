<template>

  <div class="my-6">
    <p @input="handleChange" ref="question" class="edit-text parent question" v-text="element.question" v-once/>
    <input type="text" v-model="value" :placeholder="element.placeholder" class="short-response" />
  </div>
  
</template>

<script>
export default {
  name: 'ShortResponse',
  emits: ['input'],
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
      value: ""
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