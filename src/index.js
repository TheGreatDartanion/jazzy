import "./styles.css";
import { generateDataSets } from "./dataGenerator";
import { BarChartRace } from "./BarChartRace";

const myChart = new BarChartRace("bar-chart-race");

myChart
  .setTitle("Bar Chart Race Title")
  .addDatasets(generateDataSets({ size: 5 }))
  .render();
