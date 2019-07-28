//Need to store the API URL inside of a variable
const API_KEY = "pk.eyJ1IjoidG93bjEzNTY5IiwiYSI6ImNqeGhtdWl6ejAyYjUzeG82MzJvOTdlMHIifQ.Nr7yxe9ksv3cQijuL1p_Gw";
var all_week_EQ_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

//Use D3 to retrieve the GeoJson
d3.json(all_week_EQ_URL, function(data) { //we are applying the function to the data witin the JSON objet
    console.log(data) //making the data available for view in the console
    cr_Features(data.features); //We will need to use this function again on the EQ data
});

//Apply cr_Features to the EQ data
function cr_Features(EQ_Data) { //Looping through the features in features array
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place+"</h3><hr><p>" + new DataCue(feature.properties.time) + "</p>"); //bind each feature to a popup
    }

//We need a GeoJSON layer that houses the EQ_Data features
var earthquakes = L.geoJSON(EQ_Data, {
    pointToLayer: function (feature, latlng) {
              return L.circleMarker(latlng, { //creates a circular marker for each data point
        radius: markerSize(feature.properties.mag), //radius of the circle is determined by the magnitude
        fillColor: fillColor(feature.properties.mag), //color of the circle will vary on a spectrum according to the magnitude
        color: "blue",
        weight: 0.6,
        opacity: 0.4,
        fillOpacity: 0.6
      });
      },


    onEachFeature: function(feature, layer) {
        return layer.bindPopup(`<strong>Place:</strong> ${feature.properties.place}<br><strong>Magnitude:</strong> ${feature.properties.mag}`);
    }
});
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // We need a streetmap layer
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
    //Darkmap layer added
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });
  
    
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
  

    var overlayMaps = {
      Earthquakes: earthquakes
    };
  

    var myMap = L.map("map", {
      center: [
        40, -75
      ],
      zoom: 2.85,
      layers: [streetmap, earthquakes]
    });
  
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  
  
  var legend = L.control({ position: 'bottomright'});//Adding a legend
  
  
    legend.onAdd = function() {
      var div = L.DomUtil.create('div', 'info legend'),
          magnitude = [0,1,2,3,4,5,6],
          labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < magnitude.length; i++) {
          div.innerHTML +=
              '<i style="background:' + fillColor(magnitude[i] + 1) + '"></i> ' +
              magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);
    };
  
  function fillColor(magnituge) {
  
      switch (true) {
        case magnituge >= 6.0:
          return 'red';
          break;
        
        case magnituge >= 5.0:
          return 'red-orange';
          break;
  
        case magnituge >= 4.0:
          return 'yellow';
          break;
        
        case magnituge >= 3.0:
          return 'green';
          break;
  
        case magnituge >= 2.0:
          return 'blue';
          break;
  
        case magnituge >= 1.0:
          return 'indigo';
          break;
  
        default:
          return 'violet';
      };
  };
  
  
  function markerSize(magnituge) {
    return magnituge*2.25;
  }
  
  
  
  