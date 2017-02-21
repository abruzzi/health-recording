// var parseDate = d3.time.format("%Y-%m-%d").parse;

// d3.csv("data/sleeping_normolized.csv", function(e, data) {
// 	data.forEach(function(d) {
// 		d.date = parseDate(d.date);
// 		d.count = +(+d.length/60).toFixed(2);
// 	});

// 	var chart = calendarHeatmap()
//       .data(data)
//       .selector('.container')
//       .colorRange(['#D8E6E7', "#e76818"])
//       .tooltipEnabled(true)
//       .tooltipUnit('Sleeping hours')
//       .startDate(new Date('2016-11-09'))
//       .onClick(function (data) {
//         console.log('onClick callback. Data:', data);
//       });

// 	chart();
// });

var margin = {
	top: 20, left: 50, right: 20, bottom: 20
};

var width = 800 - margin.left - margin.right;
var height = 450 - margin.top - margin.bottom;

// var xScale = d3.time.scale().range([0, width]);
var xScale = d3.scale.ordinal().rangeRoundBands([0, width], .05)

//linear 24 hour scale
var yScale = d3.scale.linear()
  .domain([24,0])
  .range([height,0]);

//vertical axis
var yAxis = d3.svg.axis()
  .orient("right")
  .ticks(24)
  .scale(yScale)

// var xAxis = d3.svg.axis().scale(xScale)
// 	.orient("bottom")
// 	.ticks(10);

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");
    // .tickFormat(d3.time.format("%Y/%m/%d %H:%M"));

var tickArray = yScale.ticks(24),
  tickDistance = yScale(tickArray[tickArray.length - 1]) - yScale(tickArray[tickArray.length - 2]);

var parseDate = d3.time.format("%Y/%m/%d %H:%M").parse;

var svg = d3.select(".container").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
		"translate(" + margin.left + "," + margin.top + ")");

d3.csv('data/sleeping_data.csv', function(e, data) {
	data.forEach(function(d) {
		d.date = parseDate(d.date);
		d.length = d.length;
	});

	// Scale the range of the data
	xScale.domain(d3.extent(data, function(d) {
		return d.date;
	}));

	xScale.domain(data.map(function(d) { return d.date; }));

	svg.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + height + ")")
	  .call(xAxis)
	.selectAll("text")
	  .style("text-anchor", "end")
	  .attr("dx", "-.8em")
	  .attr("dy", "-.55em")
	  .attr("transform", "rotate(-45)");

	//draw the axis
	svg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.call(yAxis)
		.selectAll("text")
		.attr("transform", "translate(-25,0)")

	svg.selectAll(".bar")
	.data(data)  
	.enter()
	.append("rect")
	.attr("class", "bar")
	.attr("x", function(d) {
		return xScale(d.date)+margin.left;
	})
	.attr("width", xScale.rangeBand())
	.attr("y", function(d) { 
	  var start = d.date.getHours();
	  return yScale(start) + margin.top; 
	})
	.attr("height", function(d) {
	  var offset = (d.length / 60).toFixed(2);
	  return offset * tickDistance;
	});	  		
});