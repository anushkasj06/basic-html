import { Link } from 'react-router-dom';
import Chatbot from '../components/Chatbot';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="relative">
      {/* Welcome Message */}
      {user && (
        <div className="max-w-7xl mt-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 transform hover:scale-[1.01] transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                <span className="text-2xl">👋</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Hi, {user.name}!</h1>
                <p className="text-gray-600 mt-1">Welcome back to StudentPredict</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                {/* Left Content */}
                <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block">Predict Student</span>
                    <span className="block text-primary">Performance</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    Leverage the power of machine learning to predict student performance and help them achieve their academic goals.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <Link
                        to={user ? "/quiz" : "/signup"}
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 md:py-4 md:text-lg md:px-10"
                      >
                        {user ? "Take Quiz" : "Get Started"}
                      </Link>
                    </div>
                    {!user && (
                      <div className="mt-3 sm:mt-0 sm:ml-3">
                        <Link
                          to="/login"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20 md:py-4 md:text-lg md:px-10"
                        >
                          Sign In
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Image */}
                <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                  <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                    <div className="relative block w-full overflow-hidden">
                      <img
                        src="/images/hero-image.avif"
                        alt="Student Performance Prediction"
                        className="w-full h-[400px] object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                      {/* Overlay gradient */}
                      
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to predict student performance
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {/* Feature 1 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Data Analysis</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Advanced analytics to understand student performance patterns and trends.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Fast Predictions</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Quick and accurate predictions using state-of-the-art machine learning models.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default Home; 