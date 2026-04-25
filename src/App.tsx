import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import TripForm from './components/TripForm'
import Destinations from './components/Destinations'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <TripForm />
      <Destinations />
      <Footer />
    </main>
  )
}

export default App
