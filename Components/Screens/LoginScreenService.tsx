export const patternCheckForMobile = (input: string) => {
  var mobileNumberPatter = /^\d+(\.\d+)?$/;
  return mobileNumberPatter.test(input);
};
