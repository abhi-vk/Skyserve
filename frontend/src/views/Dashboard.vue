<template>
  <div>
    <Navbar />
    <div class="dashboard-container">
      <div class="map-wrapper">
        <!-- FileUpload Component -->
        <FileUpload @fileUploaded="handleFileUpload" @error="handleFileError" />

        <!-- MapComponent -->
        <MapComponent
          :geojsonData="geojsonData"
          :kmlData="kmlData"
          @mapReady="onMapReady"
          @dataSaved="fetchSavedData"
        />

        <!-- SavedDataCards Component -->
        <SavedDataCards @data-selected="handleSelectedData" />

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
import SavedDataCards from "../components/SavedDataCards.vue"; // Import the SavedDataCards component

export default {
  name: "Dashboard",
  components: {
    Navbar,
    FileUpload,
    MapComponent,
    SavedDataCards, 
  },
  data() {
    return {
      geojsonData: null,
      kmlData: null,
      errorMessage: null,
      mapInstance: null, 
    };
  },
  methods: {
    handleFileUpload(fileContent) {
      this.errorMessage = null;
      if (fileContent.type === "geojson") {
        this.geojsonData = fileContent.data;
        this.zoomToBounds(this.geojsonData); 
      } else if (fileContent.type === "kml") {
        this.kmlData = fileContent.data; 
        this.zoomToKMLBounds(this.kmlData); 
      }
    },
    handleFileError(error) {
      this.errorMessage = error; 
    },
    onMapReady(mapInstance) {
      this.mapInstance = mapInstance; 
    },
    zoomToBounds(geojsonData) {
      if (this.mapInstance && geojsonData) {
        const layer = L.geoJSON(geojsonData);
        const bounds = layer.getBounds();
        this.mapInstance.fitBounds(bounds, { padding: [20, 20] });
      }
    },
    zoomToKMLBounds(kmlData) {
      
      console.log("Zoom to KML bounds - functionality to be implemented.");
    },

   
    handleSelectedData(selectedData) {
      console.log("Selected data:", selectedData);
      
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
