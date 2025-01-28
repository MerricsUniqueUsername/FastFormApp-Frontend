<template>
  <div class="w-1/4 h-full min-w-60 relative bg-gray-50 border-l border-l-gray-300 overflow-auto">

    <!-- Topbar tabs -->
    <Tabs value="question" style="height: 100%;">
      <TabList class="text-[1vw]">
        <Tab value="question" class="w-1/3">Question</Tab>
        <Tab value="design" class="w-1/3">Conditions</Tab>
        <Tab value="css" class="w-1/3">Design</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="question">

          <!-- Question Edit -->
          <div class="p-4">

            <!-- Question type -->
            <p style="margin-top: 0;">Type</p>
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
            <p>Variable name</p>
            <input type="text" @input="updateSelectedElement" v-model="selectedElement.name" spellcheck="false">

            <!-- Required -->
            <p>Required</p>
            <input type="checkbox" @change="updateSelectedElement" v-model="selectedElement.required" class="!h-4 !w-4 relative" />

            <!-- Divider -->
            <div class="border-b border-gray-300 my-4"></div>

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
              <p>Options</p>
              <div class="border border-gray-400 rounded-sm shadow-sm">
                <div v-for="(answer, index) in selectedElement.answers" :key="index" class="flex items-center border-b border-b-gray-300">
                  <div @click="removeOption(index)" class="w-4 h-4 rounded-sm cursor-pointer text-gray-500 hover:bg-gray-100 aspect-square flex justify-center items-center mx-2 border border-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8"/>
                    </svg>
                  </div>
                  <input class="!shadow-none !border-none !text-gray-500" type="text" @input="updateSelectedElement" v-model="selectedElement.answers[index]" spellcheck="false">
                </div>
              </div>
              <div @click="addOption" class="w-full flex shadow-sm items-center justify-center cursor-pointer border border-gray-400 text-gray-500 hover:bg-gray-100 rounded-sm p-1 mt-1">
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

        </TabPanel>

        <!-- Conditions -->
        <TabPanel value="conditions">
          <div class="p-4">

          </div>
        </TabPanel>

        <!-- CSS Edit -->
        <TabPanel value="css">
          <div class="p-4">
            <AceEditor />
          </div>
        </TabPanel>

      </TabPanels>
    </Tabs>

  </div>
</template>

<script>
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import AceEditor from './AceEditor.vue';
import ColorPicker from 'primevue/colorpicker';
import Checkbox from 'primevue/checkbox';

