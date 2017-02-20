var parseDate = d3.time.format("%Y-%m-%d").parse;

d3.csv("data/sleeping_normolized.csv", function(e, data) {
	data.forEach(function(d) {
		d.date = parseDate(d.date);
		d.count = +(+d.length/60).toFixed(2);
	});

	var chart = calendarHeatmap()
      .data(data)
      .selector('.container')
      .colorRange(['#D8E6E7', "#e76818"])
      .tooltipEnabled(true)
      .tooltipUnit('Sleeping hours')
      .startDate(new Date('2016-11-09'))
      .onClick(function (data) {
        console.log('onClick callback. Data:', data);
      });

	chart();
});
