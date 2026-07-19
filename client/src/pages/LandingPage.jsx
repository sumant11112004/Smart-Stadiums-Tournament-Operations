import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChevronDown, FaRobot, FaUsers, FaClock, FaExclamationTriangle, FaLeaf, FaCompass, FaChevronRight, FaTrophy } from 'react-icons/fa';
import CountdownTimer from '../components/CountdownTimer';

const LandingPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const stats = [
    { value: '85,000+', label: 'Peak Capacity Managed' },
    { value: '< 4 Mins', label: 'Average Security Wait' },
    { value: '98.2%', label: 'AI Assistance Accuracy' },
    { value: '-30%', label: 'Carbon Emissions Reduction' }
  ];

  const coreFeatures = [
    {
      icon: FaRobot,
      title: 'AI Stadium Assistant',
      desc: 'Get immediate directions to the nearest restrooms, parking exits, handicap access routes, and less-crowded food stalls.',
      link: '/assistant'
    },
    {
      icon: FaUsers,
      title: 'Crowd Heatmap Telemetry',
      desc: 'Visualize spectator congestion across major concourses, access gates, and exit sectors in real time to avoid bottlenecks.',
      link: '/heatmap'
    },
    {
      icon: FaClock,
      title: 'Smart Queue Prediction',
      desc: 'Predict queue wait-times before you stand in line for food, stadium apparel, or terminal checkpoints using predictive AI.',
      link: '/queues'
    },
    {
      icon: FaExclamationTriangle,
      title: 'Emergency Safety Panel',
      desc: 'Simulate and manage active critical alerts. Evacuate with ease using automatically generated navigation pathways.',
      link: '/emergency'
    },
    {
      icon: FaCompass,
      title: 'AI Match Companion',
      desc: 'Unclear on offside rules, match formations, or public transit timetables? Ask our Gemini match companion.',
      link: '/companion'
    },
    {
      icon: FaLeaf,
      title: 'Green Deck Dashboard',
      desc: 'Explore real-time carbon offsets, power, water, and trash recycling logs alongside AI-powered eco-optimization advice.',
      link: '/sustainability'
    }
  ];

  const faqs = [
    {
      q: 'How does the AI Stadium Assistant locate my seat?',
      a: 'By inputting your gate name or section in the chatbot, the assistant references the stadium blueprint and real-time crowd logs to direct you through the clearest walkways.'
    },
    {
      q: 'Is my data secure when using the Smart Stadium application?',
      a: 'Absolutely. The platform enforces security standards using JWT session verification, Helmet protection, input sanitization, and does not store credentials in client states.'
    },
    {
      q: 'Are the queue predictions based on real data?',
      a: 'Yes, queue predictions combine current gate sensor telemetry with historical match-day entry logs to forecast check-in wait times.'
    },
    {
      q: 'How do stadium operators coordinate emergency evacuations?',
      a: 'The Emergency Command Panel generates safe evacuation paths away from active incidents, alerting responders and routing spectators to clear gates.'
    }
  ];

  return (
    <div className="bg-sports-grayBg">
      {/* Hero Section with large photography */}
      <div 
        className="relative h-[650px] bg-cover bg-center flex items-center justify-center"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(10, 25, 47, 0.9) 0%, rgba(10, 25, 47, 0.7) 60%, rgba(243, 244, 246, 1) 100%), url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1920&q=80')` 
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full z-10 text-center grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 text-left space-y-6">
            <motion.span 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-sports-blueLight/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sports-blueLight border border-sports-blueLight/30"
            >
              <FaTrophy /> FIFA World Cup 2026 Innovation
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight font-display"
            >
              Smart Stadiums & <br />
              <span className="text-sports-blueLight">Tournament Operations</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-300 leading-relaxed max-w-2xl font-light"
            >
              Maximize visitor safety, reduce queue delays, and streamline stadium operations with real-time crowd telemetry and Google Gemini GenAI assistance.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Link 
                to="/assistant" 
                className="rounded-lg bg-sports-blue px-6 py-3 font-semibold text-white hover:bg-sports-blueLight transition-all shadow-premium hover:shadow-premiumHover flex items-center gap-2"
              >
                <span>AI Assistant</span>
                <FaChevronRight className="text-xs" />
              </Link>
              <Link 
                to="/heatmap" 
                className="rounded-lg bg-white/15 backdrop-blur-sm border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/25 transition-all"
              >
                Live Heatmap
              </Link>
            </motion.div>
          </div>
          
          <div className="lg:col-span-5 flex justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-full max-w-sm"
            >
              <CountdownTimer />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Animated Stats Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white rounded-2xl p-8 shadow-premium border border-slate-100">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center border-r border-slate-100 last:border-0 px-2">
              <span className="block text-3xl sm:text-4xl font-extrabold text-sports-navy tracking-tight">{stat.value}</span>
              <span className="mt-1 block text-xs font-semibold text-sports-muted uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Problem & Solution Showcase */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sports-blue">Challenges</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-sports-navy text-left">The Chaos of Match Days</h2>
            <p className="mt-4 text-base text-sports-muted leading-relaxed">
              Managing 80,000+ passionate football fans inside a stadium introduces critical operational hurdles. Congested access gates lead to spectator frustration. Extended queues at concession stalls reduce sales and fan enjoyment. 
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex gap-3 items-start">
                <span className="rounded bg-red-100 text-sports-danger p-1 mt-0.5"><FaExclamationTriangle className="text-sm" /></span>
                <div>
                  <h4 className="font-semibold text-sports-navy text-sm">Access Bottlenecks</h4>
                  <p className="text-xs text-sports-muted">Gates experience imbalanced crowds, resulting in security delays.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="rounded bg-red-100 text-sports-danger p-1 mt-0.5"><FaClock className="text-sm" /></span>
                <div>
                  <h4 className="font-semibold text-sports-navy text-sm">Long Wait Times</h4>
                  <p className="text-xs text-sports-muted">Food, water, and restroom queues spike during pre-match and half-time.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-premium border border-slate-100 h-80 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80')` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-sports-navy via-sports-navy/40 to-transparent flex flex-col justify-end p-8 text-white">
              <span className="text-xs font-bold tracking-wider text-sports-blueLight uppercase mb-1">Our Mission</span>
              <h3 className="text-xl font-bold">Seamless Fan Navigation</h3>
              <p className="mt-2 text-xs text-gray-300 font-light leading-relaxed">
                By integrating AI technology with stadium sensors, we guide fans dynamically, optimizing movement and ensuring emergency procedures are actionable.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Features Grid */}
      <div className="bg-slate-900 text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-sports-blueLight">GenAI Intelligence Suite</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">GenAI Powered Stadium Operations</h2>
          <p className="mt-4 text-sm text-slate-400 max-w-2xl mx-auto font-light">
            Our modular AI layer connects standard tournament databases with Google Gemini to offer predictive solutions for spectator queries, route guides, and environmental telemetry.
          </p>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
          >
            {coreFeatures.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <motion.div 
                  key={idx}
                  variants={itemVariants}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-6 text-left hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="rounded-lg bg-sports-blue/20 text-sports-blueLight w-12 h-12 flex items-center justify-center border border-sports-blue/30 mb-4">
                      <IconComp className="text-lg" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                    <p className="mt-2 text-xs text-slate-400 leading-relaxed font-light">{feat.desc}</p>
                  </div>
                  <Link to={feat.link} className="mt-6 text-xs font-semibold text-sports-blueLight hover:text-white flex items-center gap-1 transition-colors">
                    <span>Access Dashboard</span>
                    <FaChevronRight className="text-[8px]" />
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-sports-navy text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-lg bg-white border border-slate-100 shadow-premium overflow-hidden">
              <button
                onClick={() => toggleFaq(index)}
                className="flex w-full items-center justify-between px-6 py-4 text-left font-semibold text-sports-navy hover:bg-slate-50 transition-colors"
              >
                <span>{faq.q}</span>
                <FaChevronDown className={`h-3 w-3 text-sports-muted transition-transform duration-200 ${activeFaq === index ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === index && (
                <div className="px-6 pb-4 text-xs leading-relaxed text-sports-muted border-t border-slate-50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Newsletter Banner */}
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl gradient-navy p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-premium">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold tracking-wider text-sports-blueLight uppercase">Operational Updates</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Stay Tuned to Tournament Operations</h2>
            <p className="text-sm text-gray-300 font-light leading-relaxed">
              Get real-time alerts on parking availability, stadium security status, weather warnings, and tournament transit timetables.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sports-blueLight"
              />
              <button className="rounded-lg bg-sports-blue px-6 py-3 font-semibold hover:bg-sports-blueLight transition-all whitespace-nowrap shadow-premium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
