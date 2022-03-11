<template>
   <nav class="bg-gray-800">
      <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
         <div class="relative flex items-center justify-between h-16">
            <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
               <!-- Mobile menu button-->
               <button type="button" class="nav-hamburger-link" aria-controls="mobile-menu"
                  :aria-expanded="isHamburgerOn" @click.prevent="isHamburgerOn=!isHamburgerOn">
                  <span class="sr-only">Open main menu</span>
                     <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" :aria-hidden="!isHamburgerOn"
                        v-show="!isHamburgerOn">
                        <path stroke-linecap="round" stroke-linejoin="round"
                           stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                     </svg>
                     <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" :aria-hidden="isHamburgerOn"
                        v-show="isHamburgerOn">
                        <path stroke-linecap="round" stroke-linejoin="round"
                           stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                     </svg>
               </button>
            </div>

            <div class="flex-1 flex items-center justify-center sm:justify-start">
            <!-- logo here -->
               <div class="flex-shrink-0 flex items-center">
                  <a href="#" class="nav-link">
                     <img alt="Vue logo" src="../assets/logo.png" class="icon-cover w-6 sm:w-8" />
                  </a>
               </div>
            <!-- item links -->
               <div class="hidden sm:block sm:ml-6">
                  <div class="flex space-x-4">
                     <slot name="links">
                        <a href="#" class="nav-link nav-link-current">Dashboard</a>
                        <a href="#" class="nav-link">Team</a>
                     </slot>
                  </div>
               </div>
            </div>
         <!-- sign in -->
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
               <slot name="admin-links">
                  <button type="button" class="bg-violet-700 hover:bg-violet-500 nav-link flex-none">
                     <span class="mobile-off">Admin Sign in</span>
                     <img class="icon-cover w-6 sm:w-8 mobile-on" alt="Login" src="../assets/images/login_white_24dp.svg" />
                  </button>
               </slot>
            </div>

         </div>
      </div>

      <div v-show="isHamburgerOn" class="sm:hidden" id="mobile-menu">
         <div class="flex flex-col px-2 pt-2 pb-3 space-y-1">
            <slot name="links">
               <a href="#" class="nav-link nav-link-current">Dashboard</a>
               <a href="#" class="nav-link">Team</a>
            </slot>
         </div>
      </div>
   </nav>
</template>

<script>
export default {
   data() {
      return {
         isHamburgerOn: false,
         routePath: '',
      };
   },
   watch: {
      routePath(value) {
         // console.log('watch', value);
      }
   },
   mounted() {

   },
};
</script>

<style>
.slide-up-enter-active,
.slide-up-leave-active {
   transition: all 0.25s ease-out;
}
.slide-up-enter-from {
   opacity: 0;
   transform: translateY(30px);
}
.slide-up-leave-to {
   opacity: 0;
   transform: translateY(-30px);
}

.fade-enter-active, .fade-leave-active {
   transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
   opacity: 0;
}

.bounce-enter-active {
   animation: bounce-in 0.5s;
}
.bounce-leave-active {
   animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
   0% {
      transform: scale(0);
   }
   50% {
      transform: scale(1.25);
   }
   100% {
      transform: scale(1);
   }
}
</style>
