import { Outlet, useLocation } from "react-router-dom"
import { useEffect } from "react"
import Navbar from "./Components/Navbar"
import Footer from "./Components/Footer"
import "./Components/custom.css"

function App() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App
