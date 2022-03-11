<template>
   <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
         <div class="shadow overflow-hidden border-gray-200 sm:rounded-lg bg-gray-100 py-8 px-8">
            <div class="mb-6 flex justify-between">
               <div>
                  <h3 class="text-xl font-semibold mb-1">
                     <slot name="title">Plan</slot>
                  </h3>
                  <p class="text-gray-500 text-sm">
                     <slot name="subTitle">該產品列表可新增、修改或刪除相關資料</slot>
                  </p>
               </div>
               <div class="py-2 text-sm">
                  <slot name="title-btn">
                     <button type="button"
                        class="btn-rounded-none bg-blue-600 hover:bg-blue-700">
                        + New Item
                     </button>
                  </slot>
               </div>
            </div>
            <div class="shadow overflow-hidden border-gray-200 sm:rounded-lg bg-gray-50 border-t-2 overflow-x-auto">
               <div class="min-w-full divide-y border-gray-200">
                  <!-- List Header -->
                  <slot name="tableHeader" :style="style">
                     <div class="bg-gray-50 grid grid-cols-[3fr_4fr_minmax(340px,_2fr)]">
                        <div class="list-header-col">Name</div>
                        <div class="list-header-col">Title</div>
                        <div class="list-header-col">Status</div>
                     </div>
                  </slot>
                  <!-- List Body -->
                  <slot name="tableBody" :style="style">
                     <div class="bg-white text-sm text-gray-700 items-center
                        grid grid-cols-[3fr_4fr_minmax(340px,_2fr)]">
                        <span class="px-6 py-2 whitespace-nowrap">Cody Hill</span>
                        <span class="px-6 py-2 whitespace-nowrap">CEO</span>
                        <span class="px-6 py-2 whitespace-nowrap">Active</span>
                     </div>
                  </slot>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
export default {
   data() {
      return {
         style: {
            header: 'list-header-col px-8',
            body: 'px-8 py-2 whitespace-nowrap',
         }
      };
   },
};
</script>
