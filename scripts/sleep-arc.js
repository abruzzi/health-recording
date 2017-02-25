var parseDate = d3.time.format("%Y/%m/%d %H:%M").parse;

d3.csv('data/sleeping_data_refined.csv', function(err, sleep) {
  sleep.forEach(function(d) {
    d.date = parseDate(d.date);
    d.length = +d.length;
  });

  var perAngle = (360 / (24 * 60)) * (Math.PI/180);

  function startAngle(date) {
    var start = (date.getHours() * 60 + date.getMinutes()) * perAngle
    return Math.floor(start*1000)/1000;
  }

  function endAngle(date, length) {
    var end = (date.getHours() * 60 + date.getMinutes() + length) * perAngle;
    return Math.floor(end*1000)/1000;
  }

  var width = 1200,
    height = 800;

  var redTranslate = "translate(" + width/2 +"," + height/2 + ")";

  d3.select(".chart").append("svg:svg")
    .attr("width", width)
    .attr("height", height);

  var render = function(dataset) {
    vis = d3.select("svg");

    var arcMin = 50;
    var arcWidth = 5;
    var arcPad = 1;

    var drawArc = d3.svg.arc()
      .innerRadius(function(d, i) {
        var index = getIndexByDate(d);
        return arcMin + index * (arcWidth) + arcPad;
      })
      .outerRadius(function(d, i) {
        var index = getIndexByDate(d);
        return arcMin + (index + 1) * (arcWidth);
      })
      .startAngle(function(d, i) {
        return startAngle(d.date);
      })
      .endAngle(function(d, i) {
        return endAngle(d.date, d.length);
      });

    var redArcs = vis.selectAll("path.red-path").data(dataset);

    function arc2Tween(d, indx) {
      var interp = d3.interpolate(this._current, d);
      this._current = d;

      return function(t) {
        var tmp = interp(t);
        return drawArc(tmp, indx);
      }
    };

    redArcs.transition()
      .duration(300)
      .attrTween("d", arc2Tween);

  var tooltip = d3.select("body")
      .append("div")
      .attr("class", "sleep-tooltip")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .text("");

  var level = d3.scale.threshold()
    .domain([60, 120, 180, 240, 300])
    .range(["low", "fine", "medium", "good", "great", "prefect"]);

    redArcs.enter().append("svg:path")
      .attr("class", function(d) {
        return level(d.length)+" bar";
      })
      .attr("transform", redTranslate)
      .attr("d", drawArc)
      .each(function(d) {
        this._current = d;
      })
      .on("mouseover", function(d) {
        tooltip.style("visibility", "visible")
        d3.select(this).style("opacity", "1");
      })
      .on("mousemove", function(d){
        tooltip.html(moment(d.date).format("YYYY-MM-DD HH:MM") + ", 睡了" + d.length + "分钟");
        return tooltip
          .style("top", (d3.event.pageY-10)+"px")
          .style("left",(d3.event.pageX+10)+"px");
      })
      .on("mouseout", function(d) {
        tooltip.style("visibility", "hidden")
        d3.select(this).style("opacity", ".7");
      });

      d3.select("svg").append("circle")
        .attr("class", 'click-circle')
        .attr("transform", redTranslate)
        .attr("r", 50 * 0.85)
        .attr("fill", "#FEFE8B");

  };


  var facts = crossfilter(sleep);

  var dateDim = facts.dimension(function(d) {
    return d3.time.day(d.date);
  });

  var reduced = dateDim.group().all();

  var keys = _.map(dateDim.group().all(), 'key');

  function getIndexByDate(d) {
    for (var i = 0; i < keys.length; i++) {
      if (moment(d.date).isSame(keys[i], 'day')) {
        return i;
      }
    }
  }
  
  render(sleep);
});