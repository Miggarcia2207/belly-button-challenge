// Use D3 to read in the samples.json file
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
  .then(jsonData => {
    // The JSON data has been loaded successfully
    var data = jsonData;

    // Populate the dropdown menu with test subject IDs
    var dropdownMenu = d3.select("#selDataset");
    data.names.forEach(name => {
      dropdownMenu.append("option").text(name).property("value", name);
    });

    // Create a function to update all the plots
    function updatePlots(selectedID) {
      // Get the selected individual's data
      var individualData = data.samples.find(sample => sample.id === selectedID);
      var metadata = data.metadata.find(entry => entry.id.toString() === selectedID);

      // Update the sample metadata
      var metadataDiv = d3.select("#sample-metadata");
      metadataDiv.html("");
      Object.entries(metadata).forEach(([key, value]) => {
        metadataDiv.append("p").text(`${key}: ${value}`);
      });

      // Update the bar chart
      createBarChart(individualData);

      // Update the bubble chart
      createBubbleChart(individualData);

      // TODO: Update other charts or elements as needed
    }

    // Create an event listener for the dropdown menu
    function optionChanged(selectedID) {
      updatePlots(selectedID);
    }
    dropdownMenu.on("change", function () {
      var selectedID = d3.select(this).property("value");
      optionChanged(selectedID);
    });

    // Function to create the bar chart
    function createBarChart(data) {
      var trace = {
        x: data.sample_values.slice(0, 10).reverse(),
        y: data.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
        text: data.otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
      };

      var layout = {
        title: "Top 10 OTUs",
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU IDs" }
      };

      var chartData = [trace];

      Plotly.newPlot("bar-chart", chartData, layout);
    }

    // Function to create the bubble chart
    function createBubbleChart(data) {
      var trace = {
        x: data.otu_ids,
        y: data.sample_values,
        text: data.otu_labels,
        mode: "markers",
        marker: {
          size: data.sample_values,
          color: data.otu_ids,
          colorscale: "Earth"
        }
      };

      var layout = {
        title: "OTU Frequency",
        xaxis: { title: "OTU IDs" },
        yaxis: { title: "Sample Values" }
      };

      var chartData = [trace];

      Plotly.newPlot("bubble", chartData, layout);
    }

    // Initial rendering
    var initialID = data.names[0];
    updatePlots(initialID);

  })
  .catch(error => {
    // An error occurred while loading the JSON data
    console.log("Error loading JSON data:", error);
  });



