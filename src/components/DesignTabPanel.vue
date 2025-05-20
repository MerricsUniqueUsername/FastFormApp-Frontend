<script setup>
import { ref, computed } from 'vue'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import ColorPicker from './ColorPicker.vue'
import FontPicker from './FontPicker.vue'

const props = defineProps({
  form: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="p-4">
    <Accordion :value="[]" multiple>
      <!-- Color Scheme -->
      <AccordionPanel value="colors">
        <AccordionHeader>Colors</AccordionHeader>
        <AccordionContent>
          <p><strong>Text & Background Colors</strong></p>
          <p>Header color</p>
          <ColorPicker v-model="form.theme.headerColor" />
          <p>Text color</p>
          <ColorPicker v-model="form.theme.textColor" />
          <p>Accent color</p>
          <ColorPicker v-model="form.theme.accentColor" />
          <p>Background color</p>
          <ColorPicker v-model="form.theme.backgroundColor" />

          <p><strong>Input Elements</strong></p>
          <p>Input background</p>
          <ColorPicker v-model="form.theme.inputBaseBackground" />
          <p>Border color</p>
          <ColorPicker v-model="form.theme.borderColor" />
          <p>Placeholder text</p>
          <ColorPicker v-model="form.theme.placeholderColor" />
          <p>Hover background</p>
          <ColorPicker v-model="form.theme.hoverBackground" />
          <p>Hover border</p>
          <ColorPicker v-model="form.theme.hoverBorderColor" />
          <p>Hover placeholder</p>
          <ColorPicker v-model="form.theme.hoverPlaceholderColor" />
          <p>Focus border</p>
          <ColorPicker v-model="form.theme.focusBorderColor" />
        </AccordionContent>
      </AccordionPanel>
      
      <!-- Typography -->
      <AccordionPanel value="typography">
        <AccordionHeader>Typography</AccordionHeader>
        <AccordionContent>
          <p>Font family</p>
          <FontPicker v-model="form.theme.fontFamily" />
          <p>Input font size</p>
          <input type="number" v-model="form.theme.inputFontSize" />
          <p>Dropdown font size</p>
          <input type="number" v-model="form.theme.dropdownFontSize" />
        </AccordionContent>
      </AccordionPanel>

      <!-- Spacing & Padding -->
      <AccordionPanel value="spacing">
        <AccordionHeader>Spacing & Padding</AccordionHeader>
        <AccordionContent>
          <p>Input padding (px)</p>
          <input type="number" v-model="form.theme.inputPadding" />
          <p>Dropdown padding (px)</p>
          <input type="number" v-model="form.theme.dropdownPadding" />
          <p>Question spacing (px)</p>
          <input type="number" v-model="form.theme.questionSpacing" />
        </AccordionContent>
      </AccordionPanel>

      <!-- Borders & Shape -->
      <AccordionPanel value="shape">
        <AccordionHeader>Borders & Shape</AccordionHeader>
        <AccordionContent>
          <p>Border radius (px)</p>
          <input type="range" min="0" max="50" v-model="form.theme.borderRadius" />
          <p>Input shadow size</p>
          <input type="range" min="0" max="10" step="0.5" v-model="form.theme.shadowSize" />
          <p>Dropdown shadow size</p>
          <input type="range" min="0" max="10" step="0.5" v-model="form.theme.dropdownShadowSize" />
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>

<style scoped>
/* Accordion */
:deep(.p-accordionpanel) {
  border: none;
  padding-top: 4px;
  padding-block: 4px;
  border-bottom: 1px solid;
  @apply border-b-neutral-800;
}
:deep(.p-accordionheader) {
  border: none;
  font-weight: 500;
  font-size: 18px;
}
:deep(.p-accordioncontent-content) {
  border: none;
}
:deep(.p-accordion) {
  @apply border-t border-t-neutral-800
}

/* Input style */
input {
  @apply
  w-full
  p-1.5
  border
  rounded-sm
  shadow
  transition
  duration-300
  bg-neutral-800
  border-neutral-600
  text-neutral-200
  focus:outline-none
}

/* Input range styles */
input[type="range"] {
  @apply shadow-none;
}

p {
  margin-top: 20px;
  font-size: 16px !important;
  @apply text-neutral-400;
}
</style>
