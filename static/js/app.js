function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var sampleurl = '/metadata/'+sample;
    var sampledata=d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
  
    sampledata.html("");  
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    d3.json(sampleurl).then(function(sample){
      Object.entries(sample).forEach(function([key,value]) {
        var row =sampledata.append("p");
        row.text(`${key} : ${value}`);
        } 
      )
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

  })}


//
function buildCharts(sample) {

   // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

   var sampleurl = '/samples/'+sample;
   d3.json(sampleurl).then(function(sample){
     var p_values = sample.sample_values.slice(0,10);
     var p_lables = sample.otu_ids.slice(0,10);
     var p_hover = sample.otu_labels.slice(0,10);
     var x_values = sample.otu_ids;
     var y_values = sample.sample_values;
     var mark_size = sample.sample_values;
     var mark_colors = sample.otu_ids;
     var text_values = sample.otu_labels;

     var piechart = [{
      values: p_values,
      labels: p_lables,
      hoverinfo: p_hover,
      type: 'pie'
      }];
    Plotly.newPlot('pie', piechart);
  

    var trace1 = {
      x: x_values,
      y: y_values,
      text: text_values,
      mode: 'markers',
      marker: {
        color: mark_colors,
        size: mark_size
        
      }
    };
  
    var bubble = [trace1];


    Plotly.newPlot('bubble', bubble);
  })
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
