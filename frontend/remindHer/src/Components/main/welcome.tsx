
const Welcome: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-300 via-pink-200 to-purple-200 text-pink-900 px-6 text-center">
    <h1 className="text-6xl md:text-7xl font-extrabold mb-8 drop-shadow-2xl tracking-tight bg-gradient-to-r from-pink-700 via-pink-600 to-purple-400 bg-clip-text text-transparent">
      Welcome to Your Menstrual Health Tracker
    </h1>
    <p className="text-2xl max-w-2xl mb-10 drop-shadow-lg font-medium text-pink-800/90">
      Track your PCOD symptoms, monitor menstruation regularity, and explore educational content on women's health in one place.
    </p>
    <button className="px-10 py-4 rounded-full text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-400 hover:from-pink-700 hover:to-purple-500 focus:ring-4 focus:ring-pink-300 transition-all duration-300 shadow-xl text-xl font-bold drop-shadow-lg">
      Get Started
    </button>
  </div>
);

export default Welcome;
