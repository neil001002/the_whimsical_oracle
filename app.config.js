module.exports = {
  name: "The Whimsical Oracle",
  slug: "whimsical-oracle",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "whimsical-oracle",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#0F0F23"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#0F0F23"
    }
  },
  web: {
    bundler: "metro",
    output: "server",
    favicon: "./assets/images/favicon.png"
  },
  plugins: [
    "expo-router",
    "expo-font"
  ],
  experiments: {
    typedRoutes: true
  }
};