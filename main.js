var parseData = function () {
  var file = document.getElementById('select_file').files[0];
  readFileContent(file);
}

var output_jobj, x, f, len_SampleId;
var readFileContent = function (file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    output_jobj = JSON.parse(e.target.result);
    x = output_jobj.ConversionResults.length;
    f = output_jobj.Flowcell;
    len_SampleId = output_jobj.ConversionResults[0].DemuxResults.length;
    sampleIdList(output_jobj, len_SampleId);
    NgsData(output_jobj, x);
  }
  reader.readAsText(file);
}

var sampleIdList = function (output_jobj, len_SampleId) {
  var ul = document.createElement('div');
  ul.setAttribute('class', 'unorderedList');
  // ul.setAttribute('id', "unordered ");
  var divSample = document.createElement('div');
  console.log(divSample)
  setAttributes(divSample, {
    'id': 'flowCells',
    'class': "list_data",
    'data-toggle': "tooltip",
    'data-placement': 'right',
    'title': "All Summary",
    'onclick': 'clickForFlowcell(); showDiv(); selectQuery();'
  });
  divSample.append(f);

  var undetermine = document.createElement('div');
  setAttributes(undetermine, {
    'class': 'list_data',
    'data-toggle': 'tooltip',
    'data-placement': 'right',
    'title': 'Undetermined Sample',
    'onclick': 'clickForUndetermine();hideDiv()'
  })
  var undetermineText = document.createTextNode('Undetermined');
  undetermine.append(undetermineText);
  ul.append(divSample);

  document.getElementById('sampleId').removeChild(document.getElementById('sampleId').childNodes[2]);
  for (var j = 0; j < len_SampleId; j++) {
    var sampleID = output_jobj.ConversionResults[0].DemuxResults[j].SampleId;
    var indexSequences = output_jobj.ConversionResults[0].DemuxResults[j].IndexMetrics[0].IndexSequence;
    var li1 = document.createElement('div');
    setAttributes(li1, {
      'class': 'list_data',
      'data-toggle': 'tooltip',
      'data-placement': 'right',
      'title': `${indexSequences}`,
      'id': `${j}`,
      'onclick': `clickOnList(${j}); hideDiv()`
    })
    li1.innerHTML = sampleID;
    ul.appendChild(li1);
  }
  ul.append(undetermine);
  document.getElementById('sampleId').appendChild(ul);
}

// to show and hide the flowCell data summary
var showDiv = function () {
  if (document.getElementById('select-list').style.display === 'none') {
    document.getElementById('select-list').style.display = 'block';
    document.getElementById('summary-table').style.display = 'none';
  } else {
    document.getElementById('select-list').style.display = 'block';
    document.getElementById('summary-table').style.display = 'none';
  }
}
var hideDiv = function () {
  if (document.getElementById('summary-table').style.display === 'block' || document.getElementById('select-list').style.display === 'block') {
    document.getElementById('summary-table').style.display = 'none';
    document.getElementById('select-list').style.display = 'none';
  } else {
    document.getElementById('summary-table').style.display = 'none';
    document.getElementById('summary-table').style.display = 'none';
  }
}

