<template>
  <div class="p-4">
    <!-- Question Edit -->
    <!-- Question type -->
    <p class="text-neutral-400" style="margin-top: 0;">Type</p>
    <Select 
      value-type="model-value"
      input="type"
      v-model="selectedElement.type"
      :options="questionTypes" 
      optionLabel="label" 
      optionValue="value" 
      class="w-full" 
      placeholder="Select a type"
      @change="updateSelectedElement($event.value)"
    />

    <!-- Variable name -->
    <p class="text-neutral-400">Variable name</p>
    <input type="text" pattern="^[a-zA-Z_][a-zA-Z0-9_]*$" @input="updateSelectedElement" v-model="selectedElement.name" spellcheck="false"
    class="w-full bg-neutral-800 text-neutral-300 text-sm rounded-md px-3 py-2 pl-8 border !border-neutral-700
        focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">

    <!-- Required -->
    <p class="text-neutral-400">Required</p>
    <input type="checkbox" @change="updateSelectedElement" v-model="selectedElement.required" class="!h-4 !w-4 relative" />

    <!-- Conditions -->
    <button class="w-full flex justify-end text-neutral-400 hover:text-neutral-300 cursor-pointer"
            @click="$emit('openConditionEditor')">
      Open condition editor
    </button>

    <!-- Divider -->
    <div class="border-b border-neutral-800 my-4"></div>

    <div class="placeholder-input" v-if="[ 'short-response', 'dropdown', 'number', 'date' ].includes(selectedElement.type)">
      <p>Placeholder</p>
      <input type="text" @input="updateSelectedElement" v-model="selectedElement.placeholder" spellcheck="false">
    </div>

    
    <!-- Multiselect -->
    <div class="multiselect" v-if="selectedElement.type === 'dropdown'">
      <p>Multiselect</p>
      <input type="checkbox" @change="updateSelectedElement" v-model="selectedElement.multiselect" class="!h-4 !w-4 relative" />
    </div>

    <!-- Options -->
    <div class="options" v-if="selectedElement.type === 'radio' || selectedElement.type === 'checkbox' || selectedElement.type === 'dropdown'">
      <p class="text-neutral-400">Options</p>
      <div class="border border-neutral-600 rounded-sm shadow-sm bg-neutral-800">
        <div v-for="(answer, index) in selectedElement.answers" :key="index" class="option-list-element flex items-center border-b border-b-neutral-700">
          <div @click="removeOption(index)" class="w-4 h-4 rounded-sm cursor-pointer text-neutral-200 hover:bg-neutral-100 aspect-square flex justify-center items-center mx-2 border border-neutral-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8"/>
            </svg>
          </div>
          <input class="!shadow-none !border-none !text-neutral-200" type="text" @input="updateSelectedElement" v-model="selectedElement.answers[index]" spellcheck="false">
        </div>
      </div>
      <div @click="addOption" class="w-full flex shadow-sm items-center justify-center cursor-pointer border border-neutral-600 text-neutral-500 hover:bg-neutral-800 rounded-sm p-1 mt-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
        </svg>
      </div>
    </div>

    <!-- Min -->
    <div class="min" v-if="selectedElement.type === 'number' || selectedElement.type === 'slider'">
      <p>Min</p>
      <input type="number" @input="updateSelectedElement" v-model="selectedElement.min" spellcheck="false">
    </div>

    <!-- Max -->
    <div class="max" v-if="selectedElement.type === 'number' || selectedElement.type === 'slider'">
      <p>Max</p>
      <input type="number" @input="updateSelectedElement" v-model="selectedElement.max" spellcheck="false">
    </div>

    <!-- Step -->
    <div class="step" v-if="selectedElement.type === 'number' || selectedElement.type === 'slider'">
      <p>Step</p>
      <input type="number" @input="updateSelectedElement" v-model="selectedElement.step" spellcheck="false">
    </div>

    <!-- Min fraction digits -->
    <div class="min-fraction-digits" v-if="selectedElement.type === 'number'">
      <p>Min fraction digits</p>
      <input type="number" @input="updateSelectedElement" v-model="selectedElement.minFractionDigits" spellcheck="false">
    </div>
  
    <!-- Max fraction digits -->
    <div class="max-fraction-digits" v-if="selectedElement.type === 'number'">
      <p>Max fraction digits</p>
      <input type="number" @input="updateSelectedElement" v-model="selectedElement.maxFractionDigits" spellcheck="false">
    </div>

    <!-- Grouping -->
    <div class="grouping" v-if="selectedElement.type === 'number'">
      <p>Grouping</p>
      <input type="checkbox" @change="updateSelectedElement" v-model="selectedElement.grouping" class="!h-4 !w-4 relative" />
    </div>

    <!-- Prefix -->
    <div class="prefix" v-if="selectedElement.type === 'number'">
      <p>Prefix</p>
      <input type="text" @input="updateSelectedElement" v-model="selectedElement.prefix" spellcheck="false">
    </div>

    <!-- Suffix -->
    <div class="suffix" v-if="selectedElement.type === 'number'">
      <p>Suffix</p>
      <input type="text" @input="updateSelectedElement" v-model="selectedElement.suffix" spellcheck="false">
    </div>

    <!-- Show buttons -->
    <div class="show-buttons" v-if="selectedElement.type === 'number'">
      <p>Show buttons</p>
      <input type="checkbox" @change="updateSelectedElement" v-model="selectedElement.showButtons" class="!h-4 !w-4 relative" />
    </div>

    <!-- Button layout -->
    <div class="button-layout" v-if="selectedElement.type === 'number' && selectedElement.showButtons">
      <p>Button layout</p>
      <Select 
        value-type="model-value"
        input="buttonLayout"
        v-model="selectedElement.buttonLayout"
        :options="[
          {'label': 'Stacked', 'value': 'stacked'},
          {'label': 'Horizontal', 'value': 'horizontal'},
          {'label': 'Vertical', 'value': 'vertical'},
        ]" 
        optionLabel="label" 
        optionValue="value" 
        class="w-full" 
        placeholder="Select a layout"
        @change="updateSelectedElement"
      />
    </div>

    <!-- Show time -->
    <div class="show-time" v-if="selectedElement.type === 'date'">
      <p>Show time</p>
      <input type="checkbox" @change="updateSelectedElement" v-model="selectedElement.showTime" class="!h-4 !w-4 relative" />
    </div>

    <!-- Time only -->
    <div class="time-only" v-if="selectedElement.type === 'date' && selectedElement.showTime">
      <p>Time only</p>
      <input type="checkbox" @change="updateSelectedElement" v-model="selectedElement.timeOnly" class="!h-4 !w-4 relative" />
    </div>

    <!-- Hour format -->
    <div class="hour-format" v-if="selectedElement.type === 'date' && selectedElement.showTime">
      <p>Hour format</p>
      <Select 
        value-type="model-value"
        input="hourFormat"
        v-model="selectedElement.hourFormat"
        :options="[
          {'label': '12', 'value': '12'},
          {'label': '24', 'value': '24'},
        ]" 
        optionLabel="label" 
        optionValue="value" 
        class="w-full" 
        placeholder="Select a format"
        @change="updateSelectedElement"
      />
    </div>

    <br><br>
  </div>
