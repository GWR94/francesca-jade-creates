export const convertPoundsToPence = (price): number => {
  return parseInt((price * 100).toFixed(2), 10);
};

export const convertPenceToPounds = (price): number => {
  return parseInt((price / 100).toFixed(0), 10);
};

export const attributesToObject = (attributes): any => {
  const obj = {};
  if (attributes) {
    // eslint-disable-next-line array-callback-return
    attributes.map((attribute): void => {
      if (attribute.Value === "true") {
        obj[attribute.Name] = true;
      } else if (attribute.Value === "false") {
        obj[attribute.Name] = false;
      } else {
        obj[attribute.Name] = attribute.Value;
      }
    });
  }
  return obj;
};
