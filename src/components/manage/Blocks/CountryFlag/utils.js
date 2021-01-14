// import superagent from 'superagent';

// function memoize(func) {
//   var memo = {};
//   var slice = Array.prototype.slice;
//
//   return function () {
//     var args = slice.call(arguments);
//
//     if (args in memo) return memo[args];
//     else return (memo[args] = func.apply(this, args));
//   };
// }

// export const getCountriesVocab = async () => {
//   const cmod = await import('./data/countries.tsv');
//   const wmod = await import('./data/world-country-names.tsv');
//   const countries_url = cmod.default;
//   const world_url = wmod.default;
//
//   let countries_text, world_text;
//   try {
//     countries_text = await superagent.get(countries_url);
//     world_text = await superagent.get(world_url);
//   } catch (err) {
//     return {};
//   }
//
//   console.log('mod', countries_url, world_url, countries_text, world_text);
// };
