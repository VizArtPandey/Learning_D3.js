async function drawLineChart() {
  //1. Load your Dataset
  const dataset = await d3.json("./../../my_weather_data.json");

  //Check the sample values available in the dataset
  //console.table(dataset[0]);

  const yAccessor = (d) => d.temperatureMax;
  const dateParser = d3.timeParse("%Y-%m-%d");
  const xAccessor = (d) => dateParser(d.date);

  //Check the value of xAccessor function now
  //console.log(xAccessor(dataset[0]));

  //2. Create a chart dimension by defining the size of the Wrapper and Margin

  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margin: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60,
    },
  };
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  //3. Draw Canvas

  const wrapper = d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  //Log our new Wrapper Variable to the console to see what it looks like
  //console.log(wrapper);

  //4. Create a Bounding Box

  const bounds = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`
    );

  //5. Define Domain and Range for Scales

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0]);

  //console.log(yScale(32));
  const freezingTemperaturePlacement = yScale(32);
  const freezingTemperatures = bounds
    .append("rect")
    .attr("x", 0)
    .attr("width", dimensions.boundedWidth)
    .attr("y", freezingTemperaturePlacement)
    .attr("height", dimensions.boundedHeight - freezingTemperaturePlacement)
    .attr("fill", "#e0f3f3");

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth]);

  //6. Convert a datapoints into X and Y value
  // Note : d3.line() method will create a generator that converts
  // a data points into a d string
  // This will transform our datapoints with both the Accessor function
  // and the scale tp get the Scaled value in Pixel Space

  const lineGenerator = d3
    .line()
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)));

  //7. Convert X and Y into Path

  const line = bounds
    .append("path")
    .attr("d", lineGenerator(dataset))
    .attr("fill", "none")
    .attr("stroke", "Red")
    .attr("stroke-width", 2);

  //8. Create X axis and Y axis
  // Generate Y Axis

  const yAxisGenerator = d3.axisLeft().scale(yScale);
  const yAxis = bounds.append("g").call(yAxisGenerator);

  // Generate X Axis
  const xAxisGenerator = d3.axisBottom().scale(xScale);
  const xAxis = bounds
    .append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dimensions.boundedHeight}px)`);

  // d3 axis generator function has no idea where to place the Axis itself
  // We can shift the X axis group to the bottom with the help of CSS Transform
}

drawLineChart();