</template>

<script>
import Select from 'primevue/select';

export default {
  name: 'QuestionTabPanel',
  components: {
    Select
  },
  props: {
    selectedElement: {
      type: Object,
      required: true
    }
  },
  emits: ['openConditionEditor'],
  data() {
    return {
      questionTypes: [
        {'label': 'Short response', 'value': 'short-response'},
        {'label': 'Long response', 'value': 'long-response'},
        {'label': 'Multiple choice', 'value': 'radio'},
        {'label': 'Checkbox', 'value': 'checkbox'},
        {'label': 'Dropdown', 'value': 'dropdown'},
        {'label': 'Number', 'value': 'number'},
        {'label': 'Linear scale', 'value': 'linear-scale'},
        {'label': 'Star rating', 'value': 'rating'},
        {'label': 'Slider', 'value': 'slider'},
        {'label': 'Date and time', 'value': 'date'}
      ]
    };
  },
  methods: {
    updateSelectedElement(type) {
      // If change type is specified
      if (typeof type === 'string') {
        this.changeType(type);
      }
      this.$emit('update:selectedElement', this.selectedElement);
    },
    
    removeOption(index) {
      if(this.selectedElement.answers.length === 1) {
        return;
      }
      this.selectedElement.answers.splice(index, 1);
      this.$emit('update:selectedElement', this.selectedElement);
    },
    
    addOption() {
      this.selectedElement.answers.push('Answer ' + (this.selectedElement.answers.length + 1));
      this.$emit('update:selectedElement', this.selectedElement);
    },
    
    changeType(type) {
      this.$nextTick(() => {
        // Give attributes to the right element types
        if((type === 'radio' || type === 'checkbox' || type === 'dropdown') && !this.selectedElement.answers) {
          this.selectedElement.answers = ['Answer 1', 'Answer 2'];
        }
        if(type === 'linear-scale' && !this.selectedElement.num) {
          this.selectedElement.num = 5;
        }
        if(type === 'rating' && !this.selectedElement.num) {
          this.selectedElement.num = 5;
        }
        if(type === 'slider' && !this.selectedElement.min) {
          this.selectedElement.min = 0;
        }
        if(type === 'slider' && !this.selectedElement.max) {
          this.selectedElement.max = 100;
        }
        if(type === 'slider' && !this.selectedElement.step) {
          this.selectedElement.step = 1;
        }
        if(['number', 'slider'].includes(type) && !this.selectedElement.step) {
          this.selectedElement.step = 1;
        }
        if(type === 'number' && !this.selectedElement.minFractionDigits) {
          this.selectedElement.minFractionDigits = 0;
        }
        if(type === 'number' && !this.selectedElement.maxFractionDigits) {
          this.selectedElement.maxFractionDigits = 0;
        }
        if(type === 'number' && !this.selectedElement.grouping) {
          this.selectedElement.grouping = false;
        }
        if(type === 'number' && !this.selectedElement.showButtons) {
          this.selectedElement.showButtons = true;
        }
        if(type === 'number' && !this.selectedElement.buttonLayout) {
          this.selectedElement.buttonLayout = 'stacked';
        }
        if(type === 'date' && !this.selectedElement.showTime) {
          this.selectedElement.showTime = false;
        }
        if(type === 'date' && !this.selectedElement.timeOnly) {
          this.selectedElement.timeOnly = false;
        }
        if(type === 'date' && !this.selectedElement.hourFormat) {
          this.selectedElement.hourFormat = '24';
        }
      });
    }
  }
}
</script>

<style scoped>
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

p {
  margin-top: 20px;
  font-size: 16px !important;
  @apply text-neutral-400;
}
</style>
