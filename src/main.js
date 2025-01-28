import { createApp } from 'vue';
import './assets/style.css';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import KeyFilter from 'primevue/keyfilter';

const app = createApp(App);
app.use(PrimeVue, {
  // theme: {
  //   preset: Aura,
  // },
});

app.directive('keyfilter', KeyFilter);

app.mount('#app');
