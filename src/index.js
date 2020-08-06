import { generateDataSets } from "./dataGenerator.js";
import { BarChartRace } from "./BarChartRace.js";

const myChart = new BarChartRace("bar-chart-race");

myChart
  .setTitle("Bar Chart Race Title")
  .addDatasets(generateDataSets({ size: 5 }))
  .render();
