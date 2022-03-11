<template>
   <div class="flex flex-col gap-4">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
         <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div class="shadow overflow-hidden border-gray-200 sm:rounded-lg bg-gray-50">
               <div class="min-w-full divide-y border-gray-200 border-b-2">
                  <!-- List Header -->
                  <slot name="header" :style="style">
                     <div class="bg-gray-50 grid grid-cols-[3fr_4fr_minmax(340px,_2fr)]">
                        <div class="list-header-col">Name</div>
                        <div class="list-header-col">Title</div>
                        <div class="list-header-col">Status</div>
                     </div>
                  </slot>
                  <!-- List Body -->
                  <slot name="body" :style="style">
                     <div class="bg-white grid grid-cols-[3fr_4fr_minmax(340px,_2fr)] text-gray-700 items-center">
                        <span class="px-6 py-4 whitespace-nowrap">Cody Hill</span>
                        <span class="px-6 py-4 whitespace-nowrap">CEO</span>
                        <span class="px-6 py-4 whitespace-nowrap">Active</span>
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
            body: 'px-8 py-4 whitespace-nowrap',
         }
      };
   },
};
</script>
