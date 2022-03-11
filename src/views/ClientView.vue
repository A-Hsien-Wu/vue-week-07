<template>
   <div class="flex flex-col gap-4" note="flex-wrap xl:flex-nowrap">
      <div id="product-list" class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
         <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div class="shadow overflow-hidden border-gray-200 sm:rounded-lg bg-gray-50">
               <div class="min-w-full divide-y border-gray-200 border-b-2">
                  <!-- List Header -->
                  <div class="bg-gray-50 grid grid-cols-[3fr_4fr_minmax(340px,_2fr)]">
                     <div class="list-header-col">Product Name</div>
                     <div class="list-header-col">Price</div>
                     <div class="list-header-col">Check Out</div>
                  </div>
                  <!-- List Body -->
                  <div class="bg-white grid grid-cols-[3fr_4fr_minmax(340px,_2fr)]"
                     v-for="item in products" :key="item.id">
                     <!-- product name -->
                     <div class="px-6 py-4 whitespace-nowrap">
                        <div class="fx-center-y">
                           <div class="shrink-0 rounded-full border border-gray-400">
                              <img class="h-16 aspect-square object-cover rounded-full"
                                 :src="item.imageUrl" @load="loadPhotoSuccess" @error="loadPhotoError">
                           </div>
                           <div class="ml-4">
                              <div class="text-sm font-medium text-gray-900">{{item.title}}</div>
                              <div class="text-sm text-gray-500">{{item.category}}</div>
                           </div>
                        </div>
                     </div>
                     <!-- Price -->
                     <div class="px-6 py-4 whitespace-nowrap fx-center-y font-inter">
                        <div class="flex items-end gap-3">
                           <span class="text-3xl font-bold text-gray-900">
                              ${{ new Intl.NumberFormat().format(item.price) }}</span>
                           <span class="bullet-text bullet-leaf text-emerald-500 mb-1"
                              v-show="item.price < item.origin_price">
                              ↓ {{ discountPercent( item.price , item.origin_price ) }}%
                              <!-- （原價 ${{ new Intl.NumberFormat().format(item.origin_price) }}） -->
                              （原價 ${{ $filter.currency(item.origin_price) }}）
                              </span>
                        </div>
                     </div>
                     <!-- check out -->
                     <div class="px-6 py-4 whitespace-nowrap fx-center-y">
                        <!-- <router-link class="text-line-style-a pr-6 border-r-2" :to="`/product/${item.id}`"> -->
                        <router-link class="text-line-style-a pr-6 border-r-2"
                           :to="{ name: 'product' , params:{ id: item.id, carts: JSON.stringify(cart.carts) } }">
                           View Product
                        </router-link>

                        <button type="button" class="text-line-style-a ml-2 text-red-400 hover:text-white
                           rounded-full px-3 py-1 hover:bg-red-300 disabled:bg-gray-300
                           disabled:text-gray-800 addCart_btn"
                           @click.prevent="apiAddToCart(item);" ref="addCart_btn" :data-id="item.id">
                           Add to Bag
                        </button>
                     </div>
                  </div>
               </div>

               <div class="w-full bg-gray-50 text-right" v-show="hasAnyCart">
                  <button class="btn-rounded-lg bg-gray-700 ring-gray-200 my-3 mx-6"
                     @click.prevent="apiEmptyCarts">清空購物車</button>
               </div>
            </div>
         </div>
      </div>
   </div>
   <router-view/>
   <ModalMessage ref="modalMessage"></ModalMessage>
   <VueLoading ref="vueLoading"></VueLoading>
</template>

<script>
import ModalMessage from '../components/ModalMessage';
import VueLoading from '../components/VueLoading.vue';
import notFoundImg from '../assets/images/no_image_icon_02.png';
// 可利用 import 來取圖片。

export default {
   name: 'clientView',
   data() {
      return {
         products: [],
         cart: {},
         addBtnArr: [],
      };
   },
   methods: {
      apiGetAllProducts() { // 取得所有產品資料
         this.$refs.vueLoading.onLoading();
         this.$http.get(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/products?page=2`)
            .then(response => {
               // console.log('get all:', response.data);
               this.products = [...response.data.products];
               this.$refs.vueLoading.onCancel();
            }).catch(error => {
               this.$refs.modalMessage.callMessage(`Oops! 「${error.data.message}」`, 'error');
            });
      },
      apiAddToCart(item, quantity = 1) { // 將商品加入購物車
         const tempCart = { product_id: item.id, qty: quantity };
         const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`;
         this.$refs.vueLoading.onLoading();
         this.$http.post(url, { data: tempCart }).then(response => {
            this.$refs.vueLoading.onCancel();
            this.$refs.modalMessage.callMessage(`商品「${item.title}」 已成功加入購物車！`);
            this.apiGetCart();
         }).catch(error => {
            this.$refs.vueLoading.onCancel();
            this.$refs.modalMessage.callMessage(`Oops! 「${error.data.message}」`, 'error');
         });
      },
      apiEmptyCarts() { // 刪除購物車的內容
         this.$refs.vueLoading.onLoading();
         const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/carts`;
         this.$http.delete(url).then(response => {
            this.$refs.vueLoading.onCancel();
            this.$refs.modalMessage.callMessage('購物車已清空！', 'empty');
            this.apiGetCart();
         }).catch(error => {
            this.$refs.vueLoading.onCancel();
            this.$refs.modalMessage.callMessage(`Oops! 「${error.data.message}」`, 'error');
         });
      },
      apiGetCart() { // 取得購物車資料
         this.$http.get(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`).then(response => {
            this.cart = response.data.data;
            setTimeout(() => { this.changeAddBtn(this.cart.carts); }, 100);
         }).catch(error => {
            this.$refs.vueLoading.onCancel();
            this.$refs.modalMessage.callMessage(`Oops! 「${error.data.message}」`, 'error');
         });
      },
      changeAddBtn(addedCarts) {
         // console.log('hasBtnRef' , this.$refs.addCart_btn);
         const addedProductIds = addedCarts.map(item => item.product_id);
         this.$refs?.addCart_btn?.filter(btn => {
            btn.disabled = false;
            btn.innerHTML = 'Add to Bag';
            return (addedProductIds.indexOf(btn.dataset.id) !== -1);
         }).forEach(btn => {
            btn.disabled = true;
            btn.innerHTML = 'Added';
         });
      },
      loadPhotoSuccess(event) { // 載圖成功
         // console.log('loadPhotoSuccess:' , event);
      },
      loadPhotoError(event) { // 載圖失敗
         event.target.src = notFoundImg;
      },
      discountPercent(price = 0, origin_price = 0) { // 計算折扣率
         return Math.round(-(100 - (price / origin_price) * 100));
      },
   },
   computed: {
      hasAnyCart() { // 清空購物車，是否隱藏相關元素
         return !(this.cart.carts?.length === 0);
      },
   },
   components: {
      ModalMessage, VueLoading
   },
   mounted() {
      this.apiGetAllProducts();
      this.apiGetCart();
   },
};
</script>
