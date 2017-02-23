var parseDate = d3.time.format("%Y/%m/%d %H:%M").parse;

d3.csv('data/sleeping_data.csv', function(err, sleep) {
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

    redArcs.enter().append("svg:path")
      // .attr("class", "red-path")
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
      .attr("transform", redTranslate)
      .attr("d", drawArc)
      .each(function(d) {
        this._current = d;
      });

      d3.select("svg").append("circle")
        .attr("class", 'click-circle')
        .attr("transform", redTranslate)
        .attr("r", 50 * 0.85)
        .attr("fill", "#05C3DE");

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