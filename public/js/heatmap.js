var margin = { top: 50, right: 0, bottom: 100, left: 30 },
  width = $('#heatmap').width() - margin.left - margin.right,
  height = 430 - margin.top - margin.bottom,
  gridSize = Math.floor(width / 24),
  legendElementWidth = gridSize*2,
  buckets = 9,
  days = ['一', '二', '三', '四', '五', '六', '日'],
  times = ['1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a',
           '9a', '10a', '11a', '12a', '1p', '2p', '3p', '4p',
           '5p', '6p', '7p', '8p', '9p', '10p', '11p', '12p'],
  datasets = ['/week_data.tsv'],
  opacityRange = [0.10, 1],
  colorInterpolate = d3.interpolateRgb;


var color = d3.scale.linear()
  .range(['rgb(16, 162, 224)', 'rgb(0, 216, 189)'])
  .interpolate(colorInterpolate)

var opacity = d3.scale.linear()
    .range(opacityRange);

var svg = d3.select('#heatmap').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var dayLabels = svg.selectAll('.dayLabel')
    .data(days)
    .enter().append('text')
      .text(function (d) { return d; })
      .attr('x', 0)
      .attr('y', function (d, i) { return i * gridSize; })
      .style('text-anchor', 'end')
      .attr('transform', 'translate(-6,' + gridSize / 1.5 + ')')
      .attr('class', function (d, i) { return ((i >= 0 && i <= 4) ? 'dayLabel mono axis axis-workweek' : 'dayLabel mono axis'); });

var timeLabels = svg.selectAll('.timeLabel')
    .data(times)
    .enter().append('text')
      .text(function(d) { return d; })
      .attr('x', function(d, i) { return i * gridSize; })
      .attr('y', 0)
      .style('text-anchor', 'middle')
      .attr('transform', 'translate(' + gridSize / 2 + ', -6)')
      .attr('class', function(d, i) { return ((i >= 7 && i <= 16) ? 'timeLabel mono axis axis-worktime' : 'timeLabel mono axis'); });

var heatmapChart = function(tsvFile) {
  
  d3.tsv(tsvFile, function(d) {
    return {
      day: +d.day,
      hour: +d.hour,
      value: +d.value
    };
  },
  function(error, data) {
    var colorScale = color
        .domain([0, d3.max(data, function (d) { return d.value; })])

    var opacityScale = opacity
        .domain([0, d3.max(data, function (d) { return d.value; })])

    var cards = svg.selectAll('.hour')
        .data(data, function(d) {return d.day+':'+d.hour;});

    cards.append('title');

    cards.enter().append('rect')
        .attr('x', function(d) { return (d.hour - 1) * gridSize + 0.1; })
        .attr('y', function(d) { return (d.day - 1) * gridSize + 0.1; })
        .attr('class', 'hour bordered')
        .attr('width', gridSize)
        .attr('height', gridSize)
        .style('fill', color[0]);

    cards.transition().duration(1000)
        .style('fill', function(d) { return colorScale(d.value); })
        .style('fill-opacity', function (d) { return opacityScale(d.value)});

    cards.select('title').text(function(d) { return d.value; });
    cards.exit().remove();
  });
};

heatmapChart(datasets[0]);
