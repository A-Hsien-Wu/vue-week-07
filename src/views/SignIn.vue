<script>

export default {
   data() {
      return {
         loginUser: { username: '', password: '' },
         token: '',
         tokenName: 'hexApiToken',
         warning: '',
         showPassword: false,
         btnText: 'Login',
      };
   },
   methods: {
      clickLogin() {
         this.btnText = 'connecting...';
         if (this.loginUser.username === '' || this.loginUser.password === '') {
            this.warning = 'Neither of the text fields can be blank!';
            this.btnText = 'Login';
         } else {
            const url = `${process.env.VUE_APP_API}/admin/signin`;
            this.$http.post(url, this.loginUser)
               .then(response => {
                  this.btnText = 'Login';
                  // console.log('signin:', response);
                  const { token, expired } = response.data;

                  document.cookie = `${this.tokenName}=${token}; expires=${new Date(expired)}; path=/;`;
                  // 把 token 存到網頁 cookie
                  this.token = token;
                  this.$http.defaults.headers.common.Authorization = token; // 把 token 存在 headers
                  this.$router.push('/admin/products');
               }).catch(error => {
                  const errorMessage = error?.response?.data?.error;
                  if (errorMessage.code === 'auth/invalid-email') {
                     this.warning = '登入失敗! Email 格式錯誤';
                  } else if (errorMessage.code === 'auth/user-not-found') {
                     this.warning = '登入失敗! 查無此帳號';
                  } else if (errorMessage.code === 'auth/wrong-password') {
                     this.warning = '登入失敗! 密碼不正確，請再重新輸入一次';
                  } else if (errorMessage.code === 'auth/too-many-requests') {
                     this.warning = '登入失敗! 嘗試登入失敗次數過多，目前無法再登入，請稍後再回來';
                  }
                  this.btnText = 'Login';
               });
         }
      },
      focusInput() {
         this.warning = '';
      },
   },
   created() {
      // this.token = document.cookie.replace(/(?:(?:^|.*;\s*)hexApiToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
   }
};
</script>

<template>
   <router-view></router-view>
   <div class="container mx-auto h-screen flex flex-col fx-center">
      <div class="w-72 h-96 bg-white opacity-100 rounded-lg py-10 px-5 flex-col">
         <h5
            class="text-xl text-white -mx-8 p-3 text-center drop-shadow-lg transition ease-in-out bg-blue-500 hover:bg-sky-500 duration-300"
         >Hello Stranger</h5>
         <form action autocomplete="off" class="mt-10 text-gray-500" @submit.prevent="clickLogin">
            <!-- submit 放在 <form> 裡面 -->
            <label for="emailInput" class="floating-label mb-8">
               <input
                  type="email"
                  id="emailInput"
                  placeholder="abc@email.com"
                  name="input-name"
                  class="floating-input peer"
                  @focus="focusInput"
                  v-model="loginUser.username"
                  required
               />
               <span class="floating-assist"></span>
               <span class="mt-2 warning-sentence">Please provide a valid email address.</span>
            </label>

            <label for="passwordInput" class="floating-label mb-12">
               <div class="absolute right-0 bottom-2 cursor-pointer" @click.prevent="showPassword=!showPassword">
                  <span
                     class="block w-4 h-4 bg-cover"
                     :style="{backgroundImage:'url(\''+require('@/assets/images/visibility_black_24dp.svg')+'\')'}"
                     v-if="!showPassword"></span>
                  <span
                     class="block w-4 h-4 bg-cover"
                     :style="{backgroundImage:'url(\''+require('@/assets/images/visibility_off_black_24dp.svg')+'\')'}"
                     v-else></span>
               </div>
               <input
                  :type="showPassword ? 'text' : 'password'"
                  id="passwordInput"
                  placeholder="Password"
                  class="floating-input peer"
                  @focus="focusInput"
                  v-model="loginUser.password"
                  required
               />
               <span class="floating-assist after:content-['Password']"></span>
            </label>

            <button
               type="submit"
               class="btn-rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 ring-pink-500/50 mt-auto w-full hover:drop-shadow-lg transition-all"
            >{{ btnText }}</button>
         </form>
         <p class="mt-2 text-sm text-red-500 text-center">{{ warning }}</p>
      </div>
   </div>
</template>
