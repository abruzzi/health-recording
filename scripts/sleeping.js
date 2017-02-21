var margin = {
	top: 20, left: 50, right: 20, bottom: 60
};

var width = 800 - margin.left - margin.right;
var height = 450 - margin.top - margin.bottom;

// var xScale = d3.time.scale().range([0, width]);
var xScale = d3.scale.ordinal().rangeRoundBands([0, width], .5)

//linear 24 hour scale
var yScale = d3.scale.linear()
  .domain([24, 0])
  .range([height, 0]);

//vertical axis
var yAxis = d3.svg.axis()
  .orient("right")
  .ticks(24)
  .scale(yScale)

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .tickFormat(d3.time.format("%Y/%m/%d"));

var yScaleRight = d3.scale.linear().range([height, 0]);
var yAxisRight = d3.svg.axis()
	.scale(yScaleRight)
	.orient("left")
	.ticks(5);

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
	// data = _.take(data, 20);
	data.forEach(function(d) {
		d.date = parseDate(d.date);
		d.length = d.length;
	});

	yScaleRight.domain([0, d3.max(data, function(d) {
		return Math.max(d.length);
	})]);

	// Scale the range of the data
	xScale.domain(d3.extent(data, function(d) {
		return d.date;
	}));

	var dateRange = _.uniq(data, function(d) {
		var date = d.date;
		return [date.getYear(), date.getMonth(), date.getDate()].join("/");
	});

	xScale.domain(dateRange.map(function(d) { return d.date; }));

	function getFirstInDomain(date) {
		var domain = xScale.domain();

		var index = _.findIndex(domain, function(d) {
			return date.getYear() === d.getYear() 
				&& date.getMonth() === d.getMonth() 
				&& date.getDate() === d.getDate();
		});

		return domain[index];
	}

	//draw the axis
	svg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.call(yAxis)
		.selectAll("text")
		.attr("transform", "translate(-25,0)")

	svg.selectAll(".barbg")
		.data(data)
		.enter()
		.append("rect")
		.attr("class", "barbg")
		.attr("x", function(d) {
			var m = getFirstInDomain(d.date);
			return xScale(m) + margin.left;
		})
		.attr("width", xScale.rangeBand())
		.attr("y", function(d) { 
		  return margin.top; 
		})
		.attr("height", function(d) {
		  return height;
		});

	svg.selectAll(".bar")
		.data(data)  
		.enter()
		.append("rect")
		.attr("class", function(d) {
			if(d.length < 60) {
				return "low bar";
			} else if(d.length >= 60 && d.length < 120) {
				return "fine bar";
			} else if(d.length >= 120 && d.length < 180) {
				return "medium bar";
			} else if(d.length >= 180 && d.length < 240) {
				return "good bar";
			} else if(d.length >= 240 && d.length < 300) {
				return "great bar";
			} else {
				return "prefect bar";
			}
		})
		.attr("x", function(d) {
			var m = getFirstInDomain(d.date);
			return xScale(m) + margin.left;
		})
		.attr("width", xScale.rangeBand())
		.attr("y", function(d) { 
		  var start = d.date.getHours() + (+(d.date.getMinutes()/60).toFixed(4));
		  return yScale(start) + margin.top; 
		})
		.attr("height", function(d) {
		  var offset = (d.length / 60).toFixed(2);
		  return offset * tickDistance;
		});

	var valueline = d3.svg.line()
		.x(function(d) { 
			var m = getFirstInDomain(d.date);
			return xScale(m) + margin.left; 
		})
		.y(function(d) { 
			return yScaleRight(d.length); 
		});

	svg.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + (height + margin.top) + ")")
	  .call(xAxis)
	.selectAll("text")
	  .style("text-anchor", "end")
	  .attr("dx", "-.8em")
	  .attr("dy", "-.55em")
	  .attr("transform", "rotate(-45)");

	 svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (width + margin.right) + ", " +margin.top +")")
        .style("fill", "red")
        .call(yAxisRight);


	svg.selectAll("dot")
	    .data(data)
	  .enter().append("rect")
	  	.attr('stroke', '#636363')
	  	.attr('fill', '#636363')
	  	.attr('opacity', .2)
	  	.attr('width', function(d) {return d.length;})
	  	.attr('height', function(d) {return d.length;})
	    .attr("x", function(d) { 
	    	var m = getFirstInDomain(d.date);
			return xScale(m) + margin.left;
	    })
	    .attr("y", function(d) { return yScaleRight(d.length); })

	// svg.append("path")
	// 	.attr("d", valueline(data));

});