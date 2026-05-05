# ✈️ Trip Spark: AI-Powered Travel Architect

**Trip Spark** is a premium, full-stack travel planning application that leverages state-of-the-art Generative AI to craft personalized, high-intent itineraries in seconds. Designed with a mobile-first, editorial aesthetic, it transforms complex travel logistics into beautiful, actionable plans.

---

## 🌟 Key Features

- **🎨 AI Itinerary Studio**: A powerful, "Human-in-the-loop" editor that allows users to refine, add, or modify trip activities in real-time with AI assistance.
- **🗺️ Interactive Map Intelligence**: Integrated **Mapbox GL** visuals featuring interactive markers for stays and spots, alongside dynamic route polylines that visualize your daily journey.
- **🤖 Intelligent Generation**: Powered by **Google Gemini Pro**, generating cohesive day-by-day travel plans, curated "Must Visit" spots, and optimized hotel suggestions.
- **🌤️ Live Weather Synchronization**: Real-time forecast fetching via **Open-Meteo API**, synced precisely with your trip dates and destination.
- **📊 Smart Budgeting**: Comprehensive cost breakdowns and automated budget estimates categorized by stay, food, transport, and activities.
- **🔐 Secure Travel Vault**: Persistent trip storage using **PostgreSQL** and **Prisma**, secured by **Firebase Google OAuth**.
- **📱 Responsive Bento UI**: A state-of-the-art asymmetrical "Bento Grid" design optimized for an elite experience on both desktop and mobile.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Latest) with TypeScript
- **Mapping**: React-Map-GL (Mapbox)
- **Animation**: Framer Motion
- **Build Tool**: Vite
- **Styling**: Vanilla CSS & Tailwind (Custom Design System)

### Backend
- **Runtime**: Node.js (Express.js)
- **Database**: PostgreSQL (Prisma ORM)
- **AI Integration**: Google Generative AI (Gemini Pro)
- **Validation**: Zod (Schema-first)

### Services & Infrastructure
- **Auth**: Firebase Admin SDK (Google OAuth)
- **Geocoding**: Open-Meteo & Mapbox
- **Persistence**: High-performance PostgreSQL relational storage

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL instance
- Google Gemini API Key
- Firebase Project Credentials
- Mapbox Public Token

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/trip-spark.git
   cd trip-spark
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   # Add DATABASE_URL, GEMINI_API_KEY, and FIREBASE_CONFIG to .env
   npx prisma generate
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ..
   npm install
   # Add VITE_MAPBOX_TOKEN to .env
   npm run dev
   ```

---

## 🧠 The "Studio" Philosophy

Unlike standard trip planners that provide static text, **Trip Spark** treats travel planning as an iterative process. Our **Itinerary Studio** allows users to collaborate with AI—modifying specific days, adding custom notes, and watching their map update in real-time as they craft their perfect adventure.

---

## 📸 Design Philosophy

The project follows a **"Magazine Editorial"** aesthetic:
- **Asymmetrical Layouts**: Dynamic visuals that break traditional grid constraints.
- **Glassmorphism**: Backdrop blurs and subtle borders for premium depth.
- **Micro-interactions**: High-frequency feedback on every click to ensure the app feels alive.

---

<p align="center">
  Stop scrolling, start packing. The AI has it from here.<br/>
  <b>Built by [Kush Pandya]</b> • <a href="https://www.linkedin.com/in/kush-pandya-6544a6352?utm_source=share_via&utm_content=profile&utm_medium=member_android">LinkedIn</a>
</p>

