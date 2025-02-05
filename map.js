// Bing Maps API key
const bingApiKey = "ApTJzdkyN1DdFKkRAE6QIDtzihNaf6IWJsT-nQ_2eMoO4PN__0Tzhl2-WgJtXFSp";

// Define base layers
const baseLayers = [
new ol.layer.Tile({
    title: "Hybrid",
    type: "base",
    visible: false,
    source: new ol.source.BingMaps({
      key: bingApiKey,
      imagerySet: "AerialWithLabels",
    }),
  }),
new ol.layer.Tile({
    title: "Imagery",
    type: "base",
    visible: false,
    source: new ol.source.BingMaps({
      key: bingApiKey,
      imagerySet: "Aerial",
    }),
  }),
  new ol.layer.Tile({
    title: "Topographic",
    type: "base",
    visible: true,
    source: new ol.source.OSM(),
  }),  
];

// Define map view
const mapView = new ol.View({
  center: [0, 0],
  zoom: 2,
});

// Initialize map
const map = new ol.Map({
  target: "map",
  layers: [
    new ol.layer.Group({
      title: "BaseMaps",
      layers: baseLayers,
    }),
  ],
  view: mapView,
});

// Add LayerSwitcher control
const layerSwitcher = new ol.control.LayerSwitcher({
  activationMode: "click",
  startActive: false,
  tipLabel: "Basemaps",
  groupSelectStyle: "group",
});
map.addControl(layerSwitcher);

// Define a style for the polygons
const polygonStyle = new ol.style.Style({
  fill: new ol.style.Fill({
    color: 'rgba(128, 128, 128, 0.4)', 
  }),
  stroke: new ol.style.Stroke({
    color: '#5c5757',
    width: 2,
  }),
});

const hoverStyle = new ol.style.Style({
  fill: new ol.style.Fill({
    color: 'rgba(128, 128, 128, 0.6)', 
  }),
  stroke: new ol.style.Stroke({
    color: '#a3a3a3',
    width: 2,
  }),
});

// Add GeoJSON layer for manual polygons
const geojsonLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'data/salzburg.json', 
    format: new ol.format.GeoJSON(),
  }),
  style: polygonStyle,
});

// Add the GeoJSON layer to the map
map.addLayer(geojsonLayer);

// Zweiter GeoJSON-Layer laden
const secondGeojsonLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'data/Salzachauen.geojson', 
    format: new ol.format.GeoJSON(),
  }),
  style: polygonStyle,
});

// Zweiten Layer zur Karte hinzufügen
map.addLayer(secondGeojsonLayer);

// Fit the map view to the extent of the GeoJSON layer
geojsonLayer.getSource().once('change', () => {
  if (geojsonLayer.getSource().getState() === 'ready') {
    const extent = geojsonLayer.getSource().getExtent();
    mapView.fit(extent, { padding: [50, 50, 50, 50] });
  }
});

// Add Layer Control UI
const legendContainer = document.createElement('div');
legendContainer.id = "legend";
legendContainer.style.position = "absolute";
legendContainer.style.top = "10px";
legendContainer.style.right = "600px";
legendContainer.style.background = "lightgrey";
legendContainer.style.padding = "10px";
legendContainer.style.border = "1px solid black";
legendContainer.style.zIndex = "1000";
legendContainer.innerHTML = `
  <strong>Layer Control</strong><br>
  <input type="checkbox" id="toggleSalzburg" checked> Salzachauen<br>
  <input type="checkbox" id="toggleSalzachauen" checked> Salzach
`;
document.body.appendChild(legendContainer);

map.getViewport().appendChild(legendContainer);

// Toggle Layer Visibility
function toggleLayer(layer, checkboxId) {
  document.getElementById(checkboxId).addEventListener("change", function() {
    layer.setVisible(this.checked);
  });
}

toggleLayer(geojsonLayer, "toggleSalzburg");
toggleLayer(secondGeojsonLayer, "toggleSalzachauen");

// Anpassung der Hover-Funktion für beide Layer
let lastHoveredFeature = null;
map.on('pointermove', function (event) {
  map.getTargetElement().style.cursor = ''; // Standard-Cursor zurücksetzen

  // Nur das oberste Feature erkennen
  const topFeature = map.forEachFeatureAtPixel(event.pixel, function (feature) {
    return feature;
  });

  if (topFeature) {
    if (topFeature.getGeometry().getType() === 'Polygon' || topFeature.getGeometry().getType() === 'MultiPolygon') {
      if (lastHoveredFeature && lastHoveredFeature !== topFeature) {
        lastHoveredFeature.setStyle(polygonStyle);
      }

      // Setze den Hover-Style
      topFeature.setStyle(hoverStyle);
      map.getTargetElement().style.cursor = 'pointer'; // Maus zu Hand ändern
      lastHoveredFeature = topFeature;
    }
  }

  // Setze den Style zurück, wenn die Maus nicht mehr über einem Feature ist
  if (lastHoveredFeature && !map.hasFeatureAtPixel(event.pixel)) {
    lastHoveredFeature.setStyle(polygonStyle);
    lastHoveredFeature = null;
  }
});

// Toggle Info Panel Visibility
const infoButton = document.getElementById('infoButton');
const infoPanel = document.getElementById('infoPanel');

infoButton.addEventListener('click', () => {
  if (infoPanel.style.display === 'none' || infoPanel.style.display === '') {
    infoPanel.style.display = 'block';
  } else {
    infoPanel.style.display = 'none';
  }
});
