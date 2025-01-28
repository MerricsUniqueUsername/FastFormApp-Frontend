<template>

  <div>
    <h1 ref="header" class="edit-text" @input="handleChange" v-text="element.content" />
  </div>
  
</template>

<script>
export default {
  name: 'Header1',
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
      const value = this.$refs.header.innerText;
      this.element.content = value;
    }
  },
}
</script>