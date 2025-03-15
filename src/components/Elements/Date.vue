<template>

  <div class="my-6">
    <p @input="handleChange" ref="question" class="edit-text parent question" v-text="element.question"/>
    <DatePicker 
      class="w-full"
      v-model="value"
      :showTime="element.showTime"
      :timeOnly="element.timeOnly"
      :hourFormat="element.hourFormat"
      :placeholder="element.placeholder"
    />
  </div>

</template>

<script>
import DatePicker from 'primevue/datepicker';

export default {
  name: 'Date',
  components: {
    DatePicker,
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
      value: '',
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