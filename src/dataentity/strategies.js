const INLINE_DATA_REGEX = /#data{([\w\u0590-\u05ff]@[\w|])?}+/g;

export function inlineDataEntityStrategy(contentBlock, callback, contentState) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = INLINE_DATA_REGEX.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}
