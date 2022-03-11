import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
   {
      path: '/',
      name: 'home',
      component: HomeView,
   },
   {
      path: '/client',
      name: 'client',
      component: () => import('../views/ClientView'),
   },
   {
      path: '/product/:id', // :id 為動態屬性的寫法 ⇢ :to="`/product/${item.id}`"
      name: 'product',
      component: () => import('../views/ClientProduct'),
   },
   {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckOut'),
   },
   {
      path: '/login',
      name: 'login',
      component: () => import('../views/SignIn'),
   },
   {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView'),
      children: [
         {
            path: 'products',
            name: 'admin 產品頁',
            component: () => import('../views/AdminProducts'),
         }
      ]
   },
   {
      path: '/test',
      name: 'test',
      component: () => import('../views/TestView'),
      children: [
         {
            path: 'test-child',
            name: 'test-child',
            component: () => import('../views/TestChild'),
         }
      ]
   }
];

const router = createRouter({
   history: createWebHashHistory(),
   routes,
   linkActiveClass: 'nav-link-current',
   // 設定當連結出現 .router-link-active 樣式時，就套用 .nav-link-current
});

export default router;

// path: '/product/:id',
// :id 為動態屬性的寫法 ⇢ :to="`/product/${item.id}`"
// :id 在取值時（this.$route），id 就會變成 params 物件內的屬性名稱。
// 例如 ⇢ /:title，則可用 this.$route.params.title 取得 :to="`/product/${item.id}`"

// $router ⇢ 方法
// $route  ⇢ 物件（取值用）

// <router-link :to="`/product/${item.id}`">
// <router-link :to="{ name: 'product' , params:{ id: item.id, userId: 123 }>
// this.$router.push('/path');