export default {
  name: 'RightSidebar',
  components: {
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Select,
    InputText,
    AceEditor,
    ColorPicker,
    Checkbox,
  },
  props: {
    form: {
      type: Object,
      required: true,
    },
    selectedId: {
      type: Number,
      required: false,
    },
  },
  data() {
    return {

      // Store data from element in here to update the form
      selectedElement: {
        name: '',
        type: '',
        required: '',
        placeholder: '',
        answers: [],
        multiselect: null,
        min: null,
        max: null,
        step: null,
        minFractionDigits: null,
        maxFractionDigits: null,
        grouping: false,
        prefix: '',
        suffix: '',
        showButtons: false,
        buttonLayout: '',
        showTime: false,
        timeOnly: false,
        hourFormat: '24',
      },
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
      ],
    };
  },
  emits: ['select'],
  methods: {

    /**
     * Get the selected element
     */
    getSelectedElement() {
      return this.form.elements.find((element) => element.id === this.selectedId);
    },

    /**
     * Update form selected element
     */
    updateSelectedElement(type) {

      // Next tick
      this.$nextTick(() => {

        // Get element
        const element = this.getSelectedElement();

        // If change type
        if(type) {
          this.changeType(type);
        }

        // Get element from form and keys
        const index = this.form.elements.findIndex((element) => element.id === this.selectedId);
        const keys = Object.keys(this.selectedElement);

        // Update selected form for each key
        keys.forEach((key) => {
          this.form.elements[index][key] = this.selectedElement[key];
        });

        this.$emit('select', element);
      });

    },

    /**
     * Remove option
     */
    removeOption(index) {
      if(this.selectedElement.answers.length === 1) {
        return;
      }
      this.selectedElement.answers.splice(index, 1);
      const element = this.getSelectedElement();
      this.$emit('select', element);
    },

    /**
     * Add option
     */
    addOption() {
      this.selectedElement.answers.push('Answer ' + (this.selectedElement.answers.length + 1));
      const element = this.getSelectedElement();
      this.$emit('select', element);
    },

    /**
     * Load selected element into sidebar
     */
    loadSelectedElement() {

      // Next tick
      this.$nextTick(() => {
        const element = this.getSelectedElement();
        const keys = Object.keys(this.selectedElement);

        // Update selected element
        keys.forEach((key) => {
          this.selectedElement[key] = element[key];
        });
      });      

    },

    /**
     * Change element type
     */
    changeType(type) {

      // Next tick
      this.$nextTick(() => {
        const el = this.getSelectedElement();

        // Give attributes to the right element types
        if((type === 'radio' || type === 'checkbox' || type === 'dropdown') && !el.answers) {
          el.answers = ['Answer 1', 'Answer 2'];
        }
        if(type === 'linear-scale' && !el.num) {
          el.num = 5;
        }
        if(type === 'rating' && !el.num) {
          el.num = 5;
        }
        if(type === 'slider' && !el.min) {
          el.min = 0;
        }
        if(el === 'slider' && !el.max) {
          element.max = 100;
        }
        if(type === 'slider' && !el.step) {
          el.step = 1;
        }
        if(type == 'slider' && !el.min) {
          el.min = 0;
        }
        if(type == 'slider' && !el.max) {
          el.max = 100;
        }
        if(['number', 'slider'].includes(type) && !el.step) {
          el.step = 1;
        }
        if(type === 'number' && !el.minFractionDigits) {
          el.minFractionDigits = 0;
        }
        if(type === 'number' && !el.maxFractionDigits) {
          el.maxFractionDigits = 0;
        }
        if(type === 'number' && !el.grouping) {
          el.grouping = false;
        }
        if(type === 'number' && !el.showButtons) {
          el.showButtons = true;
        }
        if(type === 'number' && !el.buttonLayout) {
          el.buttonLayout = 'stacked';
        }
        if(type === 'date' && !el.showTime) {
          el.showTime = false;
        }
        if(type === 'date' && !el.timeOnly) {
          el.timeOnly = false;
        }
        if(type === 'date' && !el.hourFormat) {
          el.hourFormat = '24';
        }
      });
    },
  }
}
</script>

<style scoped>

/* Input style */
input {
  @apply
  w-full
  p-1.5
  bg-gray-50
  border
  border-gray-400
  rounded-sm
  shadow
  transition
  duration-300
  text-gray-500;
}

.custom-tabs .p-tabview-nav {
  border: none; /* Remove border from the tab navigation */
}
.custom-tabs .p-tabview-nav li {
  border: none; /* Remove border from individual tabs */
}
p {
  margin-top: 20px;
  font-size: 16px !important;
}
.p-tabpanels {
  @apply h-full;
}
.color-picker {
  @apply px-2 bg-zinc-950 py-2 rounded border-zinc-500 border-solid;
  border-width: 1px;
}
</style>

<style scoped>

/* Tabs */
.p-tab {
  @apply
  border-none
  !border-r-gray-300
  !border-l-gray-300
  !border-b-gray-300
  transition
  duration-150;
  border-left-style: solid !important;
  border-bottom-style: solid !important;
  border-right-style: solid !important;
  border-left-width: 0.25px;
  border-bottom-width: 0.25px;
  border-right-width: 0.25px;
}
.p-tab:hover {
  @apply
  border-none
  !border-r-gray-300
  !border-l-gray-300
  !border-b-gray-300;
}
.p-tab-active {
  @apply
  bg-black
  text-white;
}


</style>

<style>

/* Tabs */
.p-tablist-content .p-tablist-tab-list {
  border: none;
}

</style>