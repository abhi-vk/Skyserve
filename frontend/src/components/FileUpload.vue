<template>
  <div
    class="file-upload-container"
    @dragover.prevent="handleDragOver"
    @dragleave="handleDragLeave"
    @drop.prevent="handleDrop"
    @click="triggerFileInput"
  >
    <input
      type="file"
      ref="fileInput"
      @change="handleFileSelect"
      style="display: none;"
      accept=".geojson,.kml"
    />
    <div class="upload-content">
      <i class="fas fa-file-upload upload-icon"></i>
      <p class="upload-text">Drag & drop GeoJSON or KML files here, or click to select files</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "FileUpload",
  emits: ["fileUploaded", "error"], // Emit 'error' for invalid files
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileSelect(event) {
      const files = event.target.files;
      this.processFiles(files);
    },
    handleDrop(event) {
      const files = event.dataTransfer.files;
      this.processFiles(files);
    },
    processFiles(files) {
      Array.from(files).forEach((file) => {
        // Validate file type
        if (!file.name.endsWith(".geojson") && !file.name.endsWith(".kml")) {
          this.$emit("error", "Invalid file type. Only GeoJSON and KML are supported.");
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          const fileContent = reader.result;

          try {
            if (file.name.endsWith(".geojson")) {
              const parsedData = JSON.parse(fileContent);
              this.$emit("fileUploaded", { type: "geojson", data: parsedData });
            } else if (file.name.endsWith(".kml")) {
              // Pass raw KML content for further processing in the map component
              this.$emit("fileUploaded", { type: "kml", data: fileContent });
            }
          } catch (error) {
            this.$emit("error", "Failed to parse the file. Ensure the file format is correct.");
          }
        };
        reader.readAsText(file);
      });
    },
    handleDragOver(event) {
      event.currentTarget.classList.add("drag-over");
    },
    handleDragLeave(event) {
      event.currentTarget.classList.remove("drag-over");
    },
  },
};
</script>

<style scoped>
.file-upload-container {
  border: 2px dashed #bdbac0;
  text-align: center;
  width: 60%;
  margin: auto;
  height: 80px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.file-upload-container:hover {
  background-color: #f9f9f9;
  border-color: #007bff;
}

.file-upload-container.drag-over {
  background-color: #e6f7ff;
  border-color: #007bff;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-icon {
  font-size: 24px;
  color: #007bff;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 14px;
  color: #000000;
}
</style>
