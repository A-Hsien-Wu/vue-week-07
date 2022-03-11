import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import '@/assets/tailwind.css';
import { Field, Form, ErrorMessage, defineRule, configure } from 'vee-validate';
// import { required, email, min } from '@vee-validate/rules'; // 選擇 rule
import AllRules from '@vee-validate/rules'; // 選擇全部 rules
import { localize, setLocale } from '@vee-validate/i18n';
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { currency, numberFormat, inlineBgUrl } from './methods/filter';

// 原本是 ⇢ VeeValidate.defineRule('required', VeeValidateRules['required']);
// 在 .vue 裡面，可以把 VeeValidate 拿掉。
// defineRule('required', required);
// defineRule('email', email);
// defineRule('min', min);

// define all the available rules
Object.keys(AllRules).forEach(rule => {
   defineRule(rule, AllRules[rule]);
});

configure({
   generateMessage: localize({ zh_TW: zhTW }),
   validateOnInput: true,
});
setLocale('zh_TW');
// 可能沒辦法啟用語系檔，setLocale(); 強制啟用。

const app = createApp(App);
app.component('VForm', Form);
app.component('VField', Field);
app.component('ErrorMessage', ErrorMessage);
// 原本是 ⇢ app.component('VForm', VeeValidate.Form);
// 這裡可以簡化 ⇣
// VForm ⇢ Form，
// VeeValidate.Form ⇢ Form
// 但是會觸發 eslint：vue/multi-word-component-names，所以還是改回 VForm

// 載入 vue-axios。this.$http 就是 axios，之後調用就是寫 ⇢ this.$http.get(url).then().catch();
app.use(VueAxios, axios);
app.use(router);

app.config.globalProperties.$filter = {
   currency, numberFormat, inlineBgUrl
};

app.mount('#app');
