<template>
   <div class="container mx-auto h-screen">
      <router-view></router-view>
   </div>
</template>

<script>
export default {
   data() {
      return {
         tokenName: 'hexApiToken',
      };
   },
   methods: {
      checkToken() {
         const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexApiToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
         if (token) {
            this.$http.defaults.headers.common.Authorization = token; // 把 token 存在 headers
            this.apiCheckLogin();
         } else {
            this.$router.push('/login');
         }
      },
      apiCheckLogin() {
         this.$http.post(`${process.env.VUE_APP_API}/api/user/check`).then(response => {
            // console.log('apiCheckLogin', response);
            this.$emit('update:hasLogin', true);
         }).catch(error => {
            console.log('apiCheckLogin fail', error);
         });
      },
   },
   created() {
      this.checkToken();
   },
};
</script>
