# Emotion Based Music Recommendation System

![Project Banner](https://github.com/user-attachments/assets/fde116a4-c646-4f86-b02d-67cf6d8a0743) 

<img align="right" height="150" src="https://github.com/user-attachments/assets/92d7b9d1-8893-4912-b7d6-d7393ab4b271"  />

> **"Your face is the controller."** > Moodify bridges the gap between human emotion and digital auditory experiences. It uses real-time computer vision to detect your mood, age, and local weather to curate the perfect Spotify playlist for the moment.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Moodify-22c55e?style=for-the-badge&logo=vercel)](https://moodify-mauve.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/deepakcode21/face-emotion-music-player)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

## Features

* **🎭 Real-Time Emotion Detection:** Uses `face-api.js` to detect 7 distinct emotions (Happy, Sad, Angry, Fearful, Disgusted, Surprised, Neutral).
* **🧠 Context-Aware Logic:** It doesn't just check your mood; it combines:
    * **Age:** (e.g., Retro hits for older demographics, Viral pop for Gen-Z).
    * **Weather:** (e.g., Cozy acoustic for rain, Upbeat for sunny days).
    * **Time:** (e.g., Lofi for late nights).
* **🎧 Seamless Spotify Integration:** Utilizes the Spotify Web API to fetch and play curated playlists instantly.
* **🌦️ Live Weather Dashboard:** Integrated Open-Meteo & BigDataCloud APIs for real-time temperature and location data.
* **📱 Fully Responsive Glassmorphism UI:** A modern, aesthetic interface built with Tailwind CSS that adapts from Desktop to Mobile.
* **🔒 Secure & Optimized:** Uses Vite environment variables for security and lazy loading for performance.

## Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React.js (Vite), JavaScript (ES6+) |
| **Styling** | Tailwind CSS, Lucide React (Icons) |
| **AI / ML** | FaceAPI.js (Tensorflow.js based) |
| **APIs** | Spotify Web API, Open-Meteo (Weather), BigDataCloud (Geolocation) |
| **Deployment** | Vercel |

## Screenshots

| Desktop View ( Befor Emotion Set ) | Desktop View ( After Emotion Set ) |
| :---: | :---: |
| ![Desktop Screenshot](https://github.com/user-attachments/assets/a741f83b-8cd7-4615-b2bb-4214007e91a8) | ![Desktop Screenshot](https://github.com/user-attachments/assets/0ab68c27-60b9-4b81-a01c-236ba1f42331) |

> *Note: Try yourself for better experince.*

## Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

* Node.js (v16 or higher)
* npm or yarn
* A Spotify Developer Account

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/deepakcode21/face-emotion-music-player.git
    cd face-emotion-music-player
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add your Spotify credentials:
    ```env
    VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
    VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
    VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173
    ```
    > **Note:** You can get these keys from the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/). Ensure you add `http://127.0.0.1:5173` to the Redirect URIs in your Spotify App settings.

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```

5.  **Open in Browser**
    Navigate to `http://127.0.0.1:5173` to see the app in action!

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Credits & Acknowledgements

* **Developer:** [Deepak (deepakcode21)](https://github.com/deepakcode21)
* **Dedication:** Dedicated to **Gupta Ji** ❤️ for being the muse behind this creation.
* **APIs:** Thanks to [Spotify for Developers](https://developer.spotify.com/) and [Vincent Mühler](https://github.com/justadudewhohacks/face-api.js/) for the incredible FaceAPI library.

---

<p align="center">
  Built with ❤️ and ☕ by Deepak
</p>
