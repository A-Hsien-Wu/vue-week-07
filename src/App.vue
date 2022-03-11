<template>
   <NavComponent class="sticky top-0">

      <template v-slot:links>
         <router-link class="nav-link" to="/client">產品列表</router-link>
         <p class="nav-link-current" v-show="routeName==='product'">{{productPageName}}</p>
         <router-link class="nav-link" to="/checkout">產品購物車</router-link>
         <router-link v-show="hasAdminToken" class="nav-link" to="/admin/products">後台產品列表</router-link>
      </template>

      <template v-slot:admin-links>
         <button type="button" class="nav-link-admin" @click.prevent="clickAdmin">
            <span class="mobile-off">{{ hasAdminToken ? 'Admin Sign out' : 'Admin Sign in' }}</span>
            <img class="icon-cover w-6 sm:w-8 mobile-on" alt="Login" src="./assets/images/login_white_24dp.svg" />
         </button>
      </template>

   </NavComponent>

   <div class="container-center">
      <router-view
         @update:routeChanged="productPageName=$event"
         @update:hasLogin="hasAdminToken=true"
      />
      <!-- 使用 router-view 來表示，在這個區塊執行頁面切換 -->
      <!-- 接收事件（routeChanged），當 router-view 是 ClientProduct 的時候，增加 id 顯示 -->
      <!-- 接收事件（onAdmin），當 AdminView 通過驗證時，navbar 加上後臺產品列表按鈕 -->
   </div>
   <ModalMessage ref="modalMessage"></ModalMessage>
</template>

<script>
import NavComponent from './components/NavComponent.vue';
import ModalMessage from './components/ModalMessage';
import { useRoute } from 'vue-router';

export default {
   data() {
      return {
         route: '',
         productPageName: '',
         hasAdminToken: false,
      };
   },
   methods: {
      clickAdmin() {
         if (this.hasAdminToken) {
            this.signOut();
         } else {
            this.$router.push('/login');
         }
      },
      signOut() {
         document.cookie = 'hexApiToken=;expires=;';
         this.$router.push('/');
         this.hasAdminToken = false;
         this.$refs.modalMessage.callMessage('管理者已登出');
      },
   },
   computed: {
      routeName() {
         return this.route.name;
      }
   },
   components: {
      NavComponent, ModalMessage,
   },
   mounted() {
      this.route = useRoute();
      // console.log('環境變數', process.env.VUE_APP_PATH);
      // console.log('$router', this.$router);
      // console.log('$route', this.$route);
   },
};
</script>

<style lang="scss">
#app {
   font-family: 'Poppins', 'PingFang TC', 'sans-serif';
   background-color: #2c3e50;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
}
</style>

<!--
custom ⇢ 表示渲染後，裡面的 <button> 不會被 <a> 包住
isActive ⇢ 表示渲染後，裡面的 <button> 會增加一個 active 屬性，當目前路由的 url 與目標相同時，active="true"
isExactActive ⇢ :class="[isExactActive && 'className']"，當目前路由的 url 與目標相同時，套用 className 這個 class
-->

<!--
<router-link to="/login" custom v-slot="{ navigate, isActive, isExactActive }">
   <button type="button" class="nav-link-admin" @click="navigate" :active="isActive"
      :class="[isExactActive && 'router-link-exact-active', isActive && 'router-link-active']">
      <span class="mobile-off">Admin Sign in</span>
      <img class="icon-cover w-6 sm:w-8 mobile-on" alt="Login" src="./assets/images/login_white_24dp.svg" />
   </button>
</router-link>
-->
