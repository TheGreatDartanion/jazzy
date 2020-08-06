d3.json('data.json').then(data => {

console.log(data);

outJSON = data;

var groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
var groubedByTeam=groupBy(outJSON, 'ApprovalFiscalYear')
console.log(groubedByTeam);

keys = Object.keys(groubedByTeam);
values = Object.values(groubedByTeam);

len_keys = keys.length;

console.log(len_keys);

var objs = [];


for (i = 0; i < 5; i++){
    console.log(i);

    var obj = {'date': keys[i], 'dataSet': values[i].slice(0,10)}; //not long term; sort and slice long term
    
    console.log(obj);
    objs.push(obj)
}

console.log(objs);

data_json = objs;

// output will be:
// [ { name: 'name1', age: 'age1', hometown: 'hometown1' },
//   { name: 'name2', age: 'age2', hometown: 'hometown2' },
//   { name: 'name3', age: 'age3', hometown: 'hometown3' } ]


//console.log(data_json);


  const brands = [
    "Alcatel",
    "Apple",
    "Google",
    "Huawei",
    "LG",
    "Motorola",
    "Nokia",
    "Razer",
    "Samsung",
    "Xiaomi",
    "HTC",
    "Sony",
    "BlackBerry",
    "Palm",
    "ZTE",
    "Oppo",
    "Lenovo"
  ];

  function generateDataSets({ size = 1 }) {
  /*
    const dataSets = [];
    const currentYear = (new Date()).getFullYear();
    const maxLimitForValue = 2000;
    const minLimitForValue = 200;
    const maximumModelCount = 10;

    for (let i = 0; i < size; i++) {
      dataSets.push({
        date: currentYear - (size - (i + 1)),
        dataSet: brands
          .sort(function() {
            return Math.random() - 0.5;
          })
          .slice(0, maximumModelCount)
          .map(brand => ({
            name: brand,
            value:
              Math.random() * (maxLimitForValue - minLimitForValue) +
              minLimitForValue
          }))
      });
    }
    */

    console.log(dataSets);

    return dataSets;
  }


  function BarChartRace(chartId, extendedSettings) {
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
    let timerStart, timerEnd;
    let currentDataSetIndex = 0;
    let elapsedTime = chartSettings.duration;

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
      const { innerHeight, ticksInXAxis, titlePadding } = chartSettings;
      const dataSetDescendingOrder = dataSet.sort(
        ({ value: firstValue }, { value: secondValue }) =>
          secondValue - firstValue
      );

      chartContainer.select(".current-date").text(currentDate);

      xAxisScale.domain([0, dataSetDescendingOrder[0].value]);
      yAxisScale.domain(dataSetDescendingOrder.map(({ name }) => name));

      xAxisContainer.transition(transition).call(
        d3
          .axisTop(xAxisScale)
          .ticks(ticksInXAxis)
          .tickSize(-innerHeight)
      );

      yAxisContainer
        .transition(transition)
        .call(d3.axisLeft(yAxisScale).tickSize(0));

      // The general update Pattern in d3.js

      // Data Binding
      const barGroups = chartContainer
        .select(".columns")
        .selectAll("g.column-container")
        .data(dataSetDescendingOrder, ({ name }) => name);

      // Enter selection
      const barGroupsEnter = barGroups
        .enter()
        .append("g")
        .attr("class", "column-container")
        .attr("transform", `translate(0,${innerHeight})`);

      barGroupsEnter
        .append("rect")
        .attr("class", "column-rect")
        .attr("width", 0)
        .attr("height", yAxisScale.step() * (1 - chartSettings.columnPadding));

      barGroupsEnter
        .append("text")
        .attr("class", "column-title")
        .attr("y", (yAxisScale.step() * (1 - chartSettings.columnPadding)) / 2)
        .attr("x", -titlePadding)
        .text(({ name }) => name);

      barGroupsEnter
        .append("text")
        .attr("class", "column-value")
        .attr("y", (yAxisScale.step() * (1 - chartSettings.columnPadding)) / 2)
        .attr("x", titlePadding)
        .text(0);

      // Update selection
      const barUpdate = barGroupsEnter.merge(barGroups);

      barUpdate
        .transition(transition)
        .attr("transform", ({ name }) => `translate(0,${yAxisScale(name)})`)
        .attr("fill", "normal");

      barUpdate
        .select(".column-rect")
        .transition(transition)
        .attr("width", ({ value }) => xAxisScale(value));

      barUpdate
        .select(".column-title")
        .transition(transition)
        .attr("x", ({ value }) => xAxisScale(value) - titlePadding);

      barUpdate
        .select(".column-value")
        .transition(transition)
        .attr("x", ({ value }) => xAxisScale(value) + titlePadding)
        .tween("text", function({ value }) {
          const interpolateStartValue =
            elapsedTime === chartSettings.duration
              ? this.currentValue || 0
              : +this.innerHTML;

          const interpolate = d3.interpolate(interpolateStartValue, value);
          this.currentValue = value;

          return function(t) {
            d3.select(this).text(Math.ceil(interpolate(t)));
          };
        });

      // Exit selection
      const bodyExit = barGroups.exit();

      bodyExit
        .transition(transition)
        .attr("transform", `translate(0,${innerHeight})`)
        .on("end", function() {
          d3.select(this).attr("fill", "none");
        });

      bodyExit
        .select(".column-title")
        .transition(transition)
        .attr("x", 0);

      bodyExit
        .select(".column-rect")
        .transition(transition)
        .attr("width", 0);

      bodyExit
        .select(".column-value")
        .transition(transition)
        .attr("x", titlePadding)
        .tween("text", function() {
          const interpolate = d3.interpolate(this.currentValue, 0);
          this.currentValue = 0;

          return function(t) {
            d3.select(this).text(Math.ceil(interpolate(t)));
          };
        });

      return this;
    }

    function addDataset(dataSet) {
      chartDataSets.push(dataSet);

      return this;
    }

    function addDatasets(dataSets) {
      chartDataSets.push.apply(chartDataSets, dataSets);

      return this;
    }

    function setTitle(title) {
      d3.select(".chart-title")
        .attr("x", chartSettings.width / 2)
        .attr("y", -chartSettings.padding / 2)
        .text(title);

      return this;
    }

    /* async function render() {
      for (const chartDataSet of chartDataSets) {
        chartTransition = chartContainer
          .transition()
          .duration(chartSettings.duration)
          .ease(d3.easeLinear);

        draw(chartDataSet, chartTransition);

        await chartTransition.end();
      }
    } */

    async function render(index = 0) {
      currentDataSetIndex = index;
      timerStart = d3.now();

      chartTransition = chartContainer
        .transition()
        .duration(elapsedTime)
        .ease(d3.easeLinear)
        .on("end", () => {
          if (index < chartDataSets.length) {
            elapsedTime = chartSettings.duration;
            render(index + 1);
          } else {
            d3.select("button").text("Play");
          }
        })
        .on("interrupt", () => {
          timerEnd = d3.now();
        });

      if (index < chartDataSets.length) {
        draw(chartDataSets[index], chartTransition);
      }

      return this;
    }

    function stop() {
      d3.select(`#${chartId}`)
        .selectAll("*")
        .interrupt();

      return this;
    }

    function start() {
      elapsedTime -= timerEnd - timerStart;

      render(currentDataSetIndex);

      return this;
    }

    return {
      addDataset,
      addDatasets,
      render,
      setTitle,
      start,
      stop
    };
  }

  //import { generateDataSets } from "./dataGenerator";
  //import { BarChartRace } from "./BarChartRace";

  // import { select as d3Select } from "d3";

  const myChart = new BarChartRace("bar-chart-race");

  myChart
    .setTitle("Bar Chart Race Title")
    .addDatasets(data_json)
    .render();

  d3.select("button").on("click", function() {
    if (this.innerHTML === "Stop") {
      this.innerHTML = "Resume";
      myChart.stop();
    } else if (this.innerHTML === "Resume") {
      this.innerHTML = "Stop";
      myChart.start();
    } else {
      this.innerHTML = "Stop";
      myChart.render();
    }
  });


});
