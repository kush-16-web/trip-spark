# ✈️ Trip Spark: AI-Powered Travel Architect

**Trip Spark** is a premium, full-stack travel planning application that leverages state-of-the-art Generative AI to craft personalized, high-intent itineraries in seconds. Designed with a mobile-first, editorial aesthetic, it simplifies complex travel logistics into beautiful, actionable plans.

---

## 🌟 Key Features

- **🤖 Intelligent Itinerary Generation**: Powered by **Google Gemini Pro**, the app generates detailed, day-by-day travel plans including activities, suggested stays, and budget estimates based on user preferences.
- **🌤️ Live Weather Integration**: Real-time forecast fetching via **Open-Meteo API** to help travelers prepare for actual conditions at their destination.
- **🔐 Secure Authentication**: Integrated with **Firebase Auth** and **Google OAuth** for seamless, secure user onboarding and profile management.
- **📱 Responsive Bento UI**: An asymmetrical, modern "Bento Grid" design that looks stunning on everything from high-res desktops to mobile devices.
- **📁 Personal Travel Vault**: Users can save, manage, and revisit their generated trips through a dedicated "My Trips" dashboard.
- **🔗 Shareable Plans**: Unique sharing IDs for every trip, allowing users to share their AI-generated adventures with friends.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (Custom Design System)
- **Icons/Assets**: Google Fonts (Outfit), Custom Animated GIFs

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod (Schema-first validation)

### Services & APIs
- **LLM**: Google Gemini Pro API (`@google/generative-ai`)
- **Auth**: Firebase Admin SDK
- **Weather**: Open-Meteo Geocoding & Forecast API
- **Deployment**: Configured for Cloudflare Tunneling (Local Dev)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL instance
- Google Gemini API Key
- Firebase Project Credentials

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
   # Create a .env file and add your DATABASE_URL, GEMINI_API_KEY, and FIREBASE_CONFIG
   npx prisma generate
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ..
   npm install
   npm run dev
   ```

---

## 🧠 Why Trip Spark?

Traditional travel planning is fragmented—users jump between maps, weather apps, and blogs. **Trip Spark** consolidates this into a single, cohesive experience. By utilizing LLMs, we don't just search for data; we **synthesize** it into a narrative that respects the user's budget, vibe, and schedule.

---

## 📸 Design Philosophy

The project follows a **"Magazine Editorial"** aesthetic. Unlike standard utility apps, Trip Spark focuses on:
- **Asymmetrical Layouts**: Breaking the 12-column grid for a more dynamic feel.
- **Glassmorphism**: Using backdrop blurs and subtle borders for a premium depth effect.
- **Micro-interactions**: High-frequency feedback on buttons and cards to improve perceived performance.

---

<p align="center">
  Built with ❤️ by the Trip Spark
</p>
