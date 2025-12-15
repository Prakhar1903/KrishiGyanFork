// src/components/Login.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Volume2, VolumeX } from 'lucide-react'; // Added volume icons
import backgroundVideo from '../assets/video.mp4'; // Your video file
import { useLanguage } from '../contexts/LanguageContext.jsx';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Start muted to allow autoplay
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const videoRef = useRef(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Check if mobile for performance optimization
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Try to play video with sound (browser may block this)
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.log("Video autoplay with sound failed, falling back to muted:", e);
          // If autoplay with sound fails, mute and try again
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play();
        });
      }
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden ${isMobile ? 'bg-mobile-fallback' : ''}`}>
      {/* Video Background - Hidden on mobile for performance */}
      {!isMobile && (
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted} // Controlled by state
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={backgroundVideo} type="video/mp4" />
            {/* Fallback image if video doesn't load */}
            <img 
              src="/src/assets/image1.png" 
              alt="Background" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </video>
          
          {/* Dark overlay for better readability */}
          <div className="absolute inset-0 bg-black/50"></div>
          
          {/* Subtle blur effect */}
          <div className="absolute inset-0 backdrop-blur-sm"></div>
          
          {/* Volume Control Button */}
          <button
            onClick={toggleMute}
            onMouseEnter={() => setShowVolumeControl(true)}
            onMouseLeave={() => setShowVolumeControl(false)}
            className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <VolumeX className="h-6 w-6" />
            ) : (
              <Volume2 className="h-6 w-6" />
            )}
            {showVolumeControl && (
              <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 bg-black/80 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap backdrop-blur-sm">
                {isMuted ? "Click to unmute" : "Click to mute"}
              </div>
            )}
          </button>
          
          {/* Audio Info Message (only shows when muted) */}
          {isMuted && (
            <div className="absolute bottom-4 left-4 z-20 bg-black/50 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm animate-pulse">
              <span className="flex items-center gap-2">
                <VolumeX className="h-4 w-4" />
                Video is muted. Click speaker icon to unmute
              </span>
            </div>
          )}
        </div>
      )}

      {/* Mobile fallback background */}
      {isMobile && (
        <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" 
             style={{ backgroundImage: `url(/src/assets/image1.png)` }}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        </div>
      )}

      {/* Login Form */}
      <div className="w-full max-w-md z-10 relative">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-primary-green/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="auth-logo-image mb-4 mx-auto" style={{ width: '80px', height: '80px' }}>
              <img 
                src="/src/assets/agri_logo.jpg" 
                alt="KRISHIGNAN Logo" 
                className="w-full h-full object-cover rounded-full border-4 border-white shadow-md"
              />
            </div>
            <h1 className="text-3xl font-bold text-primary-green mb-2">KRISHIGNAN</h1>
            <p className="text-natural-brown font-medium">FARMING WISDOM</p>
            <p className="text-gray-600 mt-4">{t('signInToYourAccount')}</p>
          </div>

          {error && (
            <div className="bg-red-50/90 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-center backdrop-blur-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder={t('emailPlaceholder')}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-primary-green transition-all duration-200 bg-white/90 focus:bg-white backdrop-blur-sm"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder={t('passwordPlaceholder')}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-primary-green transition-all duration-200 bg-white/90 focus:bg-white backdrop-blur-sm"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-green to-primary-light text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('signingIn')}
                </span>
              ) : t('signIn')}
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-gray-200/50">
            <p className="text-gray-600">
              {t('dontHaveAccount')}{' '}
              <Link 
                to="/register" 
                className="text-primary-green font-semibold hover:underline hover:text-primary-dark transition-colors"
              >
                {t('signUpHere')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;