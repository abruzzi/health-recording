// var margin = {top: 20, right: 20, bottom: 60, left: 40};

// var width = 800 - margin.left - margin.right,
// 	height = 400 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y-%m-%d").parse;

// var xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);
// var yScale = d3.scale.linear().range([height, 0]);

// var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(d3.time.format("%Y-%m-%d"));
// var yAxis = d3.svg.axis().scale(yScale).tickSize(-width).tickPadding(8).orient("left");

// var svg = d3.select('.container').append('svg')
// 	.attr('width', width + margin.left + margin.right)
// 	.attr('height', height + margin.top + margin.bottom)
// 	.append("g")
// 		.attr('transform', "translate(" + margin.left + "," + margin.top +")");


// //Append a defs (for definition) element to your SVG
// var defs = svg.append("defs");

// //Append a linearGradient element to the defs and give it a unique id
// var linearGradient = defs.append("linearGradient")
//     .attr("id", "linear-gradient");


// //A color scale
// var colorScale = d3.scale.linear()
//     .range(["#2c7bb6", "#00a6ca","#00ccbc","#90eb9d","#ffff8c","#f9d057","#f29e2e","#e76818","#d7191c"]);

// //Append multiple color stops by using D3's data/enter step

// linearGradient
//     .attr("x1", "0%")
//     .attr("y1", "0%")
//     .attr("x2", "0%")
//     .attr("y2", "100%");

// linearGradient.selectAll("stop") 
//     .data(colorScale.range())
//     .enter().append("stop")
//     .attr("offset", function(d,i) { return i/(colorScale.range().length-1); })
//     .attr("stop-color", function(d) { return d; });

d3.csv("data/sleeping_normolized.csv", function(e, data) {
	data.forEach(function(d) {
		d.date = parseDate(d.date);
		d.count = +d.length/60;
	});

	var chart = calendarHeatmap()
      .data(data)
      .selector('.container')
      .colorRange(['#D8E6E7', "#00a6ca"])
      .tooltipEnabled(true)
      .tooltipUnit(
                [
                  {min: 0, unit: 'hour'},
                  {min: 1, max: 1, unit: 'hour'},
                  {min: 2, max: 'Infinity', unit: 'hours'}
                ]
              )
      .onClick(function (data) {
        console.log('onClick callback. Data:', data);
      });

	chart();

	// var xMin = d3.min(data, function(d) {return d.date;})
	// var xMax = d3.max(data, function(d) {return d.date;})

	// xAxis = d3.svg.axis().scale(xScale)
	// 	.tickSize(height)
	// 	.tickPadding(15)
	// 	.orient("bottom")
	// 	.tickValues([xMin, xMax])
	// 	.tickFormat(d3.time.format("%Y-%m-%d"));

	// xScale.domain(data.map(function(d) {return d.date}));
	// yScale.domain([0, d3.max(data, function(d) {return d.length})]);

	// svg.append("g")
	// 	.attr('class', 'x axis')
	// 	.attr('transform', 'translate(0, ' + height +')')
	// 	.call(xAxis)
	// 	.selectAll('text')
	// 		.style('text-anchor', 'end')
	// 		.attr('dx', '-.8em')
	// 		.attr('dy', '-.55em')
	// 		.attr('transform', "rotate(-45)");


	// svg.append("g")
	// 	.attr('class', 'y axis')
	// 	.call(yAxis)
	// 	.append('text')
	// 		.attr('transform', 'rotate(-90)')
	// 		.attr('y', 6)
	// 		.attr('dy', '.70em')
	// 		.style('text-anchor', 'end')
	// 		.text('Sleeping Hours')

	// svg.selectAll('bar')
	// 	.data(data)
	// 	.enter()
	// 	.append('rect')
	// 		.style('fill', "url(#linear-gradient)")
	// 		.attr('x', function(d) {return xScale(d.date)})
	// 		.attr('width', xScale.rangeBand())
	// 		.attr('y', function(d) {return yScale(d.length)})
	// 		.attr('height', function(d) {return height - yScale(d.length)});
});