var clickForFlowcell = function () {
  var lane_data = [],
    sum_of_TotalClusterRaw = 0,
    sum_of_TotalClusterPF = 0,
    sum_of_Yield = 0;
  for (var i = 0; i < x; i++) {
    var sumOfPerfectBarcode = 0,
      sumOfMismatchBarcode = 0,
      sum_yield = 0,
      sum_yield_1 = 0,
      sum_yield_2 = 0,
      sumQualityScore_1 = 0,
      sumQualityScore_2 = 0;
    for (var j = 0; j < len_SampleId; j++) {
      var laneNumber = output_jobj.ConversionResults[i].LaneNumber;
      var PF_Barcode = output_jobj.ConversionResults[i].DemuxResults[j].IndexMetrics[0].MismatchCounts[0];
      var misMatch = output_jobj.ConversionResults[i].DemuxResults[j].IndexMetrics[0].MismatchCounts[1];
      var yield_1 = output_jobj.ConversionResults[i].DemuxResults[j].ReadMetrics[0].YieldQ30;
      var yield_2 = output_jobj.ConversionResults[i].DemuxResults[j].ReadMetrics[1].YieldQ30;
      var Yield = output_jobj.ConversionResults[i].DemuxResults[j].Yield;
      var quality_score_1 = output_jobj.ConversionResults[i].DemuxResults[j].ReadMetrics[0].QualityScoreSum;
      var quality_score_2 = output_jobj.ConversionResults[i].DemuxResults[j].ReadMetrics[1].QualityScoreSum;
      sumOfPerfectBarcode += PF_Barcode;
      sumOfMismatchBarcode += misMatch;
      sum_yield += Yield;
      sum_yield_1 += yield_1;
      sum_yield_2 += yield_2;
      sumQualityScore_1 += quality_score_1;
      sumQualityScore_2 += quality_score_2;
    }
    var UndeterminedNumberRead = output_jobj.ConversionResults[i].Undetermined.NumberReads;
    var UndetermineYield = output_jobj.ConversionResults[i].Undetermined.Yield;
    var Undetermine_Q30_1 = output_jobj.ConversionResults[i].Undetermined.ReadMetrics[0].YieldQ30;
    var Undetermine_Q30_2 = output_jobj.ConversionResults[i].Undetermined.ReadMetrics[1].YieldQ30;
    var Undetermine_Qscore_1 = output_jobj.ConversionResults[i].Undetermined.ReadMetrics[0].QualityScoreSum;
    var Undetermine_Qscore_2 = output_jobj.ConversionResults[i].Undetermined.ReadMetrics[1].QualityScoreSum;
    var Total_yield = sum_yield + UndetermineYield;
    var f_TotalClusterRaw = output_jobj.ConversionResults[i].TotalClustersRaw;
    var f_TotalClusterPF = output_jobj.ConversionResults[i].TotalClustersPF;
    var percLane = (100 * (f_TotalClusterPF / f_TotalClusterPF));
    var percPFCluster = (100 * f_TotalClusterPF / f_TotalClusterRaw).toFixed(2);
    var PerfectBarcode = (100 * (sumOfPerfectBarcode + UndeterminedNumberRead) / f_TotalClusterPF).toFixed(2);
    var MismatchBarcode = (100 * (sumOfMismatchBarcode) / f_TotalClusterPF).toFixed(2);
    var Q30_bases = (100 * ((sum_yield_1 + Undetermine_Q30_1) + (sum_yield_2 + Undetermine_Q30_2)) / Total_yield).toFixed(2);
    var meanScore = ((sumQualityScore_1 + Undetermine_Qscore_1 + sumQualityScore_2 + Undetermine_Qscore_2) / Total_yield).toFixed(2);

    var f_Yield = Math.round(0.000001 * (output_jobj.ConversionResults[i].Yield));
    sum_of_TotalClusterRaw += f_TotalClusterRaw;
    sum_of_TotalClusterPF += f_TotalClusterPF;
    sum_of_Yield += f_Yield;
    var d = {}
    d['Lane'] = laneNumber;
    d['PF Clusters'] = f_TotalClusterPF;
    d['% of the lane'] = percLane;
    d['% Perfect barcode'] = PerfectBarcode;
    d['% One mismatch barcode'] = MismatchBarcode;
    d['Yield (Mbases)'] = f_Yield;
    d['% PF Clusters'] = percPFCluster;
    d['% >= Q30 bases'] = Q30_bases;
    d['Mean Quality Score'] = parseFloat(meanScore);
    lane_data.push(d);
  }
  draw_table(lane_data, id = 'test_div');
  flowCell_Summary(sum_of_TotalClusterRaw, sum_of_TotalClusterPF, sum_of_Yield);
}

var selectQuery = function () {
  var headerList = ['Select to see the complete summary', 'PF Clusters', '% of the Lane', '% Perfect Barcode', '% One mismatch Barcode', 'Yield (Mbases)', '% PF Clusters', '% >= 30 bases', 'Mean Quality Score'];
  var selectTag = document.createElement('select');
  selectTag.setAttribute('id', 'optionList');
  selectTag.setAttribute('onchange', 'allSummary()');
  document.getElementById('select-list').removeChild(document.getElementById('select-list').childNodes[0]);
  for (var i in headerList) {
    var optionTag = document.createElement('option');
    optionTag.setAttribute('value', `${headerList[i]}`);
    var optionText = document.createTextNode(headerList[i]);
    optionTag.append(optionText);
    selectTag.append(optionTag);
  }
  document.getElementById('select-list').append(selectTag);
}

