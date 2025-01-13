<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <div class="map-container border rounded shadow-sm">
          <l-map
            ref="map"
            :zoom="zoomLevel"
            :center="mapCenter"
            style="height: 80vh; width: 100%; border-radius: 5px"
            @ready="initializeMap"
          >
            <l-tile-layer :url="tileLayerUrl" />
            <l-feature-group ref="featureGroup">
              <l-geo-json :geojson="geojsonData" />
            </l-feature-group>
          </l-map>
        </div>
        <div class="text-center mt-3">
          <button class="btn btn-primary" @click="handleDownloadGeoJSON">
            Download GeoJSON
          </button>
          <button
            class="btn btn-success ms-2"
            @click="handleSaveGeoJSON"
            :disabled="isSaveDisabled"
          >
            Save GeoJSON
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="hoveredFeature"
      class="hover-card"
      :style="{ top: hoveredFeature.y + 'px', left: hoveredFeature.x + 'px' }"
    >
      <div class="hover-card-content">
        <h4>{{ hoveredFeature.properties.name || "Unnamed Feature" }}</h4>
        <p>
          {{
            hoveredFeature.properties.description || "No description available."
          }}
        </p>
        <p>
          <strong>Region:</strong>
          {{ hoveredFeature.properties.location || "Unknown location" }}
        </p>
        <p><strong>Coordinates:</strong> {{ hoveredFeature.coordinates }}</p>
      </div>
    </div>

    <div v-if="distance" class="distance-label">
      Distance: {{ distance.toFixed(2) }} km
    </div>
  </div>
</template>

<script>
import {
  LMap,
  LTileLayer,
  LGeoJson,
  LFeatureGroup,
} from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import "leaflet-draw";
import { kml } from "@tmcw/togeojson";
import { saveDrawnDataApi } from "../apis/Data.js"; // Import the API call

