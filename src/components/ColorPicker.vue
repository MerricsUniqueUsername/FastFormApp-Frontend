<template>
  <div class="bg-neutral-800 border border-neutral-600 text-neutral-400 rounded-sm shadow-sm p-1.5 mb-2 flex items-center justify-between">
    <div class="flex items-center">
      #
      <input
        v-model="colorHEXInternal"
        @input="sanitizeInput"
        type="text"
        class="w-2/3 ml-1"
        maxlength="6"
      >
    </div>
    <button
      ref="pickrButton"
      class="pickr-button w-12 h-6 shadow-sm rounded-sm"
      :style="{ backgroundColor: '#' + colorHEXInternal }"
    ></button>
  </div>
</template>

<script>
import Pickr from '@simonwep/pickr';
import '@simonwep/pickr/dist/themes/nano.min.css'; // Import a theme

export default {
  name: 'ColorPickerComponent',
  props: {
    modelValue: {
      type: String,
      default: '000000'
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      pickrInstance: null,
      colorHEXInternal: this.modelValue
    };
  },
  methods: {
    setupPickr() {
      this.pickrInstance = Pickr.create({
        el: this.$refs.pickrButton,
        theme: 'nano', // Or another theme like 'monolith' or 'nano'
        default: `#${this.colorHEXInternal}`,
        comparison: false, // Hide comparison color
        components: {
          preview: true,
          opacity: false,
          hue: true,

          interaction: {
            hex: true,
            rgba: false,
            hsla: false,
            hsva: false,
            cmyk: false,
            input: true,
            clear: false,
            save: true // Keep save button, but 'change' updates the model
          }
        }
      });

      // Emit update on every change while the dialog is open
      this.pickrInstance.on('change', (color, source, instance) => {
        const hexColor = color.toHEXA().toString().substring(1).toUpperCase(); // Remove # and ensure uppercase
         // Only update internal value and emit if it's different
        if (this.colorHEXInternal !== hexColor) {
            this.colorHEXInternal = hexColor;
            this.emitUpdate();
        }
      });

       // The save event will trigger after the change event with the final value
       // We primarily use it here to hide the picker on save
      this.pickrInstance.on('save', (color, instance) => {
          this.pickrInstance.hide();
      });

       this.pickrInstance.on('hide', (instance) => {
          // Sync the color button with the internal value when hidden
           this.$refs.pickrButton.style.backgroundColor = `#${this.colorHEXInternal}`;
        });
    },

    sanitizeInput(event) {
      const input = event.target.value.replace(/[^0-9A-Fa-f]/g, '').substring(0, 6).toUpperCase(); // Sanitize and convert to uppercase
      this.colorHEXInternal = input;
      this.emitUpdate();
      // Update Pickr's color when the input changes
      if (this.pickrInstance) {
        // Only set color in Pickr if the input is a valid 6-digit hex string
        if (input.length === 6) {
           this.pickrInstance.setColor(`#${input}`);
        }
      }
    },

    emitUpdate() {
      this.$emit('update:modelValue', this.colorHEXInternal);
    }
  },
  mounted() {
    this.setupPickr();
  },
  beforeUnmount() {
    if (this.pickrInstance) {
      this.pickrInstance.destroy();
    }
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(newValue) {
        const upperCaseNewValue = newValue ? newValue.toUpperCase() : ''; // Ensure comparison with uppercase
        if (upperCaseNewValue !== this.colorHEXInternal) {
          this.colorHEXInternal = upperCaseNewValue;
          if (this.pickrInstance && upperCaseNewValue.length === 6) { // Only set if valid length
            this.pickrInstance.setColor(`#${this.colorHEXInternal}`);
          }
        }
      }
    }
  }
};
</script>

<style scoped>
:deep(input) {
  border: none;
  outline: none;
  background: none;
}

.pickr-button {
  cursor: pointer;
  border: none;
  padding: 0;
}

/* Optional: Style for the pickr dialog container */
:deep(.pcr-app) {
  /* Add custom styles for the dialog if needed */
  font-family: inherit; /* Example: Use your app's font */
}
</style>