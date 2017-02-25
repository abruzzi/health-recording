var margin = {
	top: 20, left: 50, right: 20, bottom: 60
};

var width = 1200 - margin.left - margin.right;
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

var tickArray = yScale.ticks(24),
  tickDistance = yScale(tickArray[tickArray.length - 1]) - yScale(tickArray[tickArray.length - 2]);

var parseDate = d3.time.format("%Y/%m/%d %H:%M").parse;

var svg = d3.select(".container").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
		"translate(" + margin.left + "," + margin.top + ")");

var div = d3.select("body").append("div").attr("class", "sleep-tooltip").style("opacity", 0);

d3.json('data/sleeping_data_refined.json', function(e, data) {
	// data = _.take(data, 20);
	data.forEach(function(d) {
		d.date = parseDate(d.date);
		d.length = d.length;
	});

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

    function formatTime(date) {
    	var format = d3.time.format("%Y/%m/%d %H:%M");
    	return format(date);
    }

	//draw the axis
	svg.append("g")
		.attr("class", "y axis")
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
			return xScale(m);
		})
		.attr("width", xScale.rangeBand())
		.attr("y", function(d) { 
		  return 0; 
		})
		.attr("height", function(d) {
		  return height;
		});

  var level = d3.scale.threshold()
    .domain([60, 120, 180, 240, 300])
    .range(["low", "fine", "medium", "good", "great", "prefect"]);

	svg.selectAll(".bar")
		.data(data)
		.enter()
		.append("rect")
		.attr("class", function(d) {
			return level(d.length)+" bar";
		})
		.attr("x", function(d) {
			var m = getFirstInDomain(d.date);
			return xScale(m);
		})
		.attr("width", xScale.rangeBand())
		.attr("y", function(d) { 
		  var start = d.date.getHours() + (+(d.date.getMinutes()/60).toFixed(4));
		  return yScale(start); 
		})
		.attr("height", function(d) {
		  var offset = (d.length / 60).toFixed(2);
		  return offset * tickDistance;
		})
		.on("mouseover", function(d) {
			div.html(formatTime(d.date) + "开始睡觉, 睡了"  + d.length + "分钟")
			.style("left", (d3.event.pageX) + "px")
			.style("top", (d3.event.pageY - 28) + "px")
			.style("opacity", .9)
			.style("background", "#FD8D3C");
		})
		.on("mouseout", function(d) { 
			div.style("opacity", 0);
		});

	svg.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + height + ")")
	  .call(xAxis)
	.selectAll("text")
	  .style("text-anchor", "end")
	  .style("font-size", "8px")
	  .attr("dx", "-.8em")
	  .attr("dy", "-.55em")
	  .attr("transform", "rotate(-45)");

});