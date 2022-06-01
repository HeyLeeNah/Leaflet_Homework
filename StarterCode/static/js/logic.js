
function getColor(depth){
    if(depth < 0){
        return "#77FF33"
    }
    else if(depth<10){
      return "#6EAD2A"
    }
    else if (depth <20){
        return "#F6F92F"
    }
    else if (depth <30){
      return "#F9AC2F"
  }
  else if (depth <40){
      return "#F9471B"
  } 
  else {
      return "#5D1200"
  }
};
// An array that contains all the earthquakes

var earthquakeMarkers = [];
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  console.log(data)
// Once we get a response, send the data.features object to the createFeatures function.
createMarkers(data.features);

});
function createMarkers(earthquakeData) {
// Loop through earthquakes and create markers.
for (var i = 0; i < earthquakeData.length; i++) {
    var location = earthquakeData[i].geometry.coordinates[2]
  // Setting the marker radius for the state by passing population into the markerSize function
  earthquakeMarkers.push(
    L.circle(earthquakeData[i].geometry.coordinates.slice(0,2).reverse(), {
      stroke: true,
      fillOpacity: 0.5,
      color: getColor(earthquakeData[i].geometry.coordinates[2]),
      radius: (earthquakeData[i].properties.mag)*15000
      
    })
  );
}
createMap(earthquakeMarkers)
}
function createMap(earthquakeMarkers){
// Create the base layers.
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Create two separate layer groups: one for the city markers and another for the state markers.

var earthquakes = L.layerGroup(earthquakeMarkers);



// Define a map object.
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
  layers: [street, earthquakes]
});

    var legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        label = ['<strong>Depth of Epicenter</strong>'];
        var grades = [0, 1, 2, 3, 4, 5];
        var colors = ["#77FF33", "#6EAD2A", "#F6F92F", "#F9AC2F","#F9471B", "#5D1200"];

        for (var i = 0; i<grades.length; i++) {
            div.innerHTML +=
            "<li style= 'background: " + colors[i] + "'></li> " +
            grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
          }
        return div;
      
        };
    legend.addTo(myMap);
};
