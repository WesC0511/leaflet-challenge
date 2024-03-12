var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Fetch earthquake data and create map
d3.json(queryUrl).then(function(data) {
  createMap(L.geoJSON(data.features, {
    onEachFeature: function(feature, layer) {
      layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    },
    pointToLayer: function(feature, latlng) {
      return L.circle(latlng, {
          radius: feature.properties.mag * 2000,
          fillColor: feature.geometry.coordinates[2] < 10 ? "#8B4513" :
                      feature.geometry.coordinates[2] < 30 ? "#A0522D" :
                      feature.geometry.coordinates[2] < 50 ? "#CD853F" :
                      feature.geometry.coordinates[2] < 70 ? "#DEB887" :
                      feature.geometry.coordinates[2] < 90 ? "#D2B48C" :
                      "#BC8F8F",
          fillOpacity: 0.7,
          color: "black",
          stroke: true,
          weight: 0.5
      });
    }
  }));
});

// Function to create map
function createMap(earthquakes) {
  var grayscale = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18
  });

  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3,
    layers: [grayscale, earthquakes]
  });

  // Legend for earthquake depth
  var legend = L.control({position: "bottomright"});
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"),
    depth = [-10, 10, 30, 50, 70, 90];
  
    div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
  
    for (var i = 0; i < depth.length; i++) {
      div.innerHTML +=
      '<i style="background:' + (i == 0 ? "#8B4513" : // Brown
                                 i == 1 ? "#A0522D" :
                                 i == 2 ? "#CD853F" :
                                 i == 3 ? "#DEB887" :
                                 i == 4 ? "#D2B48C" :
                                          "#BC8F8F") + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap);
}