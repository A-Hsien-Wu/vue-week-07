<script>
import CloseButtonVue from './lib/CloseButton.vue';
// import ImgDelete from '../assets/images/delete_white_24dp.svg';
// ⇡ 把圖載進來後，在 data return 把圖接起來，就可以給 style 用了
// ⇡ :style="`{backgroundImage:url(${imgDelete})}`"
import gsap from 'gsap';

export default {
   data() {
      return {
         mode: 'create',
         product: {},
         unitArr: ['個', '件', '支', '張', '隻', '塊', '本', '顆', '台', '片', '把', '份'],
         isMainPhotoSuccess: false,
         uploadInfo: { status: '', msg: '' },
         saveStatus: 'save',
         checkEnabled: { checkToActive: false },
         isModalShow: false,
         editMoreImg: '',
         currentPage: 1,
         // imgDelete: ImgDelete,
      };
   },
   methods: {
      getData(data, page = 1) { // 外層的按鈕事件執行後，執行此函式
         this.checkEnabled.checkToActive = false;
         this.product = JSON.parse(JSON.stringify(data));
         this.product.is_enabled = this.product.is_enabled ? 1 : 0;
         this.currentPage = page;
         if (this.product.is_enabled === 1) this.checkEnabled.checkToActive = true;
         if (!this.product.stock) this.product.stock = 0;
         if (!this.product.imageUrl) this.product.imageUrl = '';
      },
      apiCreate() { // 新增產品
         const productPackage = { data: { ...this.product } };
         this.saveStatus = 'saving';
         const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product`;
         this.$http.post(url, productPackage).then(response => {
            // console.log('新增產品 success:', response.data);
            this.saveStatus = 'success';
            this.$emit('emitRefreshEvent'); // 新增後，直接跳到第一頁
            this.getData({});
         }).catch(error => {
            console.log('新增產品 error:', error?.response);
         });
      },
      apiEdit() { // 修改產品
         const productPackage = { data: { ...this.product } };
         this.saveStatus = 'saving';
         const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product/${this.product.id}`;
         this.$http.put(url, productPackage).then(response => {
            this.saveStatus = 'success';
            this.$emit('emitRefreshEvent', this.currentPage); // 修改完，仍維持在原本頁數
         }).catch(error => {
            console.log('修改 error:', error?.response);
         });
      },
      apiUploadFile(e) { // 上傳圖片
         this.uploadInfo.status = 'uploading';
         this.uploadInfo.msg = 'Uploading!';
         // console.log('file:', e.target.files[0]);
         const file = e.target.files[0];
         const formData = new FormData();
         formData.append('file-to-upload', file);
         if (!this.product.imagesUrl) this.product.imagesUrl = [];
         const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/upload/`;
         this.$http.post(url, formData)
            .then(response => {
               // console.log('upload success:', response);
               this.uploadInfo.status = 'success';
               this.uploadInfo.msg = 'Success!';
               this.product.imagesUrl.push(response.data.imageUrl);
            })
            .catch(error => {
               console.log('upload fail:', error);
               this.uploadInfo.status = 'fail';
               this.uploadInfo.msg = `（狀態：${error.response.data.message}）`;
            });
      },
      uploadFakeFile(e) { // 上傳圖片：測試用的
         this.info.status = 'uploading';
         this.info.msg = 'Uploading!';
         // console.log('file:' , e.target.files[0]);
         const file = e.target.files[0];
         const reader = new FileReader();
         reader.readAsDataURL(file);
         reader.addEventListener('load', () => {
            this.product.imagesUrl.push(reader.result);
         });
      },
      removeUpload(index) { // 上傳圖片：移除
         this.product.imagesUrl.splice(index, 1);
         // 無法遠端刪除，僅移除陣列內的圖片網址
      },
      loadPhotoSuccess(event) { // 主圖成功
         this.isMainPhotoSuccess = true;
      },
      loadPhotoError(event) { // 主圖失敗
         this.isMainPhotoSuccess = false;
      },
      setSample() { // modal 新增時，懶得填資料可以用的樣板
         this.product.title = '肋眼牛排';
         this.product.category = '食物';
         this.product.origin_price = 1080;
         this.product.price = 980;
         this.product.unit = '份';
         this.product.stock = 0;
         this.product.description = 'Why go to a steakhouse when you can make the most perfect ribEye right at home? Pan seared with the best garlicky herb butter!';
         this.product.content = 'U.S. Prime or Choice';
         this.checkEnabled.checkToActive = 0;
         // this.product.is_enabled = 0;
         this.product.imageUrl = 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=627&q=80';
         this.product.imagesUrl = [
            'https://images.unsplash.com/photo-1615937691194-97dbd3f3dc29?auto=format&fit=crop&w=1470&q=80',
            'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1470&q=80',
            'https://images.unsplash.com/photo-1626790291085-19a27173773c?auto=format&fit=crop&w=687&q=80',
            'https://images.unsplash.com/photo-1611518040286-9af8ba97ab46?auto=format&fit=crop&w=687&q=80',
            'https://images.unsplash.com/photo-1612078894671-f11ba41d713e?auto=format&fit=crop&w=687&q=80'];
      },
   },
   computed: {
      discount() {
         if (this.product.origin_price && this.product.price) {
            return Math.round(-(100 - (this.product.price / this.product.origin_price) * 100));
         } else {
            return undefined;
         }
      },
   },
   watch: {
      isModalShow(value) {
         gsap.to(this.$el, { ...this.tweenMaxDefault, autoAlpha: (value ? 1 : 0) });
         gsap.to(this.$refs.modalInstance, Object.assign({}, this.tweenMaxDefault, { scale: (value ? 1 : 0) }));
      },
      'checkEnabled.checkToActive': function(value) {
         this.product.is_enabled = value ? 1 : 0;
      },
   },
   // props: ['updateData'],
   components: { CloseButtonVue },
   mounted() {
      // this.isModalShow = true; //自動開啟
   },
};
</script>

<template>
   <div class="modal-bottom-layer">
      <div class="container-center flex md:m-auto">
         <div ref="modalInstance" class="modal__content">
            <!-- header -->
            <header class="modal__content__header">
               <h5>{{ mode === 'create' ? 'Add New Product' : 'Edit Product Mode' }}</h5>
               <button
                  class="bg-pink-500 hover:bg-pink-600 focus:ring-pink-400 focus:ring-4 py-1 px-4"
                  @click.prevent="setSample"
                  v-show="mode === 'create'"
               >Sample</button>
               <CloseButtonVue class="p-8 -mr-6 ml-auto filter-white" @click.prevent="isModalShow=false"></CloseButtonVue>
            </header>

            <!-- content -->
            <div class="px-6 py-12">
               <form
                  action
                  autocomplete="off"
                  class="text-gray-500 w-full"
                  @submit.prevent="mode === 'create' ? apiCreate() : apiEdit()"
               >
                  <div class="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">
                     <!-- 1/2 -->
                     <div class="grid grid-cols-6 gap-y-8 gap-x-8 auto-rows-min">
                        <!-- 標題 -->
                        <label for="titleInput" class="col-span-6 relative text-base">
                           <span class="text-blue-500">Title</span>
                           <input
                              type="text"
                              id="titleInput"
                              placeholder="new item title"
                              class="input-style-structure input-style--color"
                              v-model="product.title"
                              required
                           />
                        </label>
                        <!-- 分類 -->
                        <label
                           for="categoryInput"
                           class="col-span-6 md:col-span-2 relative text-base"
                        >
                           <span class="text-blue-500">Category</span>
                           <input
                              type="text"
                              id="categoryInput"
                              placeholder="category"
                              class="input-style-structure input-style--color"
                              v-model="product.category"
                              required
                           />
                        </label>
                        <!-- 存貨 -->
                        <label for="stockInput" class="col-span-6 md:col-span-2 relative text-base">
                           <span
                              :class="{ 'text-green-500': product.stock > 0, 'text-red-500': product.stock == 0, }"
                           >Stock</span>
                           <input
                              type="number"
                              id="stockInput"
                              placeholder="0"
                              class="input-style-structure input-style--color"
                              min="0"
                              v-model.number="product.stock"
                              required
                           />
                        </label>
                        <!-- 單位 -->
                        <label for="unitInput" class="col-span-6 md:col-span-2 relative text-base">
                           <span class="text-blue-500">Unit</span>
                           <select
                              class="input-style-structure input-style--color"
                              aria-label="Default select example"
                              v-model="product.unit"
                           >
                              <option v-for="item in unitArr" :value="item" :key="item">{{ item }}</option>
                           </select>
                        </label>
                        <!-- 原價 -->
                        <label for="priceInput" class="col-span-6 md:col-span-3 relative text-base">
                           <span class="text-blue-500">Price</span>
                           <input
                              type="number"
                              id="priceInput"
                              placeholder="price"
                              class="input-style-structure input-style--color"
                              min="0"
                              v-model.number="product.origin_price"
                              required
                           />
                        </label>
                        <!-- 特價 -->
                        <label
                           for="discountInput"
                           class="col-span-6 md:col-span-3 relative text-base"
                        >
                           <div class="flex">
                              <span class="text-blue-500">Discount</span>
                              <span
                                 v-show="discount"
                                 :class="{ 'text-red-500': discount > 0, 'text-green-500': discount < 0 }"
                              >（{{ discount < 0 ? discount + '%' : '+' + discount + '%' }}）</span>
                           </div>
                           <input
                              type="number"
                              id="discountInput"
                              placeholder="discount"
                              class="input-style-structure input-style--color"
                              min="0"
                              v-model.number="product.price"
                              required
                           />
                        </label>

                        <div class="hidden md:block col-span-6 w-full border-b-2 border-slate-200"></div>

                        <!-- 產品描述 -->
                        <label for="describeInput" class="col-span-6 relative text-base">
                           <span class="text-blue-500">Description</span>
                           <textarea
                              id="describeInput"
                              rows="2"
                              cols="50"
                              placeholder="Describe this product here..."
                              class="input-style-structure input-style--color"
                              v-model="product.description"
                           ></textarea>
                        </label>
                        <!-- 說明內容 -->
                        <label for="contentInput" class="col-span-6 relative text-base">
                           <span class="text-blue-500">Content</span>
                           <textarea
                              rows="2"
                              cols="50"
                              id="contentInput"
                              placeholder="請輸入說明內容..."
                              class="input-style-structure input-style--color"
                              v-model="product.content"
                           ></textarea>
                        </label>
                        <!-- 是否啟用 -->
                        <label for="enabled-switcher" class="col-span-2 mb-4 switcher-label">
                           <input
                              type="checkbox"
                              id="enabled-switcher"
                              class="sr-only"
                              v-model="checkEnabled.checkToActive"
                           />
                           <div class="switcher-bg switcher-bg--off"></div>
                           <span
                              class="switcher-text ml-3 text-sm font-medium flex-none"
                           >check to active</span>
                        </label>
                     </div>

                     <!-- 1/2 -->
                     <div class="grid grid-cols-2 gap-y-8 gap-x-8 auto-rows-min">
                        <!-- 主圖 -->
                        <label for="mainImgInput" class="col-span-2 relative text-base select-none">
                           <span class="text-blue-500">Main Photo</span>
                           <input
                              type="text"
                              id="mainImgInput"
                              placeholder="please paste image link here"
                              class="input-style-structure input-style--color"
                              v-model="product.imageUrl"
                           />
                        </label>
                        <div class="col-span-2 text-blue-300">
                           <div
                              class="rounded-lg bg-no-photo outline-4 outline-gray-300"
                              :class="[isMainPhotoSuccess ? '' : 'outline-dashed']"
                           >
                              <div class="w-full aspect-video rounded-lg flex fx-center">
                                 <span
                                    class="text-yellow-500 text-xl px-4 text-center font-bold"
                                    v-show="!isMainPhotoSuccess"
                                 >Paste Image URL In The Text Field Above</span>
                                 <img
                                    :src="product.imageUrl"
                                    class="w-full aspect-video rounded-lg object-cover"
                                    @load="loadPhotoSuccess"
                                    @error="loadPhotoError"
                                    v-show="isMainPhotoSuccess"
                                 />
                              </div>
                           </div>
                        </div>
                        <!-- 新增次圖 -->
                        <div class="col-span-2" v-if="mode === 'create'">
                           <!-- 新增上傳 -->
                           <div class>
                              <div class="flex gap-2">
                                 <span class="text-blue-500">Other Images</span>
                                 <span
                                    :class="{
                                       'text-red-500': uploadInfo.status == 'fail',
                                       'text-green-500': uploadInfo.status == 'success'
                                    }"
                                    v-show="uploadInfo.status == 'success' || 'fail'"
                                 >{{ uploadInfo.msg }}</span>
                                 <img
                                    src="../assets/images/refresh_black_24dp.svg"
                                    class="animate-spin opacity-30 text-blue-600"
                                    v-show="uploadInfo.status == 'uploading'"
                                 />
                              </div>
                              <div class="upload-box">
                                 <div class="hw-full border-4 border-gray-300 border-dashed">
                                    <div
                                       class="hw-full bg-contain-center opacity-30 relative hover:bg-green-300"
                                       :style="$filter.inlineBgUrl('assets/images/cloud_upload_black_48dp.svg')"
                                    >
                                       <input
                                          type="file"
                                          id="file"
                                          placeholder="drag a file here"
                                          name="file-to-upload"
                                          @change="apiUploadFile"
                                          class="absolute hw-full outline-none cursor-pointer opacity-0"
                                       />
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <!-- 已上傳圖 -->
                           <div class>
                              <div class="md:flex flex-wrap">
                                 <template v-for="(item, i) in product.imagesUrl" :key="item+i">
                                    <div
                                       class="rounded-lg p-2 flex-auto max-w-full min-w-[50%] cursor-pointer"
                                       v-if="product.imagesUrl.length > 0"
                                       @click="removeUpload(i)"
                                    >
                                       <div class="relative">
                                          <img
                                             :src="item"
                                             class="h-24 w-full object-cover rounded-lg"
                                          />
                                          <div
                                             class="rounded-lg absolute hw-full inset-0 bg-contain-center hover:bg-black hover:opacity-50 opacity-0"
                                             :style="$filter.inlineBgUrl('assets/images/delete_white_24dp.svg')"
                                          ></div>
                                       </div>
                                    </div>
                                 </template>
                              </div>
                           </div>
                        </div>
                        <div class="col-span-2" v-else>
                           <span class="text-blue-500">Add More Image</span>
                           <div class="flex mt-1">
                              <label
                                 for="editAddMore"
                                 class="col-span-2 relative text-base select-none w-full"
                              >
                                 <input
                                    type="text"
                                    id="editAddMore"
                                    placeholder="please paste image link here"
                                    class="input-style mt-0 rounded-none rounded-l-md focus:ring-0 focus:border-slate-300"
                                    v-model="editMoreImg"
                                 />
                              </label>
                              <button
                                 type="button"
                                 class="px-6 py-3 bg-white border shadow-sm border-slate-300 border-l-0 focus:bg-zinc-100 rounded-r-md sm:text-sm hover:bg-sky-100 drop-shadow-sm"
                                 @click="editImgToArr"
                              >+</button>
                           </div>
                           <template v-for="(item, i) in product.imagesUrl" :key="item+i">
                              <div class="w-full border-t-2 border-slate-200 md:my-6"></div>
                              <label
                                 :for="'multiImg' + i"
                                 class="col-span-2 relative text-base select-none"
                              >
                                 <input
                                    type="text"
                                    :id="'multiImg' + i"
                                    placeholder="please paste image link here"
                                    class="input-style-structure input-style--color"
                                    v-model="product.imagesUrl[i]"
                                 />
                              </label>
                              <div
                                 class="rounded-lg my-4 flex-auto max-w-full min-w-[50%] cursor-pointer"
                                 v-show="product.imagesUrl[i]"
                                 @click="removeUpload(i)"
                              >
                                 <div class="relative">
                                    <img :src="item" class="h-24 w-full object-cover rounded-lg" />
                                    <div
                                       class="rounded-lg absolute hw-full inset-0 bg-contain-center hover:bg-black hover:opacity-50 opacity-0"
                                       :style="$filter.inlineBgUrl('assets/images/delete_white_24dp.svg')"
                                    ></div>
                                 </div>
                              </div>
                           </template>
                        </div>
                     </div>
                  </div>

                  <div class="w-full border-t-2 border-slate-200 my-4 py-8">
                     <div class="flex gap-4 justify-end items-baseline">
                        <div class="flex gap-1 items-center" v-show="saveStatus == 'success'">
                           <span class="text-green-500">建立成功</span>
                        </div>
                        <button
                           type="button"
                           class="btn-rounded-full bg-gray-600 ring-gray-300"
                           @click.prevent="isModalShow=false"
                        >Close</button>
                        <button
                           type="submit"
                           class="btn-rounded-full bg-blue-600 ring-blue-300"
                           :class="{
                              'bg-green-500': saveStatus == 'success', 'ring-green-300': saveStatus == 'success',
                              'bg-yellow-500': saveStatus == 'saving', 'ring-yellow-300': saveStatus == 'saving'
                           }"
                        >{{ saveStatus }}</button>
                     </div>
                  </div>
               </form>
            </div>
         </div>
      </div>
   </div>
</template>
