import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaTwitter, FaLinkedin, FaGithub, FaShieldAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-sports-navy text-gray-400 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-wider text-white">
              <FaTrophy className="text-sports-blueLight" />
              <span>FIFA2026<span className="text-sports-blueLight font-light">STADIUM</span></span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering stadium managers and tournament organizers with GenAI solutions to create a world-class fan experience.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn"><FaLinkedin /></a>
              <a href="#" className="hover:text-white transition-colors" aria-label="GitHub"><FaGithub /></a>
            </div>
          </div>

          {/* Solutions Column */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Operations</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/heatmap" className="hover:text-white transition-colors">Crowd Heatmap</Link></li>
              <li><Link to="/queues" className="hover:text-white transition-colors">Smart Queue Prediction</Link></li>
              <li><Link to="/emergency" className="hover:text-white transition-colors">Emergency Command</Link></li>
              <li><Link to="/transport" className="hover:text-white transition-colors">Transport & Parking</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Fan Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/assistant" className="hover:text-white transition-colors">AI Stadium Assistant</Link></li>
              <li><Link to="/companion" className="hover:text-white transition-colors">AI Match Companion</Link></li>
              <li><Link to="/sustainability" className="hover:text-white transition-colors">Green Arena Deck</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Help Contact Form</Link></li>
            </ul>
          </div>

          {/* Compliance Column */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Security</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <FaShieldAlt className="text-sports-blueLight" />
                <span>Enterprise Shield Certified</span>
              </div>
              <p className="text-xs leading-relaxed text-gray-500">
                All communications and telemetry updates are verified with end-to-end encryption protocols in alignment with standard stadium operations.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>&copy; 2026 FIFA Smart Stadium Operations. All rights reserved. Handcrafted by FIFA Tournament Technology Consultants.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Security Disclosures</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
