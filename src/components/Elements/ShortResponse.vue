<template>

  <div class="my-6">
    <p @input="handleChange" ref="question" class="edit-text parent" v-text="element.question"/>
    <input type="text" class="border bg-zinc-100 border-gray-300 p-2 w-full" />
  </div>
  
</template>

<script>
export default {
  name: 'ShortResponse',
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
  methods: {
    handleChange() {
      const value = this.$refs.question.innerText;
      this.element.question = value;
    }
  }
}
</script>