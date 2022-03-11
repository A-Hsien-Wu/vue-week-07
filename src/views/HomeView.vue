<template>
   <div class="container mx-auto h-screen flex flex-col fx-center">
      <img alt="Vue logo" src="../assets/logo.png" />
      <h1 class="text-white text-8xl">Hello Welcome</h1>
      <TestComponent class="text-white"/>
   </div>
</template>

<script>
// @ is an alias to /src
import TestComponent from '@/components/TestComponent.vue';

export default {
   name: 'HomeView',
   components: {
      TestComponent,
   },
   provide: {
      text: 'provide 測試'
   }
};
</script>
