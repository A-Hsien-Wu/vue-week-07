<template>
   <div class="invisible">
      <div class="w-full md:w-[500px] fixed top-0 md:left-1/2 md:ml-[-250px] shadow-md rounded-lg overflow-hidden">
         <div class="px-6 py-3 text-sm fx-center-x gap-4 overflow-hidden"
            :class="style">
            <img src="../assets/images/check_circle_black_24dp.svg"
               class="w-4 aspect-square object-cover filter-blue-800">
            <span>{{message}}</span>
         </div>
      </div>
   </div>
</template>

<script>
import { gsap } from 'gsap';

export default {
   name: 'ModalMessage',
   data() {
      return {
         isDisplay: false,
         message: '',
         style: ['bg-blue-100', 'text-blue-800'],
         tweenMaxDefault: { ease: 'power4.inOut', duration: 0.6 },
      };
   },
   methods: {
      callMessage(msg, status = 'added') {
         this.isDisplay = true;
         this.message = msg;
         if (status === 'added') {
            this.style = ['bg-blue-100', 'text-blue-800'];
         } else if (status === 'empty') {
            this.style = ['bg-white', 'text-gray-800'];
         } else if (status === 'qty') {
            this.style = ['bg-green-100', 'text-green-800'];
         } else if (status === 'error') {
            this.style = ['bg-red-100', 'text-red-800'];
         }
      },
   },
   watch: {
      isDisplay(value) {
         gsap.to(this.$el, { ...this.tweenMaxDefault, autoAlpha: (value ? 1 : 0) });
         gsap.fromTo(this.$el.children,
            { ...this.tweenMaxDefault, y: (value ? -60 : 0) },
            { ...this.tweenMaxDefault, y: (value ? 0 : -60) });
         // this.$el to get this component itself
         if (value) {
            setTimeout(() => { this.isDisplay = false; }, 800);
         }
      },

   },
   mounted() {},
};
</script>
