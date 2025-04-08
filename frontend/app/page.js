import HeroCarousel from "./components/HeroCarousel";
import KeyFeaturesCarousel from "./components/KeyFeautresCarousel";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <HeroCarousel />

      {/* How SudhaarSetu Works*/}
      <div className="px-4 py-20 md:py-28 bg-gradient-to-br from-gray-50 to-background relative overflow-hidden mt-10">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/30 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-accent/20 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              How{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                SudhaarSetu
              </span>{" "}
              Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transforming civic issue resolution with a simple, transparent
              3-step process
            </p>
          </div>

          {/* Process timeline */}
          <div className="relative">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Step 1 */}
              <div className="group relative">
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/30 z-10">
                  1
                </div>
                <div className="pt-16 pb-8 px-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full border-t-4 border-primary">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-primary/10 rounded-xl">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-center text-gray-900 mb-3">
                    Report the Issue
                  </h3>
                  <p className="text-gray-600 text-center">
                    Easily report municipal issues with photos, location
                    pinning, and category selection through our user-friendly
                    app.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group relative lg:mt-16">
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-accent/30 z-10">
                  2
                </div>
                <div className="pt-16 pb-8 px-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full border-t-4 border-accent">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-accent/10 rounded-xl">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-center text-gray-900 mb-3">
                    Smart Routing
                  </h3>
                  <p className="text-gray-600 text-center">
                    Our AI-powered system instantly assigns your complaint to
                    the right department with real-time tracking updates.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group relative lg:mt-32">
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-secondary/30 z-10">
                  3
                </div>
                <div className="pt-16 pb-8 px-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full border-t-4 border-secondary">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-secondary/10 rounded-xl">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-secondary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-center text-gray-900 mb-3">
                    Resolution & Feedback
                  </h3>
                  <p className="text-gray-600 text-center">
                    Get notified when resolved and provide feedback. Your
                    ratings help improve municipal services for everyone.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional features */}
          <div className="mt-24 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 border-l-8 border-primary bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-lg font-medium text-gray-800">
                  24/7 Availability
                </span>
              </div>
            </div>
            <div className="p-6 border-l-8 border-accent bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <span className="text-lg font-medium text-gray-800">
                  Verified Resolutions
                </span>
              </div>
            </div>
            <div className="p-6 border-l-8 border-secondary bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-secondary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <span className="text-lg font-medium text-gray-800">
                  Fast Response
                </span>
              </div>
            </div>
            <div className="p-6 border-l-8 border-text bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                    />
                  </svg>
                </div>
                <span className="text-lg font-medium text-gray-800">
                  Dashboard Analytics
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      {/* Key Features Section */}
      <div className="bg-[#f3e8dc] relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated circles */}
          <div className="floating-element absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-[#f8d7b6] opacity-50"></div>
          <div className="floating-element-2 absolute top-2/3 right-1/4 w-40 h-40 rounded-full bg-[#f8d7b6] opacity-30"></div>
          <div className="floating-element-3 absolute bottom-1/4 right-1/3 w-24 h-24 rounded-full bg-[#f8d7b6] opacity-40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <KeyFeaturesCarousel />
        </div>
      </div>
    </div>
  );
}
