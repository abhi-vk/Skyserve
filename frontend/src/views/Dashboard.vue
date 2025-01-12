<template>
  <div>
    <Navbar />
    <div class="dashboard-container">
      <div class="map-wrapper">
        <!-- FileUpload Component -->
        <FileUpload 
          @fileUploaded="handleFileUpload" 
          @error="handleFileError" 
        />

        <!-- MapComponent -->
        <MapComponent 
          :geojsonData="geojsonData" 
          :kmlData="kmlData" 
          @mapReady="onMapReady" 
        />

        <!-- Error Display -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import FileUpload from "../components/FileUpload.vue";
import MapComponent from "../components/Map.vue";

export default {
  name: "Dashboard",
  components: {
    Navbar,
    FileUpload,
    MapComponent,
  },
  data() {
    return {
      geojsonData: null,
      kmlData: null,
      errorMessage: null,
      mapInstance: null, // Reference to the map instance for advanced features
    };
  },
  methods: {
    handleFileUpload(fileContent) {
      this.errorMessage = null; // Clear previous errors
      if (fileContent.type === "geojson") {
        this.geojsonData = fileContent.data; // Update GeoJSON data
        this.zoomToBounds(this.geojsonData); // Adjust map view
      } else if (fileContent.type === "kml") {
        this.kmlData = fileContent.data; // Update KML data
        this.zoomToKMLBounds(this.kmlData); // Adjust map view (if implemented)
      }
    },
    handleFileError(error) {
      this.errorMessage = error; // Show error message
    },
    onMapReady(mapInstance) {
      this.mapInstance = mapInstance; // Capture the map instance for later use
    },
    zoomToBounds(geojsonData) {
      if (this.mapInstance && geojsonData) {
        const layer = L.geoJSON(geojsonData);
        const bounds = layer.getBounds();
        this.mapInstance.fitBounds(bounds, { padding: [20, 20] });
      }
    },
    zoomToKMLBounds(kmlData) {
      // Handle zooming for KML data (if required, you can convert KML to GeoJSON first)
      console.log("Zoom to KML bounds - functionality to be implemented.");
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 30px auto;
  width: 90%;
}

.map-wrapper {
  position: relative;
  border: 1px solid #24273b;
  padding: 10px;
  border-radius: 5px;
  background: #f9f9f9;
}

.text-center h2 {
  margin: auto;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}
</style>
