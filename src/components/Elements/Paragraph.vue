<template>

  <div>
    <p ref="paragraph" @input="handleChange" class="edit-text" v-text="element.content" v-once/>
  </div>
  
</template>

<script>
export default {
  name: 'Paragraph',
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
      const value = this.$refs.paragraph.innerText;
      this.element.content = value;
    }
  }
}
</script>