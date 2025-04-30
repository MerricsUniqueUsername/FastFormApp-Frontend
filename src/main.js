import { createApp } from 'vue';
import './assets/style.css';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import KeyFilter from 'primevue/keyfilter';
import router from './router';

const app = createApp(App);
app.use(router);
app.use(PrimeVue, {});

app.directive('keyfilter', KeyFilter);

app.mount('#app');
