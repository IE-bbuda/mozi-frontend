import './assets/main.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'vue-awesome-paginate/dist/style.css'; // 페이지네이션

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VueAwesomePaginate from 'vue-awesome-paginate'; // 페이지네이션

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(VueAwesomePaginate); // 페이지네이션
app.use(createPinia());
app.use(router);

app.mount('#app');