var allSummary = function () {
  var selectValue = document.getElementById('optionList').value;
  var displayDiv = document.getElementById('summary-table');
  displayDiv.style.display = 'block';
  var lane_data = [];
  for (var i = 0; i < len_SampleId; i++) {
    var totalPFclusters = 0;
    var totalPFbarcodes = 0;
    var totalPF = 0;
    var totalMismatch = 0;
    var totalQ30_1 = 0;
    var totalQ30_2 = 0;
    var totalYield = 0;
    var totalQualityscore_1 = 0;
    var totalQualityscore_2 = 0;
    var totals = 0;

    var sampleID = output_jobj.ConversionResults[0].DemuxResults[i].SampleId;
    var indexSequences = output_jobj.ConversionResults[0].DemuxResults[i].IndexMetrics[0].IndexSequence;
    d = {}
    d['S No'] = i + 1;
    d['Sample ID'] = sampleID;
    d['Barcode'] = indexSequences;
    for (var j = 0; j < x; j++) {
      if (selectValue == 'PF Clusters') {
        var PF_1 = output_jobj.ConversionResults[j].DemuxResults[i].NumberReads;
        d['Lane' + (j + 1)] = PF_1;
        totals += d['Lane' + (j + 1)]
      } 
      else if (selectValue == '% of the Lane') {
        var clusterPF = output_jobj.ConversionResults[j].TotalClustersPF
        var PF = output_jobj.ConversionResults[j].DemuxResults[i].NumberReads;
        totalPF += PF;
        totalPFclusters += clusterPF;
        PercLane = ((PF / clusterPF) * 100).toFixed(2);
        var totals = ((totalPF / totalPFclusters) * 100).toFixed(2);
        d['Lane' + (j + 1)] = PercLane;
      } 
      else if (selectValue == '% Perfect Barcode') {
        var PF_barcodes = output_jobj.ConversionResults[j].DemuxResults[i].IndexMetrics[0].MismatchCounts[0];
        var PF = output_jobj.ConversionResults[j].DemuxResults[i].NumberReads;
        totalPFbarcodes += PF_barcodes;
        totalPFclusters += PF;
        var percent_PF_barcodes = (100 * PF_barcodes / PF).toFixed(2);
        totals = (100 * totalPFbarcodes / totalPFclusters).toFixed(2);
        d['Lane' + (j + 1)] = percent_PF_barcodes;
      } 
      else if (selectValue == '% One mismatch Barcode') {
        var oneMismatch = output_jobj.ConversionResults[j].DemuxResults[i].IndexMetrics[0].MismatchCounts[1];
        var PF = output_jobj.ConversionResults[j].DemuxResults[i].NumberReads;
        totalMismatch += oneMismatch;
        totalPF += PF;
        var percent_mismatch = (100 * oneMismatch / PF).toFixed(2);
        var totals = (100 * totalMismatch / totalPF).toFixed(2);
        d['Lane' + (j + 1)] = percent_mismatch;
      } else if (selectValue == 'Yield (Mbases)') {
        var yield_each = Math.round(0.000001 * output_jobj.ConversionResults[j].DemuxResults[i].Yield);
        d['Lane' + (j + 1)] = yield_each;
        totals += d['Lane' + (j + 1)];
      } else if (selectValue == '% PF Clusters') {
        var PF = output_jobj.ConversionResults[j].DemuxResults[i].NumberReads;
        var totals = 100 * PF / PF;
        d['Lane' + (j + 1)] = totals;
      } else if (selectValue == '% >= 30 bases') {
        var yields = output_jobj.ConversionResults[j].DemuxResults[i].Yield;
        var yieldQ30_1 = output_jobj.ConversionResults[j].DemuxResults[i].ReadMetrics[0].YieldQ30
        var yieldQ30_2 = output_jobj.ConversionResults[j].DemuxResults[i].ReadMetrics[1].YieldQ30;
        totalQ30_1 += yieldQ30_1;
        totalQ30_2 += yieldQ30_2;
        totalYield += yields;
        var percent_Q30 = (100 * (yieldQ30_1 + yieldQ30_2) / output_jobj.ConversionResults[j].DemuxResults[i].Yield).toFixed(2);
        var totals = (100 * (totalQ30_1 + totalQ30_2) / totalYield).toFixed(2);
        d['Lane' + (j + 1)] = percent_Q30;
      } else if (selectValue == 'Mean Quality Score') {
        var yields = output_jobj.ConversionResults[j].DemuxResults[i].Yield;
        var quality_score_1 = output_jobj.ConversionResults[j].DemuxResults[i].ReadMetrics[0].QualityScoreSum;
        var quality_score_2 = output_jobj.ConversionResults[j].DemuxResults[i].ReadMetrics[1].QualityScoreSum;
        totalYield += yields;
        totalQualityscore_1 += quality_score_1;
        totalQualityscore_2 += quality_score_2;
        var mean_quality_score = ((quality_score_1 + quality_score_2) / output_jobj.ConversionResults[j].DemuxResults[i].Yield).toFixed(2);
        var totals = ((totalQualityscore_1 + totalQualityscore_2) / totalYield).toFixed(2);
        d['Lane' + (j + 1)] = mean_quality_score;
      } else {
        displayDiv.style.display = 'none';
      }
    }

    d['Total'] = totals;
    lane_data.push(d);
  }
  draw_table(lane_data, id = "summary-table")
}

