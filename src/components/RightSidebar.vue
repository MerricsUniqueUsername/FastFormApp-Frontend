<template>
  <div class="w-1/4 h-full min-w-60 relative">

    <!-- Topbar tabs -->
    <Tabs value="question" style="height: 100%;">
      <TabList>
        <Tab value="question" class="w-1/3">Question</Tab>
        <Tab value="design" class="w-1/3">Design</Tab>
        <Tab value="css" class="w-1/3">CSS</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="question">

          <!-- Question Edit -->
          <div class="p-4">
            <p style="margin-top: 0;">Type</p>
            <Select class="w-full" :options="questionTypes" placeholder="Select a type" />

            <p>Required</p>
            <InputSwitch v-model="checked" />
          </div>

        </TabPanel>

        <!-- Design Edit -->
        <TabPanel value="design">
          <div class="p-4">
            <p style="margin-top: 0">Background color</p>
            <div class="color-picker">
              <span spellcheck="off" class="text-gray-400">#</span>
              <input v-model="bgColor">
              <ColorPicker class="relative float-end" v-model="bgColor" />
            </div>

            <p>Question color</p>
            <div class="color-picker">
              <span spellcheck="off" class="text-gray-400">#</span>
              <input v-model="qColor">
              <ColorPicker class="relative float-end" v-model="qColor" />
            </div>

            <p>Answer color</p>
            <div class="color-picker">
              <span spellcheck="off" class="text-gray-400">#</span>
              <input v-model="aColor">
              <ColorPicker class="relative float-end" v-model="aColor" />
            </div>
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
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import AceEditor from './AceEditor.vue';
import ColorPicker from 'primevue/colorpicker';

export default {
  name: 'RightSidebar',
  components: {
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Select,
    InputSwitch,
    InputText,
    AceEditor,
    ColorPicker,
  },
  data() {
    return {
      questionTypes: [
        'Long response',
        'Short response',
        'Multiple choice',
        'Checkboxes',
        'True or False'
      ],
      bgColor: 'ffffff',
      qColor: 'ffffff',
      aColor: 'ffffff',
    };
  },
}
</script>

<style scoped>
.custom-tabs .p-tabview-nav {
  border: none; /* Remove border from the tab navigation */
}
.custom-tabs .p-tabview-nav li {
  border: none; /* Remove border from individual tabs */
}
p {
  margin-top: 20px;
}
.p-tabpanels {
  @apply h-full;
}
input {
  @apply text-gray-400 w-1/2 bg-zinc-950;
}
input:focus {
  outline: none;
}
.color-picker {
  @apply px-2 bg-zinc-950 py-2 rounded border-zinc-500 border-solid;
  border-width: 1px;
}
</style>