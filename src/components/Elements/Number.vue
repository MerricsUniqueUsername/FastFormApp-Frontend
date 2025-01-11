<template>

  <div class="my-6">
    <p @input="handleChange" ref="question" class="edit-text parent" v-text="element.question"/>
    <InputNumber 
      class="w-full" 
      :min="element.min"
      :max="element.max"
      :minFractionDigits="element.minFractionDigits"
      :maxFractionDigits="element.maxFractionDigits"
      :useGrouping="element.grouping"
      :prefix="element.prefix"
      :suffix="element.suffix"
      :showButtons="element.showButtons"
      :buttonLayout="element.buttonLayout"
      :placeholder="element.placeholder"
    />
  </div>

</template>

<script>
import InputNumber from 'primevue/inputnumber';

export default {
  name: 'Number',
  components: {
    InputNumber,
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
    handleChange() {
      const value = this.$refs.question.innerText;
      this.element.question = value;
      this.$emit('change');
    }
  }
}
</script>