var clickOnList = function (checked) {
  var j = checked;
  NgsData(output_jobj, x, j);
}
var NgsData = function (output_jobj, x, j = 0) {
  var sum_TotalClustersRaw = 0,
    sum_Yield = 0,
    lane_data = [];
  for (var i = 0; i < x; i++) {
    var laneNumber = output_jobj.ConversionResults[i].LaneNumber;
    var PF_barcodes = output_jobj.ConversionResults[i].DemuxResults[j].IndexMetrics[0].MismatchCounts[0];
    var PF_clusters = output_jobj.ConversionResults[i].DemuxResults[j].NumberReads;
    var perc_lane = ((PF_clusters / output_jobj.ConversionResults[i].TotalClustersPF) * 100).toFixed(2);
    var percent_PF_barcodes = (100 * PF_barcodes / PF_clusters).toFixed(2);
    var oneMismatch = output_jobj.ConversionResults[i].DemuxResults[j].IndexMetrics[0].MismatchCounts[1];
    var percent_mismatch = (100 * oneMismatch / PF_clusters).toFixed(2);
    var yield_each = Math.round(0.000001 * output_jobj.ConversionResults[i].DemuxResults[j].Yield);
    var percPFCluster = 100 * PF_clusters / PF_clusters;
    var yieldQ30_1 = output_jobj.ConversionResults[i].DemuxResults[j].ReadMetrics[0].YieldQ30
    var yieldQ30_2 = output_jobj.ConversionResults[i].DemuxResults[j].ReadMetrics[1].YieldQ30;
    var percent_Q30 = (100 * (yieldQ30_1 + yieldQ30_2) / output_jobj.ConversionResults[i].DemuxResults[j].Yield).toFixed(2);
    var quality_score_1 = output_jobj.ConversionResults[i].DemuxResults[j].ReadMetrics[0].QualityScoreSum;
    var quality_score_2 = output_jobj.ConversionResults[i].DemuxResults[j].ReadMetrics[1].QualityScoreSum;
    var mean_quality_score = ((quality_score_1 + quality_score_2) / output_jobj.ConversionResults[i].DemuxResults[j].Yield).toFixed(2);
    var d = {}
    d['Lane'] = laneNumber;
    d['PF Clusters'] = PF_clusters;
    d['% of the lane'] = perc_lane;
    d['% Perfect barcode'] = percent_PF_barcodes;
    d['% One mismatch barcode'] = percent_mismatch;
    d['Yield (Mbases)'] = yield_each;
    d['% PF Clusters'] = percPFCluster;
    d['% >= Q30 bases'] = percent_Q30;
    d['Mean Quality Score'] = mean_quality_score;
    lane_data.push(d);
    sum_TotalClustersRaw += PF_clusters;
    sum_Yield += yield_each;
  }
  draw_table(lane_data, id = "test_div")
  flowCell_Summary(sum_TotalClustersRaw, sum_TotalClustersRaw, sum_Yield);
}

