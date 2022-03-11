// 數字千分號，console.log(currency(1000)); ⇢ 1,000
// 可掛載到 main.js 做全域使用
// $filter 為自定義的名稱，加上 $，是為了不跟
// usage ⇣
/**
 * import { currency } from './methods/filter';
 *
 * app.config.globalProperties.$filter = {
 *    currency,
 * };
 */
// $filter.currency(6000);
export function currency(num) {
   const n = parseInt(num, 10);
   return n.toFixed(0).replace(/./g, (c, i, a) => (i && c !== '.' && ((a.length - i) % 3 === 0) ? ',' + c : c));
}

// $filter.numberFormat(6000);
export function numberFormat(num) {
   return new Intl.NumberFormat().format(num);
}

// -----------------------------------

// 時間格式
export function dateFormat(time) {
   const localDate = new Date(time * 1000);
   return localDate.toLocaleDateString();
}

// -----------------------------------

// 轉換 style="background-image:url('path')" 為 template 可用模式
// usage ⇣
/**
 * import { currency } from './methods/filter';
 *
 * <div :style="$filter.inlineBgUrl('assets/images/image.svg')"></div>
 */
export function inlineBgUrl(url) {
   return { backgroundImage: 'url(\'' + require(`@/${url}`) + '\')' };
}
