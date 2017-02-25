var margin = {
	top: 30,
	right: 20,
	bottom: 30,
	left: 50
};

var width = 800 - margin.left - margin.right;
var height = 450 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y-%m-%d").parse;
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis().scale(x)
	.orient("bottom");
	// .innerTickSize(-height)
 //    .outerTickSize(0)
 //    .tickPadding(10);

var yAxis = d3.svg.axis().scale(y)
	.orient("left")
	.innerTickSize(-width)
    .outerTickSize(0)
    .tickPadding(10);

var valueline = d3.svg.line()
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
        .text("心心尿布更换记录"); 

    function formatTime(date) {
    	var format = d3.time.format("%Y-%m-%d");
    	return format(date);
    }

	svg.selectAll("dot")
	    .data(data)
	  .enter().append("circle")
	  	.attr('stroke', '#FD8D3C')
	  	.attr('fill', '#FD8D3C')
	  	.attr('opacity', function(d) {return d.urinate * 0.099})
	    .attr("r", function(d) {return d.urinate;})
	    .attr("cx", function(d) { return x(d.date); })
	    .attr("cy", function(d) { return y(d.urinate); })
	    .on("mouseover", function(d) {
			div.html(formatTime(d.date) + ", 嘘嘘: "  + d.urinate + "次")
			.style("left", (d3.event.pageX) + "px")
			.style("top", (d3.event.pageY - 28) + "px")
			.style("opacity", .9)
			.style("background", "#FD8D3C");
		})
		.on("mouseout", function(d) { 
			div.style("opacity", 0);
		});

	svg.selectAll("dot")
	    .data(data)
	  .enter().append("rect")
	  	.attr('stroke', '#636363')
	  	.attr('fill', '#636363')
	  	.attr('opacity', function(d) {return d.stool * 0.099})
	  	.attr('width', function(d) {return 1.5 * d.stool;})
	  	.attr('height', function(d) {return 1.5 * d.stool;})
	    .attr("x", function(d) { return x(d.date); })
	    .attr("y", function(d) { return y(d.stool); })
	    .on("mouseover", function(d) {
			div.html(formatTime(d.date) + ", 便便: "  + d.stool + "次")
			.style("left", (d3.event.pageX) + "px")
			.style("top", (d3.event.pageY - 28) + "px")
			.style("opacity", .9)
			.style("background", "#636363");
		})
		.on("mouseout", function(d) { 
			div.style("opacity", 0);
		});

	// svg.append("path")
	// 	.attr("class", "urinate")
	// 	.attr("d", valueline(data));
	
	// svg.append("path")
	// 	.attr("class", "stool")
	// 	.attr("d", stoolline(data));

});
