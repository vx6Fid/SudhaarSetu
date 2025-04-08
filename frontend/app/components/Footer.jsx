import React from "react";

function SocialIcon({ href, children }) {
  return (
    <a 
      href={href} 
      className="
        hover:opacity-80 
        transition-all 
        duration-300 
        hover:-translate-y-1
        p-2
        rounded-full
        hover:bg-white/10
      " 
      aria-label="Social media link"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-[#1a1a1a] to-[#2B2B2B] text-white  pt-16 pb-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Company Info */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold font-[Playfair Display]">
            Sudhaar<span className="text-green-400">Setu</span>
          </h3>
          <p className="text-gray-300">
            Bridging the gap between citizens and municipal services for a cleaner, better community.
          </p>
          <div className="flex gap-4 mt-6">
            <SocialIcon href="#">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </SocialIcon>
            <SocialIcon href="#">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </SocialIcon>
            <SocialIcon href="#">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </SocialIcon>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 uppercase tracking-wider text-gray-300">Quick Links</h3>
          <ul className="space-y-3">
            <li>
              <a href="#" className="hover:text-green-400 transition-colors duration-200">Home</a>
            </li>
            <li>
              <a href="#" className="hover:text-green-400 transition-colors duration-200">About Us</a>
            </li>
            <li>
              <a href="#" className="hover:text-green-400 transition-colors duration-200">Services</a>
            </li>
            <li>
              <a href="#" className="hover:text-green-400 transition-colors duration-200">FAQ</a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-4 uppercase tracking-wider text-gray-300">Support</h3>
          <ul className="space-y-3">
            <li>
              <a href="#" className="hover:text-green-400 transition-colors duration-200">Contact Us</a>
            </li>
            <li>
              <a href="#" className="hover:text-green-400 transition-colors duration-200">Privacy Policy</a>
            </li>
            <li>
              <a href="#" className="hover:text-green-400 transition-colors duration-200">Terms of Service</a>
            </li>
            <li>
              <a href="#" className="hover:text-green-400 transition-colors duration-200">Help Center</a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4 uppercase tracking-wider text-gray-300">Newsletter</h3>
          <p className="text-gray-300 mb-4">Subscribe to our newsletter for the latest updates.</p>
          <form className="flex flex-col space-y-3">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              required
            />
            <button 
              type="submit" 
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="text-center mt-16 pt-8 border-t border-white/10">
        <p className="text-gray-400">
          © {new Date().getFullYear()} SudhaarSetu. All rights reserved.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Made with ❤️ for a better community
        </p>
      </div>
    </footer>
  );
}

export default Footer;