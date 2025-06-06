import { Outlet, useLocation } from "react-router-dom"
import { useEffect } from "react"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from "./Components/Navbar"
import Footer from "./Components/Footer"
import { AuthProvider } from './contexts/AuthContext'

function App() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20">
          <Outlet />
        </main>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </AuthProvider>
  )
}

export default App
