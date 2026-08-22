import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavScrolled(true);
      } else {
        setNavScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Home', 'About', 'Projects', 'Contact'];
  
  const stats = [
    { label: 'Projects Completed', value: '50+' },
    { label: 'Years Experience', value: '4' },
    { label: 'Happy Clients', value: '30+' },
    { label: 'Coffee Cups', value: '∞' }
  ];

  const techStack = [
    { name: 'React', color: '#61DAFB' },
    { name: 'JavaScript', color: '#F7DF1E' },
    { name: 'CSS3', color: '#1572B6' },
    { name: 'HTML5', color: '#E34F26' },
    { name: 'Node.js', color: '#339933' },
    { name: 'Git', color: '#F05032' },
    { name: 'Vite', color: '#646CFF' },
    { name: 'Figma', color: '#F24E1E' }
  ];

  const socialLinks = [
    { name: 'GitHub', url: '#' },
    { name: 'LinkedIn', url: '#' },
    { name: 'Twitter', url: '#' }
  ];

  // Generate particles
  const particles = Array.from({ length: 20 }).map((_, i) => (
    <div key={i} className={`particle p-${i}`}></div>
  ));

  return (
    <div className="portfolio-container">
      <div className="particles-container">
        {particles}
      </div>

      <nav className={`navbar ${navScrolled ? 'scrolled' : ''}`}>
        <div className="nav-content">
          <div className="logo">&lt;HindukushSoft Technologies/&gt;</div>
          <ul className="nav-links">
            {navLinks.map((link, index) => (
              <li key={index}><a href={`#${link.toLowerCase()}`}>{link}</a></li>
            ))}
          </ul>
        </div>
      </nav>

      <main className="main-content">
        <section id="home" className="hero-section">
          <div className="hero-content">
            <h2 className="greeting">Hello, I'm</h2>
            <h1 className="name-title">
              <span className="gradient-text">Hamdan Ali</span>
            </h1>
            <p className="subtitle">
              <span className="typewriter">Creative Front-End Engineer & UI Designer</span>
            </p>
            <div className="hero-cta">
              <button className="primary-btn">View My Work</button>
              <button className="secondary-btn">Contact Me</button>
            </div>
            
            <div className="social-links">
              {socialLinks.map(social => (
                <a key={social.name} href={social.url} className="social-icon">
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="stats" className="stats-section">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card glass-panel fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="tech-section">
          <h2 className="section-title">My Tech Stack</h2>
          <div className="tech-grid">
            {techStack.map((tech, index) => (
              <div key={index} className="tech-card glass-panel hover-lift">
                <div className="tech-dot" style={{ backgroundColor: tech.color }}></div>
                <span className="tech-name">{tech.name}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer glass-panel">
        <p>&copy; {new Date().getFullYear()} Hamdan Alli. All rights reserved.</p>
        <p className="footer-sub">Designed & Built with React</p>
      </footer>
    </div>
  );
};

export default App;
