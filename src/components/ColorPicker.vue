<template>
  <div class="bg-neutral-800 border border-neutral-600 text-neutral-400 rounded-sm shadow-sm p-1.5 mb-2">
    #
    <input
      v-model="colorHEXInternal"
      @input="sanitizeInput"
      type="text"
      class="w-2/3"
      maxlength="6"
    >
    <ColorPicker
      v-model="colorHSB"
      format="hsb"
      @change="handleColorChange"
      ref="color_picker"
      class="w-12 float-right shadow-sm"
    />
  </div>
</template>

<script>
import ColorPicker from 'primevue/colorpicker';

export default {
  components: {
    ColorPicker
  },
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
      colorHSB: null,
      colorHEXInternal: this.modelValue,
      previousHSB: null
    };
  },
  methods: {
    hsbToHex(val) {
      const h = val.h;
      const s = val.s / 100;
      const v = val.b / 100;

      const c = v * s;
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const m = v - c;

      let r = 0, g = 0, b = 0;

      if (h < 60) {
        r = c, g = x, b = 0;
      } else if (h < 120) {
        r = x, g = c, b = 0;
      } else if (h < 180) {
        r = 0, g = c, b = x;
      } else if (h < 240) {
        r = 0, g = x, b = c;
      } else if (h < 300) {
        r = x, g = 0, b = c;
      } else {
        r = c, g = 0, b = x;
      }

      const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
      const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
      const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');

      return `${rHex}${gHex}${bHex}`;
    },

    hexToHsb() {
      const hex = this.colorHEXInternal.replace(/^#/, '');
      if (hex.length !== 6) return;

      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      const d = max - min;

      const v = max;
      const s = max === 0 ? 0 : d / max;
      let h = 0;

      if (max !== min) {
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
      }

      this.colorHSB = { h: Math.round(h), s: Math.round(s * 100), b: Math.round(v * 100) };
      this.previousHSB = {...this.colorHSB};
    },

    updateHSB() {
      this.hexToHsb();
    },

    updateHEX() {
      this.colorHEXInternal = this.hsbToHex(this.colorHSB);
      this.emitUpdate();
    },

    handleColorChange() {
      // If we have a previous HSB value and only the hue has changed
      // preserve the previous saturation and brightness values
      if (this.previousHSB && this.colorHSB.h !== this.previousHSB.h &&
          (this.colorHSB.s === 100 || this.colorHSB.b === 100)) {
        this.colorHSB = {
          h: this.colorHSB.h,
          s: this.previousHSB.s,
          b: this.previousHSB.b
        };
      }

      // Update the HEX value and store the current HSB for future reference
      this.updateHEX();
      this.previousHSB = {...this.colorHSB};
    },

    sanitizeInput(event) {
      const input = event.target.value.replace(/[^0-9A-Fa-f]/g, '').substring(0, 6);
      this.colorHEXInternal = input;
      this.updateHSB();
      this.emitUpdate();
    },

    emitUpdate() {
      this.$emit('update:modelValue', this.colorHEXInternal);
    }
  },
  mounted() {
    this.hexToHsb();
    this.previousHSB = {...this.colorHSB};
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(newValue) {
        if (newValue !== this.colorHEXInternal) {
          this.colorHEXInternal = newValue;
          this.hexToHsb();
          this.previousHSB = {...this.colorHSB};
        }
      }
    }
  }
};
</script>

<style scoped>
:deep(.p-colorpicker-preview) {
  width: 48px;
  height: 24px;
  border-radius: 2px;
  transition: background-color 0.2s ease;
}
:deep(input) {
  border: none;
  outline: none;
  background: none;
}
</style>