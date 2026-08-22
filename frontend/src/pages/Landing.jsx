import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

// Intersection Observer Hook for scroll animations
function useScrollReveal() {
  useEffect(() => {
    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    };

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const elements = document.querySelectorAll('.reveal');
    
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

const Landing = () => {
  useScrollReveal();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowBackTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="landing-body">
      <header className={`landing-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="wrap nav-row">
          <div className="nav-left">
            <a href="#discover">Discover</a>
            <a href="#inspiration">Inspiration</a>
            <a href="#essentials">Traveler types</a>
          </div>
          
          <Link to="/" className="brand">
            {/* GlobeNest Logo */}
            <img src="/logo.png" alt="GlobeNest Logo" />
            <span>GlobeNest</span>
          </Link>
          
          <div className="nav-right">
            <Link to="/login" className="landing-btn landing-btn-solid">Start Planning</Link>
            <button className="menu-toggle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>
        </div>
      </header>

      <section className="hero">
        <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2000&q=80" alt="Beautiful landscape" />
        <div className="hero-content reveal">
          <div className="wrap">
            <div className="crumbs"><span>FEATURED</span> / <span>SWITZERLAND</span></div>
            <h1 className="hero-title">Find clarity<br/>in the mountains.</h1>
            <p className="hero-sub">Escape the noise and rediscover your sense of wonder. Let GlobeNest guide you to the world's most serene and breathtaking destinations.</p>
            <Link to="/register" className="landing-btn landing-btn-solid">Create Your Itinerary</Link>
          </div>
        </div>
      </section>

      <section className="intro" id="discover">
        <div className="wrap">
          <p className="reveal">Travel is more than just moving from place to place. It's about the moments that take your breath away, the connections you make, and the memories you carry home.</p>
          <p className="reveal reveal-delay-1">With GlobeNest, you're not just booking a trip; you're crafting an experience tailored specifically to your unique tastes and desires. From hidden gems to iconic landmarks, we help you uncover the world's wonders at your own pace.</p>
        </div>
      </section>

      <section className="section" id="inspiration">
        <div className="wrap">
          <div className="section-title reveal">
            <div>
              <span className="eyebrow-sm">Curated Collections</span>
              <h2>The travel magazine</h2>
            </div>
            <Link to="/explore" className="see-all">Explore all guides</Link>
          </div>

          <div className="mag-grid">
            <div className="tile t-big reveal">
              <img src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80" alt="Paris" />
              <div className="tile-body">
                <span className="tile-eyebrow">City Guide</span>
                <h3>72 Hours in Paris:<br/>Beyond the Eiffel Tower</h3>
              </div>
            </div>
            
            <div className="tile t-med reveal reveal-delay-1">
              <img src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80" alt="Beach" />
              <div className="tile-body">
                <span className="tile-eyebrow">Escape</span>
                <h3>Hidden coastal gems of the Mediterranean</h3>
              </div>
            </div>

            <div className="tile t-small reveal reveal-delay-2">
              <img src="https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=600&q=80" alt="Travel essentials" />
              <div className="tile-body">
                <span className="tile-eyebrow">Packing</span>
                <h3>The minimalist traveler's checklist</h3>
              </div>
            </div>

            <div className="tile t-small reveal reveal-delay-3">
              <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80" alt="Architecture" />
              <div className="tile-body">
                <span className="tile-eyebrow">Culture</span>
                <h3>Tracing history through architecture</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="spot-banner reveal">
            <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80" alt="Tropical paradise" />
            <div className="spot-content">
              <span className="eyebrow-sm">Exclusive Offer</span>
              <h2>Plan your winter escape</h2>
              <p>Trade the cold for sun-drenched beaches and warm waters. Discover our handpicked tropical itineraries designed for maximum relaxation and rejuvenation.</p>
              <Link to="/register" className="landing-btn landing-btn-outline">Start Planning Now</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-title reveal">
            <h2>Trending Destinations</h2>
            <Link to="/explore" className="see-all">View all</Link>
          </div>

          <div className="like-grid">
            <div className="like-card reveal">
              <div className="like-img">
                <img src="https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=800&q=80" alt="Kyoto" />
              </div>
              <h4>Kyoto, Japan</h4>
              <div className="cat">Culture & History</div>
            </div>
            
            <div className="like-card reveal reveal-delay-1">
              <div className="like-img">
                <img src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=800&q=80" alt="Venice" />
              </div>
              <h4>Venice, Italy</h4>
              <div className="cat">Romance & Architecture</div>
            </div>

            <div className="like-card reveal reveal-delay-2">
              <div className="like-img">
                <img src="https://images.unsplash.com/photo-1496939376851-8f3b145b27ee?auto=format&fit=crop&w=800&q=80" alt="Bali" />
              </div>
              <h4>Bali, Indonesia</h4>
              <div className="cat">Nature & Relaxation</div>
            </div>
          </div>
        </div>
      </section>

      <section className="essential reveal" id="essentials">
        <div className="wrap">
          <div className="essential-grid">
            <div>
              <h2>Why plan with GlobeNest?</h2>
              <p className="lead">We've reimagined travel planning to make it as enjoyable as the journey itself. Here's what makes our platform different.</p>
            </div>
            <div className="info-list">
              <div className="info-row">
                <div className="info-left">
                  <div className="info-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>
                  <div className="info-text">
                    <h4>Smart Itineraries</h4>
                    <p>Optimized routes that save you time and maximize experiences.</p>
                  </div>
                </div>
                <div className="info-arrow">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>
              </div>
              
              <div className="info-row">
                <div className="info-left">
                  <div className="info-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  </div>
                  <div className="info-text">
                    <h4>Budget Tracking</h4>
                    <p>Keep your finances in check with real-time expense monitoring.</p>
                  </div>
                </div>
                <div className="info-arrow">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>
              </div>

              <div className="info-row">
                <div className="info-left">
                  <div className="info-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  </div>
                  <div className="info-text">
                    <h4>Collaborative Planning</h4>
                    <p>Invite friends and family to build the perfect trip together.</p>
                  </div>
                </div>
                <div className="info-arrow">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap">
        <div className="newsletter reveal">
          <h2>Get travel inspiration straight to your inbox</h2>
          <p>Join our community of over 50,000 travelers who receive our weekly curated guides, tips, and exclusive offers.</p>
          <form className="sub-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email address" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="wrap">
          <div className="foot-top">
            <div className="foot-links">
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Press</a>
              <a href="#">Travel Guides</a>
              <a href="#">Support</a>
            </div>
            <div className="brand">
               <img src="/logo.png" alt="GlobeNest Logo" />
              <span style={{ fontSize: '18px' }}>GlobeNest</span>
            </div>
          </div>
          <div className="foot-mid">
            <div className="foot-apps">
              <a href="#" className="app-badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path><path d="M10 2c1 .5 2 2 2 5"></path></svg>
                <div>Download on the<br/><b>App Store</b></div>
              </a>
              <a href="#" className="app-badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 2 3 22 21 12 3 2"></polygon></svg>
                <div>Get it on<br/><b>Google Play</b></div>
              </a>
            </div>
            <div className="foot-social">
              <a href="#"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
              <a href="#"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
              <a href="#"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a>
            </div>
          </div>
          <div className="foot-bottom">
            <span>&copy; {new Date().getFullYear()} GlobeNest. All rights reserved.</span>
            <div style={{display: 'flex', gap: '20px'}}>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>
      
      <button 
        className={`back-top ${showBackTop ? 'show' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
      </button>
    </div>
  );
};

export default Landing;
