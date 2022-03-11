<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
   data() {
      return {
         isLoading: false,
         fullPage: true
      };
   },
   components: {
      Loading
   },
   methods: {
      onCancel() {
         this.isLoading = false;
      },
      onLoading() {
         this.isLoading = true;
      },
   },
};
</script>

<template>
   <div class="vld-parent">
      <loading
         v-model:active="isLoading"
         :can-cancel="false"
         :on-cancel="onCancel"
         :is-full-page="fullPage"
      />
   </div>
</template>
