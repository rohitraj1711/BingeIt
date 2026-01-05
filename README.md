# Binge It 🎬

> **Your ultimate streaming companion.**
> Discover trending movies, explore popular hits, and track what you want to watch next.

<p align="center">
  <img src="assets/logo.svg" alt="Binge It Logo" width="120" />
</p>

## ✨ Features

- **🔥 Trending Content**: Stay updated with the latest trending movies and TV shows from around the world.
- **🎬 Popular & Top Rated**: Browse curated lists of popular and critically acclaimed content.
- **🔐 Secure Authentication**: Seamless login and signup experience powered by **Firebase Auth**.
- **🔍 Smart Search**: (Coming Soon) Find your favorite movies and actors instantly.
- **📱 Modern Dark UI**: A sleek, immersive dark-themed interface built for entertainment lovers.
- **⚡ Smooth Performance**: Powered by **React Native Reanimated** for 60fps animations.

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) (v0.75) + [TypeScript](https://www.typescriptlang.org/)
- **Navigation**: [React Navigation v7](https://reactnavigation.org/) (Native Stack & Bottom Tabs)
- **Backend / Auth**: [Firebase](https://firebase.google.com/) (v12)
- **Data Source**: [The Movie Database (TMDB) API](https://www.themoviedb.org/)
- **State Management**: React Hooks & Context API
- **UI Components**: 
  - `react-native-vector-icons`
  - `react-native-safe-area-context`
  - `react-native-screens`
- **Animations**: `react-native-reanimated`
- **Gestures**: `react-native-gesture-handler`

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 18)
- JDK 17
- Android Studio / Android SDK

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rohitraj1711/BingeIt.git
   cd BingeIt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   - Ensure your Android Emulator is running.
   - Verify `android/local.properties` points to your Android SDK.

4. **Run the App**
   ```bash
   # Start Metro Bundler
   npm start -- --reset-cache

   # Build for Android
   npm run android
   ```

## 📸 Screenshots

| Landing Page | Home Screen | Movie Details |
|:---:|:---:|:---:|
| <!-- Add Screenshot Here --> | <!-- Add Screenshot Here --> | <!-- Add Screenshot Here --> |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
