export const getValue = (obj, expression) => {
  try {
    return expression.split(".").reduce((o, x, i) => {
      if (i === 0) {
        return o;
      }
      return typeof o === "undefined" || o === null ? undefined : o[x];
    }, obj);
  } catch (e) {
    console.error("Failed to getValue => ", e);
    return undefined;
  }
};
