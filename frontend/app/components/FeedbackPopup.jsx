import { useState } from "react";
import { motion } from "framer-motion";

const FeedbackPopup = ({ user_id, complaintId: initialComplaintId, onClose }) => {
  const [complaintId, setComplaintId] = useState(initialComplaintId || "");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complaintId) {
      alert("Please enter a valid Complaint ID.");
      return;
    }
    setIsSubmitting(true);

    await handleSubmitFeedback({
      complaintId,
      rating,
      user_id,
      feedback: feedbackText,
    });

    setIsSubmitting(false);
    onClose();
  };

  const handleSubmitFeedback = async (feedbackData) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaint/${feedbackData.complaintId}/feedback/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            user_id: feedbackData.user_id,
            rating: feedbackData.rating,
            feedback: feedbackData.feedback,
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to submit feedback");
      }

      alert("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200/60 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative gradient border */}
        <div className="absolute inset-0 rounded-3xl p-[2px] pointer-events-none">
          <div className="absolute inset-0 bg-gray-100 rounded-3xl"></div>
        </div>

        <div className="relative z-10 p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Share Your Feedback
              </h3>
              <p className="text-gray-500 mt-1 flex items-center gap-1">
                Complaint ID: {complaintId}
              </p>
            </div>
            <motion.button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Complaint ID input */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Complaint ID
              </label>
              <input
                type="text"
                value={complaintId}
                onChange={(e) => setComplaintId(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Enter Complaint ID"
                required
              />
            </div>
            {/* Rating Section */}
            <div className="mb-10">
              <label className="block text-gray-700 mb-5 font-medium text-lg">
                How satisfied were you with our resolution?
              </label>
              <div className="flex justify-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative"
                  >
                    <div className="w-14 h-14 flex items-center justify-center">
                      <motion.div
                        animate={{
                          scale:
                            star <= (hoverRating || rating) ? [1, 1.3, 1.1] : 1,
                        }}
                        transition={{ duration: 0.4 }}
                      >
                        {star <= (hoverRating || rating) ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          >
                            <svg
                              className="w-12 h-12 text-yellow-500 drop-shadow-sm"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="currentColor"
                                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                              />
                            </svg>
                          </motion.div>
                        ) : (
                          <svg
                            className="w-12 h-12 text-gray-300"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                            />
                          </svg>
                        )}
                      </motion.div>
                    </div>
                    {star === 5 && (
                      <motion.div
                        className="absolute -right-2 -bottom-2 bg-secondary text-white text-xs font-bold px-2 py-1 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{
                          scale: rating === 5 ? 1 : 0,
                          rotate: rating === 5 ? [0, 10, -10, 0] : 0,
                        }}
                        transition={{ type: "spring" }}
                      >
                        😍
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
              <div className="flex justify-between text-sm text-gray-500 px-2">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                  </svg>
                  Not satisfied
                </span>
                <span className="flex items-center gap-1">
                  Extremely satisfied
                  <svg
                    className="w-4 h-4 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mb-10">
              <label className="block text-gray-700 mb-4 font-medium text-lg">
                Additional comments
                <span className="text-gray-400 font-normal ml-1">
                  (optional)
                </span>
              </label>
              <motion.div
                whileFocus={{ borderColor: "#6366f1" }}
                className="relative"
              >
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-secondary focus:outline-none transition-all resize-none bg-white/70 backdrop-blur-sm"
                  rows="5"
                  placeholder="What went well? What could we improve? Your feedback helps us do better..."
                  maxLength={500}
                />
                <motion.div
                  className="absolute bottom-3 right-3 text-gray-400 text-xs bg-white/80 px-2 py-1 rounded-full"
                  animate={{
                    scale: feedbackText.length > 450 ? [1, 1.05, 1] : 1,
                  }}
                  transition={{
                    repeat: feedbackText.length > 450 ? Infinity : 0,
                    duration: 1.5,
                  }}
                >
                  {500 - feedbackText.length} chars left
                </motion.div>
              </motion.div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.02, backgroundColor: "#f3f4f6" }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-500 transition-all flex items-center gap-2 border border-gray-500"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={rating === 0 || isSubmitting}
                whileHover={{ scale: rating === 0 ? 1 : 1.02 }}
                whileTap={{ scale: rating === 0 ? 1 : 0.98 }}
                className={`px-6 py-3 rounded-xl font-medium text-white transition-all flex items-center gap-2 ${
                  rating === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-primary to-secondary hover:from-primary hover:to-primary shadow-md hover:shadow-lg"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        ease: "linear",
                      }}
                      className="block w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 5l7 7-7 7M5 5l7 7-7 7"
                      />
                    </svg>
                    Submit Feedback
                  </span>
                )}
              </motion.button>
            </div>
          </form>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-accent" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-green-100 rounded-full opacity-20 filter blur-xl" />
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-yellow-100 rounded-full opacity-20 filter blur-xl" />
        <div className="absolute top-1/3 -left-10 w-16 h-16 bg-purple-100 rounded-full opacity-20 filter blur-xl" />
      </motion.div>
    </motion.div>
  );
};

export default FeedbackPopup;
