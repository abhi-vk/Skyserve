<template>
    <div>
     
      <div class="form-check form-switch mb-4">
        <input
          class="form-check-input"
          type="checkbox"
          id="toggle"
          v-model="showSavedData"
          @change="toggleDataVisibility"
        />
        <label class="form-check-label" for="toggle">Show Saved Data</label>
      </div>
  
      <div v-if="showSavedData && savedData.length === 0" class="empty-message text-center">
        <p>No saved data available.</p>
      </div>
  
      <div v-if="showSavedData" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div
          v-for="item in savedData"
          :key="item._id"
          class="col mb-4"
        >
          <div
            class="card shadow-sm border-light rounded-3 h-100"
            @click="selectSavedData(item)"
          >
            <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center p-3">
              <h5 class="mb-0">{{ getGeometryType(item) }}</h5>
              <div>
                <button
                  class="btn btn-outline-light btn-sm ms-2"
                  @click="downloadData(item, $event)"
                >
                  Download
                </button>
                <button
                  class="btn btn-outline-danger  btn-sm ms-2"
                  @click="deleteData(item._id, $event)"
                >
                  Delete
                </button>
              </div>
            </div>
            <div class="card-body p-3">
              <p class="coordinates text-muted">{{ getCoordinates(item) }}</p>
              <p class="created-at text-muted">Created at: {{ formatDate(item.createdAt) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  

  <script>
  import {
    getAllSavedDataApi,
    getSavedDataByIdApi,
    deleteSavedDataApi,
  } from "../apis/Data.js";
  import { useToast } from "vue-toastification";
  
  export default {
    name: "SavedDataCards",
    data() {
      return {
        savedData: [],
        showSavedData: true, // Controls visibility of saved data
      };
    },
    created() {
      this.fetchSavedData();
    },
    methods: {
      async fetchSavedData() {
        const toast = useToast();
        try {
          const data = await getAllSavedDataApi(this.$router);
          if (data) {
            this.savedData = data;
            console.log(this.savedData); // Check the structure of the data
          }
        } catch (error) {
          toast.error("Error fetching saved data");
        }
      },
  
      toggleDataVisibility() {
        // Handle the visibility toggle
        if (this.showSavedData) {
          console.log("Data is visible");
        } else {
          console.log("Data is hidden");
        }
      },
  
      async selectSavedData(item) {
        try {
          const selectedData = await getSavedDataByIdApi(item._id, this.$router);
          if (selectedData) {
            this.$emit("data-selected", selectedData);
          }
        } catch (error) {
          console.error("Error selecting saved data", error);
        }
      },
  
      async deleteData(id, event) {
        event.stopPropagation();
        const toast = useToast();
        try {
          const success = await deleteSavedDataApi(id, this.$router);
          if (success) {
            toast.success("Data deleted successfully");
            this.fetchSavedData(); // Refresh the data list after deletion
          }
        } catch (error) {
          toast.error("Error deleting data");
        }
      },
      downloadData(item, event) {
        event.stopPropagation();
  
        // Create a Blob for the GeoJSON data
        const geoJsonBlob = new Blob([JSON.stringify(item.data, null, 2)], {
          type: "application/json",
        });
  
        // Create a temporary anchor element to download the file
        const link = document.createElement("a");
        link.href = URL.createObjectURL(geoJsonBlob);
        link.download = `${item.name || "geojson_data"}.geojson`;
  
        // Append to the DOM, trigger click, and clean up
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
  
      formatDate(date) {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(date).toLocaleDateString("en-US", options);
      },
  
      getGeometryType(item) {
        const features = item?.data?.features;
  
        if (!features || features.length === 0) {
          return "No geometry available";
        }
  
        const geometryTypes = features.map((feature) => feature.geometry.type);
        return geometryTypes.join(", ");
      },
  
      getCoordinates(item) {
        const features = item?.data?.features;
  
        if (!features || features.length === 0) {
          return "No coordinates available";
        }
  
        const coordinatesText = features
          .map((feature) => {
            const geometry = feature.geometry;
  
            if (!geometry || !geometry.coordinates) {
              return "No coordinates available";
            }
  
            if (geometry.type === "Point") {
              return `Point: (${geometry.coordinates[0]}, ${geometry.coordinates[1]})`;
            } else if (geometry.type === "LineString") {
              return `LineString: ${geometry.coordinates
                .map((coord) => `(${coord[0]}, ${coord[1]})`)
                .join(", ")}`;
            } else if (geometry.type === "Polygon") {
              return `Polygon: ${geometry.coordinates
                .map((ring, index) =>
                  ring
                    .map((coord) => `(${coord[0]}, ${coord[1]})`)
                    .join(", ")
                    .concat(` (Ring ${index + 1})`)
                )
                .join("; ")}`;
            }
  
            return `Unknown Type: ${geometry.type}`;
          })
          .join(" | "); 
  
        return `Coordinates: ${coordinatesText}`;
      },
    },
  };
  </script>
  

<style scoped>
.saved-data-card {
  background: #f9f9f9;
  border: 1px solid #ddd;
  padding: 16px;
  margin: 10px 0;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.saved-data-card:hover {
  transform: scale(1.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
}

.delete-button{
  background-color: red;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 5px 10px;
  cursor: pointer;
  margin-left: 10px;
}


.coordinates {
  font-size: 14px;
  color: #555;
}

.created-at {
  font-size: 12px;
  color: #888;
}

.empty-message {
  text-align: center;
  padding: 20px;
  font-size: 16px;
  color: #aaa;
}
</style>
