<script>
import ModalMessage from '../components/ModalMessage';
import VueLoading from '../components/VueLoading.vue';

export default {
   data() {
      return {
         cart: {},
         leadForm: {
            message: '',
            user: { name: '', email: '', tel: '', address: '' },
         },
         hasItem: false,
      };
   },
   methods: {
      apiGetCart() { // 取得購物車資料
         this.$refs.vueLoading.onLoading();
         const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`;
         this.$http.get(url).then(response => {
            this.cart = { ...response.data.data };
            this.hasItem = !(this.cart.carts.length === 0);
            this.$refs.vueLoading.onCancel();
         }).catch(error => {
            this.$refs.vueLoading.onCancel();
            this.$refs.modalMessage.callMessage(`Oops! 「${error.data.message}」`, 'error');
         });
      },
      apiUpdateCartItem(item) { // 修改個別選單數量
         this.$refs.vueLoading.onLoading();
         const itemData = { product_id: item.product_id, qty: item.qty };
         const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart/${item.id}`;
         this.$http.put(url, { data: itemData }).then(response => {
            // console.log('update cart:', response.data);
            this.$refs.modalMessage.callMessage(`${item.product.title}：${item.qty + item.product.unit}`, 'qty');
            this.$refs.vueLoading.onCancel();
         }).catch(error => {
            this.$refs.vueLoading.onCancel();
            this.$refs.modalMessage.callMessage(`Oops! 「${error.data.message}」`, 'error');
         });
      },
      apiCreateLeadForm() { // 送出客戶填寫表單
         this.$refs.vueLoading.onLoading();
         const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/order`;
         this.$http.post(url, { data: this.leadForm }).then(response => {
            // console.log('apiCreateLeadForm:', response.data);
            this.$refs.vueLoading.onCancel();
            this.$refs.leadForm.resetForm();
            this.apiGetCart();
         }).catch(error => {
            this.$refs.vueLoading.onCancel();
            this.$refs.modalMessage.callMessage(`Oops! 「${error.data.message}」`, 'error');
         });
      },
      isPhone(value) {
         const phoneNumber = /^(09)[0-9]{8}$/;
         return phoneNumber.test(value) ? true : 'start with：09--';
      }
      // clickToFillOut() { // 假資料，方便直接輸入客戶資料
      //    this.leadForm.user.email = 'foo@example.com';
      //    this.leadForm.user.name = 'Foo Bar';
      //    this.leadForm.user.tel = '0987654321';
      //    this.leadForm.user.address = '27 E Valley Blvd, Alhambra, CA 91801';
      //    this.leadForm.message = 'A numeric value representing the exact number of items the value can contain.';
      // },
   },
   components: { ModalMessage, VueLoading },
   mounted() {
      this.apiGetCart();
   },
};
// linkActiveClass
</script>

<template>
   <div class="w-full bg-gray-50 shadow overflow-hidden border-gray-200 sm:rounded-lg">
      <div class="grid grid-cols-1 lg:grid-cols-[3fr_2fr] py-8">
         <div class="min-w-full px-6">
            <h5 class="text-lg font-semibold mb-2">Order Summary</h5>

            <div class="rounded-lg overflow-hidden border-2 border-gray-200 ">
               <div class="bg-gray-50 order-summary-grid">
                  <div class="list-header-col">Product</div>
                  <div class="list-header-col">Quantity</div>
                  <div class="list-header-col place-self-end">Subtotal</div>
               </div>

               <div class="bg-white text-sm border-b order-summary-grid" v-for="item in cart.carts" :key="item.id">
                  <div class="px-2 py-2 whitespace-nowrap fx-center-y gap-2">
                     <a href="#" @click.prevent="apiDeleteCartItem(item.id);">
                        <img src="../assets/images/remove_circle_black_24dp.svg"
                           class="w-4 aspect-square object-cover filter-red">
                     </a>
                     <span>{{item.product.title}}</span>
                  </div>
                  <div class="px-6 py-2 whitespace-nowrap">
                     <div class="fx-center-y gap-4">
                        <label for="numInput" class="relative text-base">
                           <select class="input-style-structure input-style--color m-0 py-1 px-4"
                              aria-label="Default select example" v-model="item.qty" @change="apiUpdateCartItem(item)">
                              <option v-for="item in 10" :value="item" :key="item">{{item}}</option>
                           </select>
                        </label>
                        <span class="text-gray-500 text-base">{{item.product.unit}}</span>
                     </div>
                  </div>
                  <div class="px-6 py-2 whitespace-nowrap fx-center-y ml-auto font-inter">
                     ${{ new Intl.NumberFormat().format(item.final_total) }}
                  </div>
               </div>

               <div class="bg-white grid grid-cols-[1fr_300px_1fr]">
                  <div class="list-header-col "></div>
                  <span class="list-header-col "></span>
                  <div class="list-header-col ml-auto">
                     <span class="mr-4">Total</span>
                     <span class="text-base text-black">${{ new Intl.NumberFormat().format(cart.total) }}</span>
                  </div>
               </div>
            </div>
            <!-- <div class="mt-4 flex justify-end">
               <button type="button" @click.prevent="clickToFillOut"
                  class="btn-rounded-md bg-purple-400 ring-purple-200 py-1 px-3 text-sm">
                  一鍵輸入</button>
            </div> -->
         </div>
         <div class="min-w-full px-6">
            <h5 class="text-lg font-semibold mb-2">Contact Information</h5>

            <v-form v-slot="{ errors }" @submit="apiCreateLeadForm()" autocomplete="off" ref="leadForm"
               class="mx-auto flex flex-col gap-6 text-left">
               <label for="emailInput" class="relative text-sm">
                  <span class="text-gray-500 inline-block mb-1">Email address</span>
                  <v-field id="emailInput" name="email"
                     :placeholder="hasItem ? 'abc@email.com' : '請先選取商品，再填資料'"
                     class="input-person-info input-style--color"
                     :class="{'input-style--error': errors['email']}" rules="email|required"
                     v-model="leadForm.user.email"
                     :disabled="!hasItem">
                  </v-field>
                  <ErrorMessage class="error-text mt-1" name="email"></ErrorMessage>
                  <!-- 錯誤訊息會對應 v-filed 的 name 屬性，所以 name 一定要放進去 -->
                  <!-- ErrorMessage 會把屬性 name="" 裡面的內容渲染到畫面上。 -->
                  <!-- rules 可以自己把多數的規則填進去，垂直線中間不要空格。 -->
                  <!-- v-filed 可使用 as="select" 之類的來轉換其他 input -->
               </label>
               <div class="my-4 border-b-2 border-gray-200"></div>

               <label for="nameInput" class="relative text-sm">
                  <span class="text-gray-500 inline-block mb-1">Your Name</span>
                  <v-field id="nameInput" placeholder="Name" name="姓名" rules="required"
                     class="input-person-info input-style--color"
                     :class="{'input-style--error': errors['姓名']}"
                     v-model="leadForm.user.name"
                     :disabled="!hasItem">
                  </v-field>
                  <ErrorMessage class="error-text mt-1" name="姓名"></ErrorMessage>
               </label>

               <label for="telInput" class="relative text-sm">
                  <span class="text-gray-500 inline-block mb-1">Phone Number</span>
                  <v-field id="telInput" placeholder="Phone number" name="手機號碼" type="tel"
                     :rules="isPhone"
                     class="input-person-info input-style--color"
                     :class="{'input-style--error': errors['手機號碼']}"
                     v-model="leadForm.user.tel"
                     :disabled="!hasItem">
                  </v-field>
                  <ErrorMessage class="error-text mt-1" name="手機號碼"></ErrorMessage>
               </label>

               <label for="addressInput" class="relative text-sm">
                  <span class="text-gray-500 inline-block mb-1">Address</span>
                  <v-field id="addressInput" placeholder="Shipping address" name="收件地址" rules="required"
                     class="input-person-info input-style--color"
                     :class="{'input-style--error': errors['收件地址']}"
                     v-model="leadForm.user.address"
                     :disabled="!hasItem">
                  </v-field>
                  <ErrorMessage class="error-text mt-1" name="收件地址"></ErrorMessage>
               </label>

               <label for="messageInput" class="relative text-sm">
                  <span class="text-gray-500 inline-block mb-1">Comment</span>
                  <v-field id="messageInput" name="message" as="textarea"
                     class="input-style-structure input-style--color"
                     :class="{'input-style--error': errors['message']}"
                     v-model="leadForm.message">
                  </v-field>
               </label>
               <div class="my-4 border-b-2 border-gray-200"></div>
               <button type="submit" class="btn-rounded-lg bg-rose-400 ring-rose-200 w-full" :disabled="!hasItem">
                  {{ hasItem ? 'Checkout' : '請先選取商品' }}
               </button>
            </v-form>

         </div>
      </div>
   </div>
   <ModalMessage ref="modalMessage"></ModalMessage>
   <VueLoading ref="vueLoading"></VueLoading>
</template>
