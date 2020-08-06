import { timeFormat } from "d3";

const brands = [
  "Apple",
  "Google",
  "Huawei",
  "LG",
  "Motorola",
  "Nokia",
  "Razer",
  "Samsung"
];

export function generateDataSets({ size = 1 }) {
  const dataSets = [];
  const currentYear = +timeFormat("%Y")(new Date());
  const maxLimitForValue = 2000;
  const minLimitForValue = 200;

  for (let i = 0; i < size; i++) {
    dataSets.push({
      date: currentYear - (size - (i + 1)),
      dataSet: brands.map(brand => ({
        name: brand,
        value:
          Math.random() * (maxLimitForValue - minLimitForValue) +
          minLimitForValue
      }))
    });
  }

  return dataSets;
}
