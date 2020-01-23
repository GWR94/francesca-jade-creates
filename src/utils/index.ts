import { Toaster as AppToaster } from "@blueprintjs/core";

export const Toaster = AppToaster.create({
  position: "top",
});

export const convertPoundsToPence = (price): number => {
  return parseInt((price / 100).toFixed(2), 10);
};

export const convertPenceToPounds = (price): number => {
  return parseInt((price * 100).toFixed(0), 10);
};
