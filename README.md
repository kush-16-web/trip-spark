# Trip Spark AI ✈️✨

**Trip Spark AI** is a premium, full-stack AI Travel Planner designed to transform vague travel ideas into detailed, interactive itineraries. It features a professional **Itinerary Studio** with side-by-side map synchronization, real-time financial tracking, and intelligent AI-powered refinement.

## 🚀 Key Features

### 🧠 AI-Driven Itinerary Generation
- **Intelligent Planning**: Leverages Large Language Models (Gemini AI) to generate personalized multi-day trips based on destination, traveler type, and duration.
- **Itinerary Studio**: A sophisticated, side-by-side editing interface allowing users to refine AI-generated days, add activities, and adjust schedules in real-time.

### 🗺️ Advanced Map Studio (Mapbox GL)
- **Interactive Synchronization**: Real-time "Fly-To" animations that link itinerary activities directly to map locations.
- **Numbered Route Visualization**: Dynamic polyline rendering with numbered steps (1 → 2 → 3) to visualize the flow of each travel day.
- **Pro Satellite View**: High-resolution satellite imagery toggle allowing users to explore street-level details (Level 20 zoom) of their destinations.

### 🏨 Premium Hotel Intelligence (Google Places)
- **Live Details**: Real-time fetching of hotel ratings, reviews, and addresses using the Google Places API.
- **Visual Excellence**: Professional hotel photo integration via secure backend proxying.
- **Smart Caching Layer**: Custom-built PostgreSQL caching system using Prisma to store hotel data, reducing API latency and costs by up to 90%.

### 🔍 Destination Autocomplete
- **Global Search**: High-precision location autocomplete for cities and regions worldwide.
- **Premium UX**: Modern, icon-rich search dropdown with main character energy and smooth Framer Motion transitions.

### 💰 Financial Intelligence & Currency
- **Live Exchange Rates**: Integrated custom API service to fetch real-time exchange rates (e.g., INR to JPY).
- **Dynamic Conversion**: Instant UI-wide currency toggling between base (INR) and local destination currencies.
- **Budget Breakdown**: Intelligent categorization of travel costs including Stays, Food, Transport, and Activities.

### ☁️ Cloud & Persistence
- **Full-Stack Integration**: Robust Node.js/Express backend with a PostgreSQL database (Prisma ORM) for persistent trip storage.
- **Firebase Auth**: Secure Google Authentication integration for personalized trip dashboards and sharing.
- **PDF Export**: One-click professional itinerary export using high-quality PDF generation.

## 🛠️ Tech Stack

**Frontend:**
- React 18 (TypeScript)
- Vite (Build Tool)
- Tailwind CSS (Premium Styling)
- Framer Motion (Modern Animations)
- Mapbox GL (Interactive Geospatial Data)
- Firebase SDK (Authentication)

**Backend:**
- Node.js & Express
- TypeScript
- Prisma ORM (PostgreSQL)
- Google Gemini AI (Itinerary Generation)
- Open-Meteo API (Weather Synchronization)

---

## 📸 Technical Highlights for Resume

- **Geospatial Sync**: Implemented complex state management to synchronize a scrolling activity list with a sticky Mapbox instance using React refs and effects.
- **API Optimization**: Engineered a custom backend caching layer for currency exchange rates and weather data to reduce external API latency.
- **Data Architecture**: Designed a nested JSON schema for flexible AI responses, ensuring high data integrity across the Itinerary Studio.
- **UX/UI Excellence**: Developed a mobile-first, glassmorphism-inspired design system focused on high-end user engagement and smooth micro-interactions.

---

*Developed with ❤️ by [Your Name]*
