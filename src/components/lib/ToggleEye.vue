<template>
   <div class="cursor-pointer" @click.prevent="isShow=!isShow; $emit('emit_toggle', isShow)">
      <span
         class="block w-4 h-4 bg-cover"
         :style="{ backgroundImage:'url(\''+require('@/assets/images/visibility_black_24dp.svg')+'\')' }"
         v-if="!isShow"
      ></span>
      <span
         class="block w-4 h-4 bg-cover"
         :style="{ backgroundImage:'url(\'' + require('@/assets/images/visibility_off_black_24dp.svg') + '\')' }"
         v-else
      ></span>
   </div>
</template>

<script>
/** - usage
<ToggleEye class="absolute right-0 bottom-2"
   @emit_toggle="showPassword=$event">
</ToggleEye>
**/
export default {
   data() {
      return {
         isShow: false,
      };
   },
};
</script>
