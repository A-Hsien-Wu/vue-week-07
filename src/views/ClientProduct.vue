<template>
   <div class="min-h-screen">
      <div class="container-centering" v-show="hasData">
         <div class="modal-content lg:max-w-screen-lg" ref="modalProductContent">
            <div class="grid grid-cols-1 gap-y-8 gap-x-6 items-start sm:grid-cols-12 lg:gap-x-8 relative">
               <CloseButton class="absolute top-0 right-0" @click.prevent="leave"></CloseButton>
               <img :src="product.imageUrl" @load="loadPhotoSuccess" @error="loadPhotoError"
                  class="object-cover aspect-3/4 rounded-lg sm:col-span-4 lg:col-span-5">
               <div class="sm:col-span-8 lg:col-span-7 flex flex-col items-start h-full">
                  <div class="inline-flex gap-3 items-end">
                     <h2 class="text-2xl font-semibold text-gray-900">{{ product.title }}</h2>
                     <span class="bullet-text bullet-leaf text-sm font-normal">{{ product.category }}</span>
                  </div>
                  <p class="text-2xl text-gray-900">${{ new Intl.NumberFormat().format( product.price ) }}</p>
                  <div class="divide-gray-200 w-3/4"></div>
                  <p class="mt-4 text-gray-500">
                     <img src="../assets/images/info_black_24dp.svg" class="icon-cover w-5 filter-green-500">
                     {{ product.content == undefined ? 'No content' : product.content }}</p>
                  <p class="my-4 text-gray-500 text-left">
                     {{ product.description == undefined ? 'No Description' : product.description }}
                  </p>
                  <button type="button" class="btn-rounded-md w-full mt-auto bg-indigo-600
                     hover:bg-indigo-700 border-transparent
                     focus:outline-none focus:ring-offset-2 focus:ring-indigo-500"
                     @click.prevent="addToCart">
                     {{ hasAdded ? 'already Added！' : 'Add to Bag' }}
                  </button>
               </div>
            </div>
         </div>
      </div>
   </div>
   <ModalMessage ref="modalMessage"></ModalMessage>
   <VueLoading ref="vueLoading"></VueLoading>
</template>

<script>
import ModalMessage from '../components/ModalMessage';
import CloseButton from '../components/lib/CloseButton.vue';
import VueLoading from '../components/VueLoading.vue';
import notFoundImg from '../assets/images/no_image_icon_02.png';

export default {
   name: 'clientProduct',
   data() {
      return {
         product: {},
         hasAdded: false,
         carts: {},
         hasData: false,
      };
   },
   methods: {
      apiGetProduct() {
         this.$refs.vueLoading.onLoading();
         const { id } = this.$route.params;
         this.$http.get(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/product/${id}`)
            .then(response => {
               this.product = { ...response.data.product };
               this.hasData = true;
               this.getCart();
               this.$refs.vueLoading.onCancel();
            }).catch(error => {
               this.$refs.modalMessage.callMessage(`Oops! 「${error.data.message}」`, 'error');
               this.$refs.vueLoading.onCancel();
            });
      },
      getCart() { // 檢查是否此商品已經加入購物車，若加入，則改變 button 的文字
         // 萬一不小心進入 ProductView 這頁，不確定這商品是否已經加入購物車，就直接導回 ClientView。
         if (!this.$route.params.carts) {
            this.leave();
            return;
         }
         const carts = JSON.parse(this.$route.params.carts);
         const cartItems = carts.map(item => item.product_id);
         this.hasAdded = (cartItems.indexOf(this.product.id) !== -1);
      },
      addToCart() { // click 加入購物車、回到 ClientView
         if (!this.hasAdded) {
            this.$refs.vueLoading.onLoading();
            const tempCart = { product_id: this.product.id, qty: 1 };
            const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`;
            this.$http.post(url, { data: tempCart }).then(response => {
               this.$refs.vueLoading.onCancel();
               this.$refs.modalMessage.callMessage(`商品「${this.product.title}」 已成功加入購物車！`);
               this.leave();
            }).catch(error => {
               this.$refs.vueLoading.onCancel();
               this.$refs.modalMessage.callMessage(`Oops! 「${error.data.message}」`, 'error');
               this.leave();
            });
         } else this.leave();
      },
      leave() {
         this.$router.push('/client');
      },
      loadPhotoSuccess(event) { // 載圖成功
         // console.log('loadPhotoSuccess:' , event);
      },
      loadPhotoError(event) { // 載圖失敗
         event.target.src = notFoundImg;
      },
   },
   components: {
      CloseButton, ModalMessage, VueLoading
   },
   emits: ['update:routeChanged'],
   mounted() {
      this.$emit('update:routeChanged', this.$route.params.id);
      this.apiGetProduct();
   },
};
</script>
