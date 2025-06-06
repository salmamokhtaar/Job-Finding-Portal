import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login2() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading, isAuthenticated, user } = useAuth()

  const from = location.state?.from?.pathname || '/';

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      let redirectPath = from;

      if (from === '/') {
        switch(user.role) {
          case 'admin':
            redirectPath = '/dashboard';
            break;
          case 'company':
            redirectPath = '/company-dashboard';
            break;
          case 'applicant':
            redirectPath = '/applicant-dashboard';
            break;
          default:
            redirectPath = '/';
        }
      }

      navigate(redirectPath, { replace: true });
    }

    // Check for remembered credentials
    const rememberedUser = localStorage.getItem('rememberedUser')
    if (rememberedUser) {
      const { email: savedEmail } = JSON.parse(rememberedUser)
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [isAuthenticated, user, navigate, from])

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    try {
      const result = await login({ email, password });

      if (result.success) {
        // Handle remember me
        if (rememberMe) {
          localStorage.setItem('rememberedUser', JSON.stringify({ email }));
        } else {
          localStorage.removeItem('rememberedUser');
        }

        // Navigation is handled by the useEffect hook above
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-16 md:py-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <div className="flex items-center justify-center gap-2 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                  viewBox="0 0 29 30" fill="none">
                  <circle cx="12.0143" cy="12.5143" r="12.0143" fill="#2563EB" fillOpacity="0.4" />
                  <circle cx="16.9857" cy="17.4857" r="12.0143" fill="#2563EB" />
                </svg>
                <span className="text-2xl font-bold text-gray-900">CareerHub</span>
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-600">Sign in to access your account</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="form-label">Email address</label>
                <div className="form-input-container">
                  <i className="fas fa-envelope form-input-icon"></i>
                  <input
                    type="email"
                    id="email"
                    className="form-input form-input-with-icon"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="form-label">Password</label>
                  <Link to="/forgot-password" className="text-sm font-medium text-brand-600 hover:text-brand-700">
                    Forgot password?
                  </Link>
                </div>
                <div className="form-input-container">
                  <i className="fas fa-lock form-input-icon"></i>
                  <input
                    type="password"
                    id="password"
                    className="form-input form-input-with-icon"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/signup" className="font-medium text-brand-600 hover:text-brand-700">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="btn btn-outline flex items-center justify-center"
                >
                  <i className="fab fa-google mr-2"></i>
                  Google
                </button>
                <button
                  type="button"
                  className="btn btn-outline flex items-center justify-center"
                >
                  <i className="fab fa-linkedin-in mr-2"></i>
                  LinkedIn
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login2
