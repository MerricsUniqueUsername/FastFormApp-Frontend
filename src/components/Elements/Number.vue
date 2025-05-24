<template>

  <div class="my-6">
    <p @input="handleChange" ref="question" class="edit-text parent question" v-text="element.question" v-once/>
    <InputNumber 
      :min="element.min"
      :max="element.max"
      :step="element.step"
      :minFractionDigits="element.minFractionDigits"
      :maxFractionDigits="element.maxFractionDigits"
      :useGrouping="element.grouping"
      :prefix="element.prefix"
      :suffix="element.suffix"
      :showButtons="element.showButtons"
      :buttonLayout="element.buttonLayout"
      :placeholder="element.placeholder"
      v-model="value"
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