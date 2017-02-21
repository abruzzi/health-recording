var margin = {
	top: 30,
	right: 20,
	bottom: 30,
	left: 50
},

width = 800 - margin.left - margin.right,
height = 450 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y-%m-%d").parse;
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis().scale(x)
	.orient("bottom")
	.innerTickSize(-height)
    .outerTickSize(0)
    .tickPadding(10);

var yAxis = d3.svg.axis().scale(y)
	.orient("left")
	.innerTickSize(-width)
    .outerTickSize(0)
    .tickPadding(10);

var urinateline = d3.svg.line()
	.interpolate('basis')
	.x(function(d) {
		return x(d.date);
	})
	.y(function(d) {
		return y(d.urinate);
	});

var stoolline = d3.svg.line()
	.interpolate('basis')
	.x(function(d) {
		return x(d.date);
	})
	.y(function(d) {
		return y(d.stool);
	});

var areaUrinate = d3.svg.area()
	.interpolate('basis')
	.x(function(d) { return x(d.date); }) 
	.y0(height)
	.y1(function(d) { return y(d.urinate); });

var areaStool = d3.svg.area()
	.interpolate('basis')
	.x(function(d) { return x(d.date); }) 
	.y0(height)
	.y1(function(d) { return y(d.stool); });

var svg = d3.select(".container").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
		"translate(" + margin.left + "," + margin.top + ")");


var div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

// Get the data
d3.csv("/data/diaper_normolized.csv", function(error, data) {
	
	data.forEach(function(d) {
		d.date = parseDate(d.date);
		d.urinate = +d.urinate;
		d.stool = +d.stool;
	});
	
	// Scale the range of the data
	x.domain(d3.extent(data, function(d) {
		return d.date;
	}));

	y.domain([0, d3.max(data, function(d) {
		return d.urinate;
	})]);


	svg.append("g") // Add the X Axis 
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")").call(xAxis);

	svg.append("g") // Add the Y Axis 
		.attr("class", "y axis")
		.call(yAxis);

 	svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Times");

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("邱心月换尿布记录"); 

	svg.append("path")
        .datum(data)
        .attr("class", "areaUrinate")
        .attr("d", areaUrinate);

	svg.append("path")
		.attr("class", "urinate")
		.attr("d", urinateline(data));
	

	svg.append("path")
        .datum(data)
        .attr("class", "areaStool")
        .attr("d", areaStool);
	
	svg.append("path")
		.attr("class", "stool")
		.attr("d", stoolline(data));

});