export default {
  name: "MapComponent",
  props: {
    geojsonData: {
      type: Object,
      default: null,
    },
    kmlData: {
      type: String,
      default: null,
    },
  },
  components: {
    LMap,
    LTileLayer,
    LFeatureGroup,
  },
  data() {
    return {
      drawnShapes: [],
      tileLayerUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      mapInstance: null,
      drawnItems: null,
      distance: 0,
      zoomLevel: 4,
      mapCenter: [34.0479, 100.6197],
      hoveredFeature: null,
      markers: [],
      isDrawing: false,
      isMarkerToolActive: false,
    };
  },
  watch: {
    geojsonData(newGeoJSON) {
      if (this.mapInstance && newGeoJSON) {
        this.renderGeoJSON(newGeoJSON);
      }
    },
  },
  methods: {
    initializeMap(mapInstance) {
      this.mapInstance = mapInstance;
      this.drawnItems = L.featureGroup().addTo(mapInstance);

      const drawControl = new L.Control.Draw({
        draw: {
          polygon: true,
          rectangle: true,
          circle: true,
        },
        edit: {
          featureGroup: this.drawnItems,
          remove: true,
        },
      });
      mapInstance.addControl(drawControl);

      mapInstance.on(L.Draw.Event.CREATED, (event) => {
        const layer = event.layer;
        this.drawnItems.addLayer(layer);
        this.drawnShapes.push(layer.toGeoJSON());
        this.isDrawing = false;
        this.mapInstance.getContainer().style.cursor = "";
      });

      mapInstance.on(L.Draw.Event.DRAWSTART, (event) => {
        this.isDrawing = true;
        this.mapInstance.getContainer().style.cursor = "crosshair";
      });

      mapInstance.on("click", this.addMarker);
      mapInstance.on("mouseover", this.onFeatureHover);
      mapInstance.on("mouseout", this.onFeatureMouseOut);
      mapInstance.on("draw:created", this.calculateDistance);

      if (this.geojsonData) {
        this.renderGeoJSON(this.geojsonData);
      }
    },

    onFeatureHover(event) {
      const layer = event.target;
      if (layer.feature) {
        const feature = layer.feature;
        const coordinates = feature.geometry.coordinates;

        this.hoveredFeature = {
          x: event.originalEvent.clientX,
          y: event.originalEvent.clientY,
          properties: feature.properties || {},
          coordinates: coordinates
            ? coordinates.join(", ")
            : "No coordinates available",
        };
      }
    },

    onFeatureMouseOut() {
      this.hoveredFeature = null;
    },

    addMarker(event) {
      if (this.isMarkerToolActive) {
        const newMarker = L.marker(event.latlng, { draggable: true }).addTo(
          this.mapInstance
        );
        newMarker.on("dragend", () => {
          console.log("Marker moved:", newMarker.getLatLng());
        });

        this.markers.push(newMarker);
      }
    },

    calculateDistance(event) {
      const layer = event.layer;
      if (layer instanceof L.Polyline) {
        this.distance = this.calculatePolylineDistance(layer.getLatLngs());
      }
    },

    calculatePolylineDistance(latLngs) {
      let distance = 0;
      for (let i = 0; i < latLngs.length - 1; i++) {
        distance += latLngs[i].distanceTo(latLngs[i + 1]);
      }
      return distance / 1000;
    },

    renderGeoJSON(newGeoJSON) {
      if (this.mapInstance && newGeoJSON) {
        const geoJsonLayer = L.geoJSON(newGeoJSON).addTo(this.drawnItems);
        geoJsonLayer.eachLayer((layer) => {
          layer.on("mouseover", this.onFeatureHover);
          layer.on("mouseout", this.onFeatureMouseOut);
        });
        this.mapInstance.fitBounds(geoJsonLayer.getBounds(), {
          padding: [20, 20],
        });
      }
    },

    renderKML(newKML) {
      if (newKML) {
        const parser = new DOMParser();
        const kmlDocument = parser.parseFromString(newKML, "application/xml");
        const convertedGeoJSON = kml(kmlDocument);

        if (convertedGeoJSON) {
          const layer = L.geoJSON(convertedGeoJSON).addTo(this.drawnItems);
          this.mapInstance.fitBounds(layer.getBounds(), { padding: [20, 20] });
        }
      }
    },

    handleDownloadGeoJSON() {
      const geoJSONData = {
        type: "FeatureCollection",
        features: this.drawnShapes.map((shape) => {
          return {
            type: "Feature",
            geometry: shape.geometry,
            properties: {
              name: shape.properties?.name || "Unnamed Feature",
              description:
                shape.properties?.description || "No description available",
              region: shape.properties?.region || "Unknown region",
            },
          };
        }),
      };

      const blob = new Blob([JSON.stringify(geoJSONData)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "drawn.geojson";
      a.click();
    },
    

    async handleSaveGeoJSON() {
  const geoJSONData = {
    type: "FeatureCollection",
    features: this.drawnShapes.map((shape) => {
      return {
        type: "Feature",
        geometry: shape.geometry,
        properties: {
          name: shape.properties?.name || "Unnamed Feature",
          description:
            shape.properties?.description || "No description available",
          region: shape.properties?.region || "Unknown region",
        },
      };
    }),
  };

  const success = await saveDrawnDataApi(geoJSONData, this.$router);

  if (success) {
    this.drawnShapes = [];
    this.$emit("dataSaved"); 
    window.location.reload();
  }
}
,
  },
};
</script>

<style scoped>
.map-container {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.hover-card {
  position: absolute;
  background-color: rgb(255, 255, 255);
  border: 1px solid #ccc;
  padding: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  border-radius: 5px;
}

.hover-card-content h4 {
  margin: 0;
  font-size: 16px;
}

.hover-card-content p {
  font-size: 14px;
  color: #555;
}

.distance-label {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 5px;
  border-radius: 4px;
  z-index: 1000;
}
</style>
