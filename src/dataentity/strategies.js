// const INLINE_DATA_REGEX = /#data{[\w\u0590-\u05ff]@[\w|]}+/g;
// const INLINE_DATA_REGEX = /#data{[\w/@]}+/g;
const INLINE_DATA_REGEX = /#/g;

export function inlineDataEntityStrategy(contentBlock, callback, contentState) {
  //
  const text = contentBlock.getText();
  console.log('inline strategy trying text', text, INLINE_DATA_REGEX);
  let matchArr, start;
  while ((matchArr = INLINE_DATA_REGEX.exec(text)) !== null) {
    start = matchArr.index;
    console.log('got strategy match');
    callback(start, start + matchArr[0].length);
  }
}
