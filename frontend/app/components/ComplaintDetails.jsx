"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiPhone, FiClock, FiMapPin, FiHome, FiFlag, FiCheckCircle, FiAlertCircle, FiMessageSquare, FiSend } from "react-icons/fi";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Define the pin icon
const pinIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2776/2776067.png",
  iconSize: [32, 32],
  iconAnchor: [16, 42],
  popupAnchor: [0, -42],
});

export default function ComplaintDetailsCard({ complaint }) {
  const [comments, setComments] = useState([]);
  const [officer, setOfficer] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [mapReady, setMapReady] = useState(false);

  // Fix for Next.js SSR issue with Leaflet
  useEffect(() => {
    setMapReady(true);
  }, []);

  if (!complaint) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-600 font-semibold p-4 bg-red-50 rounded-lg">
          Complaint data not available.
        </div>
      </div>
    );
  }

  // Fetch Officer Details and Comments
  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaint/${complaint.id}/comments`
        );
        if (!res.ok) throw new Error("Failed to fetch comments");
        
        const data = await res.json();
        setComments(data.comments || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch comments");
      }
    }

    async function fetchOfficer() {
      if (!complaint.field_officer_id) return;
      
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user?user_id=${complaint.field_officer_id}&role=officer`
        );
        if (!res.ok) throw new Error("Failed to fetch officer details");
        
        const data = await res.json();
        setOfficer(data.user);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch officer details");
      }      
    }

    fetchOfficer();
    fetchDetails();
  }, [complaint.id, complaint.field_officer_id]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("user-name");
    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints/${complaint.id}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            comment_text: newComment,
            userName: userName,
          }),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        setComments([...comments, responseData.comment]);
        setNewComment("");
        toast.success("Comment added successfully");
      } else {
        console.error(
          "Failed to add comment:",
          responseData.error || responseData
        );
        toast.error(responseData.error || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Error adding comment");
    }
  };

  const {
    category,
    status,
    location,
    image,
    ward_no,
    city,
    State,
    org_name,
    created_at,
    officer_name,
  } = complaint;

  // Parse location coordinates
  const locationCoords = location.split(",").map(Number);

  return (
    <div className="max-w-4xl mx-auto bg-background rounded-xl shadow-md overflow-hidden border border-primary/20">
      {/* Header with Status */}
      <div className={`p-6 ${status === "resolved" ? "bg-secondary/10" : "bg-accent/10"} border-b border-primary/20`}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-text">Complaint Details</h1>
            <div className="flex items-center mt-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                status === "resolved" 
                  ? "bg-secondary/20 text-secondary-dark" 
                  : "bg-accent/20 text-accent-dark"
              }`}>
                {status === "resolved" ? (
                  <FiCheckCircle className="mr-1" />
                ) : (
                  <FiAlertCircle className="mr-1" />
                )}
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
              <span className="ml-3 text-text/80">
                <FiClock className="inline mr-1" />
                {new Date(created_at).toLocaleString()}
              </span>
            </div>
          </div>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            #{complaint.id}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Complaint Image */}
        {image && (
          <div className="rounded-lg overflow-hidden border border-primary/20">
            <img
              src={image}
              alt="Complaint evidence"
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* Map Section */}
        {mapReady && (
          <div className="rounded-lg overflow-hidden border border-primary/20">
            <MapContainer
              center={locationCoords}
              zoom={15}
              scrollWheelZoom={false}
              className="w-full h-[300px]"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={locationCoords} icon={pinIcon}>
                <Popup className="font-medium">
                  {category} reported here
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {/* Complaint Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-primary/10 p-3 rounded-lg mr-4">
                <FiFlag className="text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-text/70">Category</h3>
                <p className="text-lg font-semibold text-text">{category}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-secondary/10 p-3 rounded-lg mr-4">
                <FiMapPin className="text-secondary" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-text/70">Location</h3>
                <p className="text-lg font-semibold text-text">{location}</p>
                <p className="text-text/80">
                  Ward {ward_no}, {city}, {State}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-accent/10 p-3 rounded-lg mr-4">
                <FiHome className="text-accent" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-text/70">Organization</h3>
                <p className="text-lg font-semibold text-text">{org_name}</p>
              </div>
            </div>

            {officer && (
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-lg mr-4">
                  <FiUser className="text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-text/70">Assigned Officer</h3>
                  <p className="text-lg font-semibold text-text">{officer_name || officer.name}</p>
                  <div className="mt-2 space-y-1">
                    <p className="flex items-center text-text/80 text-sm">
                      <FiMail className="mr-2" /> {officer.email || "N/A"}
                    </p>
                    <p className="flex items-center text-text/80 text-sm">
                      <FiPhone className="mr-2" /> {officer.phone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t border-primary/20 pt-6">
          <h3 className="text-xl font-semibold text-text mb-4 flex items-center">
            <FiMessageSquare className="mr-2" />
            Comments ({comments.length})
          </h3>
          
          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add your comment..."
                className="flex-grow px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary-dark transition-colors flex items-center"
              >
                <FiSend className="mr-1" />
                Post
              </button>
            </div>
          </form>

          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment, i) => (
                <div key={i} className="bg-background p-4 rounded-lg border border-primary/10">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-text">
                      {comment.user_name || "Anonymous"}
                    </span>
                    <span className="text-sm text-text/70">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-text/90">{comment.comment_text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-background rounded-lg border border-primary/10">
              <p className="text-text/70">No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}