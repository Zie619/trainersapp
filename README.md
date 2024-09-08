# Fitness Tracker App

This **Fitness Tracker App** is a full-featured web application designed to help users manage and track their fitness journey. It includes user authentication, workout planning, body metrics tracking, 3D models, and more. The app is built using **React** and integrates several technologies like **Firebase** for authentication, **Three.js** for 3D rendering, and **Google Firebase** for database management.

## Features

- **User Authentication**: Integration with **Firebase Authentication** for secure login and signup functionality.
- **Workout Plan Management**: Users can create, view, and manage workout plans, including repetitions, sets, and exercises.
- **Body Metrics Tracking**: Users can track their height, weight, BMI, body type, and body fat percentage.
- **Conditional Rendering**: Displays workout splits or specific exercises dynamically based on available data.
- **3D Model Viewing**: Integration of **GLB files** using `<model-viewer>` to display 3D models within the app.
- **Responsive Design**: The app adapts to different screen sizes for mobile, tablet, and desktop users.
- **Firebase Firestore**: Workout plans and user data are stored and retrieved using **Firebase Firestore** for persistent data storage.
- **Logging & Debugging**: Console logging and error handling for better debugging and smoother user experience.

## Tech Stack

- **React.js**: For building the user interface and handling component-based logic.
- **Firebase**: Authentication, Firestore database for user data storage.
- **Three.js / model-viewer**: For rendering 3D models.
- **CSS**: Custom styling for a clean and modern interface.
- **Vite**: Used for building and optimizing the development environment.

## Project Setup

To run the app locally, follow these steps:

### Prerequisites

Make sure you have **Node.js** installed on your machine. If not, download and install it from [here](https://nodejs.org/).

### Installation

1. Clone the repository:
   bash
   git clone https://github.com/your-username/fitness-tracker-app.git
   

2. Navigate into the project directory:
   bash
   cd fitness-tracker-app
   

3. Install the required dependencies:
   bash
   npm install
   

4. Set up **Firebase**:
   - Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
   - Enable **Authentication** (Email/Password sign-in method).
   - Set up a **Firestore** database.
   - In the Firebase console, click on "Project Settings" and scroll down to "Your apps".
   - Add a new web app, and copy the Firebase configuration object.

5. Create a `.env` file in the root of your project and add your Firebase configuration:
   plaintext
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   

6. Start the development server:
   bash
   npm start
   

The app should now be running on [http://localhost:3000](http://localhost:3000).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Models Used

- **3D Models**: The app utilizes GLB files for 3D model viewing. Ensure you have the appropriate models placed in your project directory.

## Contributing

Feel free to contribute to the project by submitting issues or pull requests. For any questions or suggestions, please contact me via [email](mailto:your-email@example.com).

## Acknowledgements

- **React.js** for the component-based framework.
- **Firebase** for authentication and database services.
- **Three.js** for 3D rendering capabilities.
- **Model-viewer** for displaying 3D models.

Happy tracking!
