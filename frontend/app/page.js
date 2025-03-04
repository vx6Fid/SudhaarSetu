import HeroCarousel from "./components/HeroCarousel";
import KeyFeaturesCarousel from "./components/KeyFeautresCarousel";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <HeroCarousel />

      {/* How SudhaarSetu Works */}
      <div className="flex flex-col md:flex-row items-center justify-between px-8 py-16 mt-0 bg-background">
        {/* Left Side: Large Text Box */}
        <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          <h2 className="text-4xl font-bold text-primary">
            How SudhaarSetu Works
          </h2>
          <p className="text-lg text-secondary mt-2">
            A simple 3-step process to report and resolve municipal issues
            quickly.
          </p>
        </div>

        {/* Right Side: Steps in a Vertical List */}
        <div className="md:w-1/2 flex flex-col space-y-6">
          {/* Step 1 */}
          <div className="flex items-center space-x-4 p-4 bg-white shadow-lg rounded-2xl">
            <div className="w-12 h-12 flex items-center justify-center bg-primary text-white font-bold rounded-full">
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary">
                Report the Issue
              </h3>
              <p className="text-secondary text-sm">
                Quickly report municipal issues with an image and location.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-center space-x-4 p-4 bg-white shadow-lg rounded-2xl">
            <div className="w-12 h-12 flex items-center justify-center bg-accent text-white font-bold rounded-full">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold text-accent">
                Auto-Assign & Track
              </h3>
              <p className="text-secondary text-sm">
                The system auto-assigns complaints, allowing real-time tracking.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-center space-x-4 p-4 bg-white shadow-lg rounded-2xl">
            <div className="w-12 h-12 flex items-center justify-center bg-secondary text-white font-bold rounded-full">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold text-secondary">
                Resolve & Feedback
              </h3>
              <p className="text-secondary text-sm">
                The officer resolves the issue, and citizens can provide
                feedback.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="py-2 px-3 mb-2 text-center bg-primary mx-4 rounded-xl">
        <p className="text-white font-bold text-2xl py-3">Key Features</p>
      </div>
      <KeyFeaturesCarousel />
    </div>
  );
}
