(function () {
  var D = window.SSQ_DATA;
  var cs = getComputedStyle(document.documentElement);
  function v(name) { return cs.getPropertyValue(name).trim(); }
  var accent = v('--accent');
  var accent2 = v('--accent2');
  var ink = v('--ink');
  var muted = v('--muted');
  var rule = v('--rule');
  var bg2 = v('--bg2');
  var FONT = "'Bricolage','PingFang SC','Hiragino Sans GB','Microsoft YaHei','Noto Sans SC',sans-serif";

  var tip = {
    appendToBody: true,
    backgroundColor: bg2,
    borderColor: rule,
    borderWidth: 1,
    padding: [9, 12],
    textStyle: { color: ink, fontFamily: FONT, fontSize: 12 },
    extraCssText: 'box-shadow:0 8px 28px rgba(28,25,23,.14);border-radius:9px;'
  };

  function axisCommon() {
    return {
      axisLine: { lineStyle: { color: rule } },
      axisTick: { show: false },
      axisLabel: { color: muted, fontFamily: FONT, fontSize: 11 },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } }
    };
  }

  function init(id) {
    return echarts.init(document.getElementById(id), null, { renderer: 'svg' });
  }
  var charts = [];

  // ---------- 年度开奖期数 ----------
  var c1 = init('chart-year-draws');
  c1.setOption({
    animation: false,
    textStyle: { fontFamily: FONT },
    tooltip: Object.assign({ trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: function (p) { return p[0].name + ' 年<br/>开奖 <b>' + p[0].value + '</b> 期'; } }, tip),
    grid: { left: 44, right: 16, top: 18, bottom: 30 },
    xAxis: Object.assign({ type: 'category', data: D.years, boundaryGap: true, axisLabel: { color: muted, fontFamily: FONT, fontSize: 10.5, interval: 0 } }, axisCommon()),
    yAxis: Object.assign({ type: 'value', max: 180, axisLabel: { color: muted, fontFamily: FONT, fontSize: 11 } }, axisCommon()),
    series: [{
      type: 'bar',
      data: D.draws.map(function (d, i) {
        var y = D.years[i];
        var partial = y === '2003' || y === '2026';
        return { value: d, itemStyle: { color: partial ? accent + '55' : accent, borderRadius: [3, 3, 0, 0] } };
      }),
      barWidth: '52%'
    }]
  });
  charts.push(c1);

  // ---------- 红球频次 ----------
  var redMeta = {};
  D.red.forEach(function (x) { redMeta[x[0]] = { count: x[1], omission: x[2] }; });
  var c2 = init('chart-red-freq');
  c2.setOption({
    animation: false,
    textStyle: { fontFamily: FONT },
    tooltip: Object.assign({
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function (p) {
        var num = p[0].name;
        var m = redMeta[parseInt(num, 10)] || {};
        var diff = m.count - D.redExpected;
        return '红球 <b>' + num + '</b><br/>出现 <b>' + m.count + '</b> 次（' + (diff >= 0 ? '+' : '') + diff.toFixed(0) + '）<br/>当前遗漏 ' + m.omission + ' 期';
      }
    }, tip),
    grid: { left: 48, right: 18, top: 32, bottom: 28 },
    xAxis: Object.assign({ type: 'category', data: D.red.map(function (x) { return ('0' + x[0]).slice(-2); }), axisLabel: { color: muted, fontFamily: FONT, fontSize: 10, interval: 0 } }, axisCommon()),
    yAxis: Object.assign({ type: 'value', min: 520, max: 730, name: '出现次数', nameTextStyle: { color: muted, fontFamily: FONT, fontSize: 10 }, axisLabel: { color: muted, fontFamily: FONT, fontSize: 11 } }, axisCommon()),
    series: [{
      type: 'bar',
      data: D.red.map(function (x) {
        return { value: x[1], itemStyle: { color: x[1] >= D.redExpected ? accent : accent + '70', borderRadius: [3, 3, 0, 0] } };
      }),
      barWidth: '62%',
      markLine: {
        silent: true,
        symbol: 'none',
        lineStyle: { color: ink, type: 'dashed', width: 1, opacity: 0.55 },
        label: { show: false },
        data: [{ yAxis: D.redExpected }]
      }
    }]
  });
  charts.push(c2);

  // ---------- 蓝球频次 ----------
  var blueMeta = {};
  D.blue.forEach(function (x) { blueMeta[x[0]] = { count: x[1], omission: x[2] }; });
  var c3 = init('chart-blue-freq');
  c3.setOption({
    animation: false,
    textStyle: { fontFamily: FONT },
    tooltip: Object.assign({
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function (p) {
        var num = p[0].name;
        var m = blueMeta[parseInt(num, 10)] || {};
        var diff = m.count - D.blueExpected;
        return '蓝球 <b>' + num + '</b><br/>出现 <b>' + m.count + '</b> 次（' + (diff >= 0 ? '+' : '') + diff.toFixed(0) + '）<br/>当前遗漏 ' + m.omission + ' 期';
      }
    }, tip),
    grid: { left: 48, right: 18, top: 32, bottom: 28 },
    xAxis: Object.assign({ type: 'category', data: D.blue.map(function (x) { return ('0' + x[0]).slice(-2); }), axisLabel: { color: muted, fontFamily: FONT, fontSize: 11, interval: 0 } }, axisCommon()),
    yAxis: Object.assign({ type: 'value', min: 190, max: 250, axisLabel: { color: muted, fontFamily: FONT, fontSize: 11 } }, axisCommon()),
    series: [{
      type: 'bar',
      data: D.blue.map(function (x) {
        return { value: x[1], itemStyle: { color: x[1] >= D.blueExpected ? accent2 : accent2 + '70', borderRadius: [3, 3, 0, 0] } };
      }),
      barWidth: '54%',
      markLine: {
        silent: true,
        symbol: 'none',
        lineStyle: { color: ink, type: 'dashed', width: 1, opacity: 0.55 },
        label: { show: false },
        data: [{ yAxis: D.blueExpected }]
      }
    }]
  });
  charts.push(c3);

  // ---------- 和值分布 ----------
  var c4 = init('chart-sum');
  c4.setOption({
    animation: false,
    textStyle: { fontFamily: FONT },
    tooltip: Object.assign({
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function (p) {
        var i = p[0].dataIndex;
        return '和值 ' + D.sumLabels[i] + '<br/>开奖 <b>' + D.sumCounts[i] + '</b> 期（' + D.sumPct[i] + '%）';
      }
    }, tip),
    grid: { left: 48, right: 18, top: 28, bottom: 30 },
    xAxis: Object.assign({ type: 'category', data: D.sumLabels, axisLabel: { color: muted, fontFamily: FONT, fontSize: 11, interval: 0 } }, axisCommon()),
    yAxis: Object.assign({ type: 'value', axisLabel: { color: muted, fontFamily: FONT, fontSize: 11 } }, axisCommon()),
    series: [{
      type: 'bar',
      data: D.sumCounts.map(function (d, i) {
        var hot = i === 2 || i === 3;
        return { value: d, itemStyle: { color: hot ? accent : accent + '65', borderRadius: [4, 4, 0, 0] } };
      }),
      barWidth: '52%',
      label: { show: true, position: 'top', color: muted, fontFamily: FONT, fontSize: 10.5, formatter: '{c}' }
    }]
  });
  charts.push(c4);

  // ---------- 奇偶比 ----------
  var c5 = init('chart-odd-even');
  c5.setOption({
    animation: false,
    textStyle: { fontFamily: FONT },
    tooltip: Object.assign({
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function (p) {
        var i = p[0].dataIndex;
        return '奇:偶 = ' + D.oddLabels[i] + '<br/><b>' + D.oddCounts[i] + '</b> 期（' + D.oddPct[i] + '%）';
      }
    }, tip),
    grid: { left: 52, right: 48, top: 12, bottom: 24 },
    xAxis: Object.assign({ type: 'value', axisLabel: { color: muted, fontFamily: FONT, fontSize: 10.5 } }, axisCommon()),
    yAxis: Object.assign({ type: 'category', data: D.oddLabels, inverse: true, axisLabel: { color: muted, fontFamily: FONT, fontSize: 11 } }, axisCommon()),
    series: [{
      type: 'bar',
      data: D.oddCounts.map(function (d, i) {
        return { value: d, itemStyle: { color: D.oddLabels[i] === '3:3' ? accent : accent + '55', borderRadius: [0, 4, 4, 0] } };
      }),
      barWidth: '52%',
      label: { show: true, position: 'right', color: muted, fontFamily: FONT, fontSize: 10, formatter: function (p) { return D.oddPct[p.dataIndex] + '%'; } }
    }]
  });
  charts.push(c5);

  // ---------- 大小比 ----------
  var c6 = init('chart-big-small');
  c6.setOption({
    animation: false,
    textStyle: { fontFamily: FONT },
    tooltip: Object.assign({
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function (p) {
        var i = p[0].dataIndex;
        return '大:小 = ' + D.bsLabels[i] + '<br/><b>' + D.bsCounts[i] + '</b> 期（' + D.bsPct[i] + '%）';
      }
    }, tip),
    grid: { left: 52, right: 48, top: 12, bottom: 24 },
    xAxis: Object.assign({ type: 'value', axisLabel: { color: muted, fontFamily: FONT, fontSize: 10.5 } }, axisCommon()),
    yAxis: Object.assign({ type: 'category', data: D.bsLabels, inverse: true, axisLabel: { color: muted, fontFamily: FONT, fontSize: 11 } }, axisCommon()),
    series: [{
      type: 'bar',
      data: D.bsCounts.map(function (d, i) {
        return { value: d, itemStyle: { color: D.bsLabels[i] === '3:3' ? accent2 : accent2 + '55', borderRadius: [0, 4, 4, 0] } };
      }),
      barWidth: '52%',
      label: { show: true, position: 'right', color: muted, fontFamily: FONT, fontSize: 10, formatter: function (p) { return D.bsPct[p.dataIndex] + '%'; } }
    }]
  });
  charts.push(c6);

  // ---------- 重号 ----------
  var c7 = init('chart-repeat');
  c7.setOption({
    animation: false,
    textStyle: { fontFamily: FONT },
    tooltip: Object.assign({
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function (p) {
        var i = p[0].dataIndex;
        return '与上期重复 ' + D.repeatLabels[i] + '红球<br/><b>' + D.repeatCounts[i] + '</b> 期（' + D.repeatPct[i] + '%）';
      }
    }, tip),
    grid: { left: 48, right: 18, top: 28, bottom: 30 },
    xAxis: Object.assign({ type: 'category', data: D.repeatLabels, axisLabel: { color: muted, fontFamily: FONT, fontSize: 11 } }, axisCommon()),
    yAxis: Object.assign({ type: 'value', axisLabel: { color: muted, fontFamily: FONT, fontSize: 11 } }, axisCommon()),
    series: [{
      type: 'bar',
      data: D.repeatCounts.map(function (d, i) {
        return { value: d, itemStyle: { color: i === 1 ? accent : accent + '55', borderRadius: [4, 4, 0, 0] } };
      }),
      barWidth: '46%',
      label: { show: true, position: 'top', color: muted, fontFamily: FONT, fontSize: 10.5, formatter: '{c}' }
    }]
  });
  charts.push(c7);

  // ---------- 销售额与头奖 ----------
  var c8 = init('chart-sales-prize');
  c8.setOption({
    animation: false,
    textStyle: { fontFamily: FONT },
    tooltip: Object.assign({
      trigger: 'axis',
      axisPointer: { type: 'shadow', lineStyle: { color: rule } },
      formatter: function (ps) {
        var y = ps[0].name;
        var out = y + ' 年';
        ps.forEach(function (p) {
          var unit = p.seriesName === '销售额' ? ' 亿元' : ' 注';
          out += '<br/>' + p.marker + p.seriesName + '：<b>' + p.value + '</b>' + unit;
        });
        return out;
      }
    }, tip),
    legend: { top: 4, right: 4, itemWidth: 12, itemHeight: 8, textStyle: { color: muted, fontFamily: FONT, fontSize: 11 } },
    grid: { left: 50, right: 56, top: 44, bottom: 30 },
    xAxis: Object.assign({ type: 'category', data: D.years, axisLabel: { color: muted, fontFamily: FONT, fontSize: 10, interval: 0 } }, axisCommon()),
    yAxis: [
      Object.assign({ type: 'value', axisLabel: { color: muted, fontFamily: FONT, fontSize: 10.5 } }, axisCommon()),
      Object.assign({ type: 'value', axisLabel: { color: muted, fontFamily: FONT, fontSize: 10.5 }, splitLine: { show: false } }, axisCommon())
    ],
    series: [
      {
        name: '一等奖注数', type: 'bar', yAxisIndex: 0, data: D.p1,
        barWidth: '48%',
        itemStyle: { color: accent2 + 'cc', borderRadius: [3, 3, 0, 0] }
      },
      {
        name: '销售额', type: 'line', yAxisIndex: 1, data: D.sales,
        smooth: false, symbol: 'circle', symbolSize: 5,
        lineStyle: { color: accent, width: 2.4 },
        itemStyle: { color: accent },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: accent + '2e' },
            { offset: 1, color: accent + '00' }
          ])
        }
      }
    ]
  });
  charts.push(c8);

  window.addEventListener('resize', function () {
    charts.forEach(function (c) { c.resize(); });
  });
})();
