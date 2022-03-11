<script>
import TableTitle from '../components/table/TableTitle.vue';
import Pagination from '../components/PaginationComp.vue';
import ModalProductVue from '@/components/ModalProduct.vue';
import VueLoading from '../components/VueLoading.vue';

export default {
   data() {
      return {
         products: [],
         pagination: {},
      };
   },
   methods: {
      apiGetProducts(page = 1) { // 取得所有產品列（更新產品列表）
         this.$refs.vueLoading.onLoading();
         const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/products?page=${page}`;
         this.$http.get(url).then(response => {
            // console.log('取出產品列表:', response.data);
            this.$refs.vueLoading.onCancel();
            this.products = [...response.data.products];
            this.pagination = { ...response.data.pagination };
         }).catch(error => {
            console.log('取出產品列表 error:', error?.response);
         });
      },
      apiUpdateProducts(item) { // 取得所有產品列（更新產品列表）
         // this.$refs.vueLoading.onLoading();
         item.is_enabled = item.is_enabled === 0 ? 1 : 0;
         const theProduct = { data: { ...item } };
         const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product/${item.id}`;
         this.$http.put(url, theProduct).then(response => {
            // this.$refs.vueLoading.onCancel();
         }).catch(error => {
            console.log('取出產品列表 error:', error?.response);
         });
      },
      apiDeleteItem(id) { // 刪除
         const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product/${id}`;
         this.$http.delete(url).then(response => {
            // console.log('delete:', response.data);
            this.apiGetProducts();
         }).catch(error => {
            console.log('delete error:', error?.response);
         });
      },
      callModal(mode = 'create', data = {}) { // 執行 modalProduct 裡面的方法
         this.$refs.modalProduct.mode = mode;
         this.$refs.modalProduct.getData(data, this.pagination.current_page);
         this.$refs.modalProduct.isModalShow = true;
      },
      test(page = 0) {
         console.log('test', page);
      },
   },
   components: { Pagination, VueLoading, TableTitle, ModalProductVue },
   mounted() {
      this.apiGetProducts();
   },
};
</script>

<template>
   <TableTitle class="mt-6 mb-4">
      <template #title>後台產品列表</template>
      <template #title-btn>
         <button type="button" class="btn-rounded-none bg-blue-600 hover:bg-blue-700"
            @click.prevent="callModal()">+ New Item</button>
      </template>
      <template #tableHeader="headerStyle">
         <div class="bg-gray-50 grid grid-cols-[40px_2fr_2fr_1fr_2fr_1fr]">
            <div></div>
            <div :class="headerStyle.style.header">product name</div>
            <div :class="headerStyle.style.header">original price</div>
            <div :class="headerStyle.style.header">price</div>
            <div :class="headerStyle.style.header">status</div>
            <div></div>
         </div>
      </template>

      <template #tableBody="prop">
         <div class="bg-white text-sm text-gray-700 items-center grid grid-cols-[40px_2fr_2fr_1fr_2fr_1fr]"
            v-for="(item,index) in products" :key="item.title+index">
            <div class="pl-4">
               <a href="#" @click.prevent="apiDeleteItem(item.id);">
                  <img src="../assets/images/remove_circle_black_24dp.svg" class="w-4 aspect-square object-cover filter-red">
               </a>
            </div>
            <div :class="prop.style.body" class="text-left">{{ item.title }}</div>
            <div :class="prop.style.body" class="text-left text-gray-500">${{ $filter.currency(item.price) }}</div>
            <div :class="prop.style.body" class="text-left text-gray-500">${{ $filter.currency(item.origin_price) }}</div>
            <div :class="prop.style.body" class="text-left">
               <button type="button">
                  <span :class="[item.is_enabled ? 'bullet-text bullet-leaf' : 'bullet-text bullet-danger']"
                     @click.prevent="apiUpdateProducts(item)">
                     {{ item.is_enabled ? 'active' : 'inactive' }}
                  </span>
               </button>
            </div>
            <div :class="prop.style.body" class="text-right">
               <a href="#" class="font-medium" @click.prevent="callModal('edit', item)">Edit</a>
            </div>
         </div>
      </template>
   </TableTitle>

   <Pagination :pages="pagination" @emit_change_page="apiGetProducts"></Pagination>
   <VueLoading ref="vueLoading"></VueLoading>
   <ModalProductVue ref="modalProduct" @emitRefreshEvent="apiGetProducts"></ModalProductVue>
</template>