var clickForUndetermine = function () {
  var lane_data = [],
    sum_of_TotalClusterRaw = 0,
    sum_of_TotalClusterPF = 0,
    sumOfClusterPF = 0,
    sum_of_Yield = 0;
  for (var i = 0; i < x; i++) {
    var f_TotalClusterRaw = output_jobj.ConversionResults[i].TotalClustersRaw;
    var f_TotalClusterPF = output_jobj.ConversionResults[i].TotalClustersPF;
    var UndetermineYield = Math.round(0.000001 * output_jobj.ConversionResults[i].Undetermined.Yield);
    var laneNumber = output_jobj.ConversionResults[i].LaneNumber;
    var UndeterminedNumberRead = output_jobj.ConversionResults[i].Undetermined.NumberReads;
    var percLane = (100 * (UndeterminedNumberRead / f_TotalClusterPF)).toFixed(2);
    var PerfectBarcode = (100 * (UndeterminedNumberRead / UndeterminedNumberRead)).toFixed(2);
    var MismatchBarcode = "NaN";
    var f_Yield = Math.round(0.000001 * (output_jobj.ConversionResults[i].Undetermined.Yield));
    var Undetermine_Q30_1 = output_jobj.ConversionResults[i].Undetermined.ReadMetrics[0].YieldQ30;
    var Undetermine_Q30_2 = output_jobj.ConversionResults[i].Undetermined.ReadMetrics[1].YieldQ30;
    var Undetermine_Qscore_1 = output_jobj.ConversionResults[i].Undetermined.ReadMetrics[0].QualityScoreSum;
    var Undetermine_Qscore_2 = output_jobj.ConversionResults[i].Undetermined.ReadMetrics[1].QualityScoreSum;
    var Q30_bases = (100 * (Undetermine_Q30_1 + Undetermine_Q30_2) / output_jobj.ConversionResults[i].Undetermined.Yield).toFixed(2);
    var meanScore = ((Undetermine_Qscore_1 + Undetermine_Qscore_2) / output_jobj.ConversionResults[i].Undetermined.Yield).toFixed(2);

    sum_of_TotalClusterRaw += f_TotalClusterRaw;
    sum_of_TotalClusterPF += UndeterminedNumberRead;
    sumOfClusterPF += f_TotalClusterPF;
    sum_of_Yield += UndetermineYield;
    var PercentageOfCluster = ((f_TotalClusterRaw - f_TotalClusterPF) + UndeterminedNumberRead);
    var percPFCluster = (100 * UndeterminedNumberRead / PercentageOfCluster).toFixed(2);
    var d = {}
    d['Lane'] = laneNumber;
    d['PF Clusters'] = UndeterminedNumberRead;
    d['% of the lane'] = percLane;
    d['% Perfect barcode'] = PerfectBarcode;
    d['% One mismatch barcode'] = MismatchBarcode;
    d['Yield (Mbases)'] = f_Yield;
    d['% PF Clusters'] = percPFCluster;
    d['% >= Q30 bases'] = Q30_bases;
    d['Mean Quality Score'] = meanScore;
    lane_data.push(d);
  }
  draw_table(lane_data, id = 'test_div');
  flowCell_Summary(((sum_of_TotalClusterRaw - sumOfClusterPF) + sum_of_TotalClusterPF), sum_of_TotalClusterPF, sum_of_Yield);
}

const draw_table = function (data, id) {
  var columns = Object.keys(data[0]);
  var main_table = document.createElement('table');
  main_table.setAttribute('class', 'table table-striped table-hover  m-auto w-75')
  var main_tbody = document.createElement('tbody');
  var header_row = document.createElement('tr');
  document.getElementById(id).removeChild(document.getElementById(id).childNodes[2]);
  for (var c in columns) {
    c = columns[c];
    var header_cell = document.createElement('th');
    header_cell.innerHTML = c;
    header_row.appendChild(header_cell);
  }
  main_tbody.appendChild(header_row);
  for (var d in data) {
    d = data[d];
    var data_row = document.createElement('tr');
    for (var c in columns) {
      c = columns[c];
      var row_cell = document.createElement('td');
      row_cell.innerHTML = d[c];
      data_row.appendChild(row_cell);
    }
    main_tbody.appendChild(data_row);
    main_table.appendChild(main_tbody)
    document.getElementById(id).appendChild(main_table);
  }
}

var flowCell_Summary = function (sum_of_TotalClusterRaw, sum_of_TotalClusterPF, sum_of_Yield) {
  document.getElementById("clustersRaw").innerHTML = sum_of_TotalClusterRaw;
  document.getElementById("clustersPF").innerHTML = sum_of_TotalClusterPF;
  document.getElementById("clustersyield").innerHTML = sum_of_Yield;
}

var setAttributes = function (element, attributes) {
  Object.keys(attributes).forEach(function (name) {
    element.setAttribute(name, attributes[name]);
  })
}