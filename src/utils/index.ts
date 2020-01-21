export const convertPoundsToPence = (price: any): number => {
  return parseInt((price / 100).toFixed(2), 10);
};

export const convertPenceToPounds = (price: any): number => {
  return parseInt((price * 100).toFixed(0), 10);
};
