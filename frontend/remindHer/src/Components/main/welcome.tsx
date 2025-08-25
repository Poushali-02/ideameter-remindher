import { Link } from "react-router-dom";

const Welcome: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-50 relative overflow-hidden">
    {/* Background Decorative Elements */}
    <div className="absolute inset-0 overflow-hidden">
      {/* Floating circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-pink-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-300/15 to-pink-300/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-gradient-to-r from-pink-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      
      {/* Gradient mesh overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/5 via-transparent to-purple-500/5"></div>
    </div>
    
    {/* Main Content */}
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
      {/* Logo/Icon Section */}
      <div className="mb-8 relative">
        <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-2xl shadow-pink-500/30 animate-bounce">
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        
        {/* Decorative ring around logo */}
        <div className="absolute -inset-4 border-2 border-pink-200 rounded-full animate-spin opacity-30" style={{ animationDuration: '10s' }}></div>
        <div className="absolute -inset-8 border border-purple-200 rounded-full animate-spin opacity-20" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
      </div>
      
      {/* Main Heading */}
      <div className="mb-8">
        <h1 className="text-7xl md:text-8xl lg:text-9xl font-black mb-4 leading-tight">
          <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-pink-700 bg-clip-text text-transparent drop-shadow-sm">
            RemindHer
          </span>
        </h1>
        
        {/* Animated underline */}
        <div className="w-32 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full shadow-lg animate-pulse"></div>
      </div>
      
      {/* Subtitle with enhanced styling */}
      <div className="mb-12 max-w-4xl">
        <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-700 mb-4 leading-relaxed">
          Your Personal{' '}
          <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Women's Health
          </span>{' '}
          Companion
        </p>
        <p className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
          Track your PCOD symptoms, monitor menstruation regularity, and explore educational content on women's health in one beautifully designed place.
        </p>
      </div>
      
      {/* Feature highlights */}
      <div className="mb-12 flex flex-wrap justify-center gap-6 text-sm md:text-base">
        <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-pink-100">
          <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
          <span className="text-gray-700 font-medium">PCOD Tracking</span>
        </div>
        <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-purple-100">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-gray-700 font-medium">Cycle Monitoring</span>
        </div>
        <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-pink-100">
          <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
          <span className="text-gray-700 font-medium">Health Education</span>
        </div>
      </div>
      
      {/* CTA Button with enhanced design */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
        <Link to="/education">
          <button className="relative px-12 py-5 bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600 text-white text-xl md:text-2xl font-bold rounded-full shadow-2xl hover:shadow-pink-500/30 transform hover:scale-105 transition-all duration-300 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-pink-300/50">
            <span className="flex items-center gap-3">
              Get Started
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            </span>
        </button>
      </Link>
      </div>
      
      {/* Trust indicators */}
      <div className="mt-16 flex items-center justify-center gap-8 text-xs text-gray-500 opacity-70">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Privacy Protected</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Medically Reviewed</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          <span>Easy to Use</span>
        </div>
      </div>
    </div>
    
    {/* Floating particles animation */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-40" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-30" style={{ animationDelay: '3s' }}></div>
      <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-300 rounded-full animate-ping opacity-35" style={{ animationDelay: '5s' }}></div>
      <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-purple-300 rounded-full animate-ping opacity-25" style={{ animationDelay: '7s' }}></div>
    </div>
  </div>
);

export default Welcome;
