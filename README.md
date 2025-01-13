# GeoSpace Data App

GeoSpace Data App is a web application built using the MEVN (MongoDB, Express, Vue.js, Node.js) stack. The app allows users to upload, view, and manage geospatial data in formats like GeoJSON and KML. Users can also interact with maps, draw shapes, add markers, measure distances, and save their data for future use.

## Features

- **User Authentication**: Secure login and registration for managing user-specific data.
- **Map Interaction**: View maps with Leaflet, draw shapes, add markers, and measure distances.
- **File Uploads**: Drag and drop GeoJSON/KML files to visualize data on the map.
- **Save & Download Data**: Save drawn shapes and markers to the database or download them as GeoJSON files.
- **Hover Information**: View detailed hover cards with information about map features.
- **User Dashboard**: View and select saved geospatial data.

## Technologies Used

### Frontend:
- **Vue.js**: Reactive UI and component-based architecture.
- **Vue Router**: Manage application routes.
- **Vuex** (optional): State management for user authentication and data.
- **Leaflet**: Interactive maps and drawing tools.
- **Bootstrap**: Responsive UI design.

### Backend:
- **Node.js**: Server runtime environment.
- **Express.js**: Backend framework for building APIs.
- **MongoDB**: Database for storing user and geospatial data.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB instance (local or cloud)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repository/geospace-data-app.git
   cd geospace-data-app
   ```

2. **Backend Setup:**
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file in the `backend` directory with the following variables:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```
   - Start the backend server:
     ```bash
     npm start
     ```

3. **Frontend Setup:**
   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file in the `frontend` directory with the following variables:
     ```env
     VITE_API_BASE_URL=http://localhost:5000/api
     ```
   - Start the frontend development server:
     ```bash
     npm run dev
     ```

4. **Access the Application:**
   Open your browser and navigate to `http://localhost:5173` (default port for Vite).

## Folder Structure

```
GeoSpace-Data-App/
|├── backend/
|   |├── models/         # Mongoose models
|   |├── routes/         # API routes
|   |├── controllers/   # Business logic
|   |└── server.js      # Server entry point
|├── frontend/
|   |├── src/
|       |├── components/  # Vue components
|       |├── views/        # Vue pages
|       |├── router/       # Vue Router configuration
|       |├── store/        # Vuex store (optional)
|       |├── main.js       # Entry point
|└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login with email and password.

### Geospatial Data
- `POST /api/data/upload`: Upload GeoJSON or KML files.
- `POST /api/data/save`: Save drawn shapes and markers.
- `GET /api/data`: Fetch saved geospatial data.

## Usage Instructions

1. **Login or Register:**
   - Access the authentication page to log in or register.

2. **Interact with the Map:**
   - Drag and drop GeoJSON/KML files onto the map.
   - Use the drawing tools to create shapes and add markers.

3. **Save Data:**
   - Click the "Save GeoJSON" button to store your drawn data.

4. **Download Data:**
   - Use the "Download GeoJSON" button to export your data.

5. **Manage Saved Data:**
   - Navigate to the user dashboard to view and load saved datasets.

## Future Improvements

- Add support for TIFF file visualization.
- Implement advanced filtering and search for geospatial data.
- Enhance user dashboards with analytics.
- Improve mobile responsiveness.

## Contributing

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.



## Acknowledgments

- [Leaflet](https://leafletjs.com/): For interactive maps.
- [TMcW/togeojson](https://github.com/tmcw/togeojson): For converting KML to GeoJSON.
- [Bootstrap](https://getbootstrap.com/): For responsive design.
- The open-source community for their amazing tools and libraries.

