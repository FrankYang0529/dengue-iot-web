(function() {

  var GET_API = '/bugZapper?bugZapperId=123';
  var now = (new Date()).getTime() / 1000;
  var gaugeChart,
      barChart,
      bug24hrSum;

  initBarChart('#barChart');
  setInterval(updateChart, 1000);

  $.get(GET_API, function(historyData) {
    initGaugeChart(historyData);

    io('http://localhost:3000/iot')
      .on('data', updateChart);
  });

  function initBarChart(id) {
    var barChartData = [
      {
        values: [{
          time: now,
          y: 0
        }]
      }
    ];

    barChart = $(id).epoch({
      type: 'time.bar',
      data: barChartData,
      range: [0, 5],
      axes: ['bottom', 'left'],
      margins: { top: 50, right: 40, bottom: 60, left: 50 }
    });
  }

  function initGaugeChart(data) {
    bug24hrSum = data.captures.length;

    gaugeChart = $('#gaugeChart').epoch({
      type: 'time.gauge',
      value: bug24hrSum,
      domain: [0, 100],
      format: function(v) { return (v).toFixed(0); }
    });

    addTexts();
    addTitle(d3.select('#barChart svg'),
           '即時次數', $('#barChart').width());

    setTimeout(updateGauegeText, 0);
  }

  function updateGauegeText() {
    var g = d3.select('#gaugeChart g');
    var transX = g.attr('transform')
                  .replace('translate(', '')
                  .split(',')[0];
    g.attr('transform', 'translate('+transX+',180)');
  }

  function updateChart(event) {
    var timestamp = (new Date()).getTime() / 1000;
    if (event) {
      barChart.push([{ time: timestamp, y: 1 }]);
      bug24hrSum++;
      gaugeChart.push(bug24hrSum);
    }
    else {
      barChart.push([{ time: timestamp, y: 0 }]);
    }
  }

  function addTexts() {
    d3.select('.y.axis')
      .append('text')
      .attr('fill', '#d0d0d0')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .style('text-anchor', 'end')
      .text('');

    d3.select('#gaugeChart')
      .append('h4')
      .text('24小時內總數');
  }

  function addTitle(svg, title, width) {
    svg.append('text')
      .attr('x', (width / 2))
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('fill', '#eee')
      .text(title);
  }
})();
