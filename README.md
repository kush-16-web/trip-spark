# ✈️ TripSpark AI | Premium Travel Itinerary Studio

**TripSpark AI** is a high-fidelity, full-stack travel planning application that transforms vague travel ideas into detailed, interactive itineraries. Powered by **Google Gemini 1.5 Pro**, it handles complex logistics, real-time weather forecasting, and interactive mapping to create a seamless "Editorial-Grade" travel experience.

---

## ✨ Key Features

### 🧠 AI-Powered Itinerary Studio
Leverages the **Gemini 1.5 Pro** model to generate logically structured, day-wise itineraries based on user preferences, budget, and travel dates.

### 🗺️ Interactive Geospatial Mapping
Integrated with **Google Maps JavaScript API**, featuring custom numbered markers, satellite toggles, and dynamic pathfinding to visualize the travel journey.

### ⛅ Real-time Weather Insights
Automated weather forecasting for the travel dates using the **Open-Meteo API**, ensuring travelers are prepared for the conditions on the ground.

### 📓 Editorial Travel Journal
A premium **My Trips** dashboard featuring staggered animations, glassmorphic design, and persistent storage of personal travel collections.

### 📱 Responsive & Fluid UX
Built with a mobile-first philosophy, utilizing **Framer Motion** for smooth layout transitions and context-aware navigation logic.

---

## 🛠️ Technical Stack

- **Frontend**: React 18, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express, PostgreSQL
- **AI Engine**: Google Gemini 1.5 Pro (via Google AI SDK)
- **APIs**: Google Maps (JavaScript, Places), Open-Meteo API
- **Deployment Ready**: Fully configured for Vercel/Netlify and Render/Heroku

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- Google AI (Gemini) API Key
- Google Maps API Key

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/kush-16-web/trip-spark.git

# Install Frontend dependencies
npm install

# Install Backend dependencies
cd server
npm install
```

### 3. Environment Setup
Create a `.env` file in both the root and `server/` directories.

**Root `.env`:**
```env
VITE_GOOGLE_MAPS_API_KEY=your_key
VITE_API_BASE_URL=http://localhost:5000
```

**Server `.env`:**
```env
DATABASE_URL=your_postgres_url
GEMINI_API_KEY=your_gemini_key
PORT=5000
```

---

## 📐 Architecture

TripSpark follows a modular **Proxy Architecture**. The frontend communicates with a specialized Express server which handles:
1.  **AI Prompt Engineering**: Structured JSON output from Gemini.
2.  **Weather Synchronization**: Mapping dates to forecast windows.
3.  **Data Persistence**: Efficient CRUD operations on PostgreSQL.

---

## 👨‍💻 Author
**Kush Pandya**
- [GitHub](https://github.com/kush-16-web)
- [LinkedIn](https://www.linkedin.com/in/kush-pandya-6544a6352)

---

> [!TIP]
> **Showcase Tip**: This project was built to demonstrate the integration of Generative AI with real-world geospatial and weather data. It prioritizes "Defensive UX" and premium aesthetic standards.
