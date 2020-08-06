//import { timeFormat } from "d3";

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
  
  console.log('entering generateDataSets');

  const dataSets = [];
  //const currentYear = +timeFormat("%Y")(new Date());
  const currentYear = (new Date()).getFullYear();

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

  console.log(dataSets);
  return dataSets;
}


//import * as d3 from "d3";

export function BarChartRace(chartId, extendedSettings) {

  console.log('entering BArChartRace');

  const chartSettings = {
    width: 500,
    height: 400,
    padding: 40,
    titlePadding: 5,
    columnPadding: 0.4,
    ticksInXAxis: 5,
    duration: 3500,
    ...extendedSettings
  };

  chartSettings.innerWidth = chartSettings.width - chartSettings.padding * 2;
  chartSettings.innerHeight = chartSettings.height - chartSettings.padding * 2;

  const chartDataSets = [];
  let chartTransition;

  const chartContainer = d3.select(`#${chartId} .chart-container`);
  const xAxisContainer = d3.select(`#${chartId} .x-axis`);
  const yAxisContainer = d3.select(`#${chartId} .y-axis`);

  const xAxisScale = d3.scaleLinear().range([0, chartSettings.innerWidth]);

  const yAxisScale = d3
    .scaleBand()
    .range([0, chartSettings.innerHeight])
    .padding(chartSettings.columnPadding);

  d3.select(`#${chartId}`)
    .attr("width", chartSettings.width)
    .attr("height", chartSettings.height);

  chartContainer.attr(
    "transform",
    `translate(${chartSettings.padding} ${chartSettings.padding})`
  );

  chartContainer
    .select(".current-date")
    .attr(
      "transform",
      `translate(${chartSettings.innerWidth} ${chartSettings.innerHeight})`
    );

  function draw({ dataSet, date: currentDate }, transition) {
    console.log('draw');


    // we will implement this function

    return this;
  }

  function addDataset(dataSet) {

    console.log('add dataset');

    chartDataSets.push(dataSet);

    return this;
  }

  function addDatasets(dataSets) {
    console.log('add datasets');

    chartDataSets.push.apply(chartDataSets, dataSets);

    return this;
  }

  function setTitle(title) {

    console.log('set title');

    d3.select(".chart-title")
      .attr("x", chartSettings.width / 2)
      .attr("y", -chartSettings.padding / 2)
      .text(title);

    return this;
  }

  function render() {

    console.log('render');


    // we will implement this function




    return this;
  }

  return {
    addDataset,
    addDatasets,
    render,
    setTitle
  };
}



const myChart = new BarChartRace("bar-chart-race");

myChart
  .setTitle("Bar Chart Race Title")
  .addDatasets(generateDataSets({ size: 5 }))
  .render();
