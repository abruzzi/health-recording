var margin = {top: 20, right: 20, bottom: 60, left: 40};

var width = 600 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;


var parseDate = d3.time.format("%Y-%m-%d").parse;

var xScale = d3.scale.ordinal().rangeRoundBands([0, width], .05);
var yScale = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(d3.time.format("%Y-%m-%d"));
var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(10);

var svg = d3.select('.container').append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)
	.append("g")
		.attr('transform', "translate("+margin.left + "," + margin.top +")");

d3.csv("data/sleeping_normolized.csv", function(e, data) {
	data.forEach(function(d) {
		d.date = parseDate(d.date);
		d.length = +d.length/60;
	});

	xScale.domain(data.map(function(d) {return d.date}));
	yScale.domain([0, d3.max(data, function(d) {return d.length})]);

	svg.append("g")
		.attr('class', 'x axis')
		.attr('transform', 'translate(0, ' + height +')')
		.call(xAxis)
		.selectAll('text')
			.style('text-anchor', 'end')
			.attr('dx', '-.8em')
			.attr('dy', '-.55em')
			.attr('transform', "rotate(-90)");


	svg.append("g")
		.attr('class', 'y axis')
		.call(yAxis)
		.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', 6)
			.attr('dy', '.70em')
			.style('text-anchor', 'end')
			.text('Sleeping Hours')

	svg.selectAll('bar')
		.data(data)
		.enter()
		.append('rect')
			.style('fill', 'orangered')
			.attr('x', function(d) {return xScale(d.date)})
			.attr('width', xScale.rangeBand())
			.attr('y', function(d) {return yScale(d.length)})
			.attr('height', function(d) {return height - yScale(d.length)});
});
