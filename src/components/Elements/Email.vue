<template>

  <div class="my-6">
    <p @input="handleChange" ref="question" class="edit-text parent" v-text="element.question"/>
    <input 
      :placeholder="element.placeholder"
      type="email"
      class="email-input"
    />
  </div>
  
</template>

<script>
export default {
  name: 'Email',
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