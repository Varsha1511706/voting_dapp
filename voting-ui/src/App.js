import React, { useState, useEffect } from 'react';
import './App.css';
import VoteNow from './components/VoteNow';
import AdminPanel from './components/AdminPanel';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [studentVerified, setStudentVerified] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [connectedAccount, setConnectedAccount] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Check localStorage for existing verification
  useEffect(() => {
    const isVerified = localStorage.getItem('studentVerified');
    const storedData = localStorage.getItem('studentData');
    
    if (isVerified && storedData) {
      setStudentVerified(true);
      setStudentData(JSON.parse(storedData));
    }
  }, []);

  // Simulate wallet connection
  const connectWallet = () => {
    // In a real app, this would connect to MetaMask
    const mockAccount = "0x13b5EEF1..."; // Your Ganache first account
    setConnectedAccount(mockAccount);
    
    // Show toast
    showToast('Wallet connected successfully!', 'success');
    
    // Check if this is admin (first account)
    if (mockAccount.includes('13b5EEF1')) {
      setIsAdmin(true);
    }
  };

  // Verify student function
  const verifyStudent = (studentId, name, department, year) => {
    if (studentId && name && department && year) {
      const studentInfo = {
        id: studentId, 
        name, 
        department, 
        year,
        avatarInitials: getInitials(name)
      };
      
      localStorage.setItem('studentVerified', 'true');
      localStorage.setItem('studentData', JSON.stringify(studentInfo));
      
      setStudentVerified(true);
      setStudentData(studentInfo);
      setCurrentPage('voting');
      
      showToast('Student verified successfully!', 'success');
    } else {
      showToast('Please fill all the fields', 'error');
    }
  };

  // Get initials for avatar
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // Toast notification function
  const showToast = (message, type = 'success') => {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      <span>${message}</span>
    `;
    
    // Add to DOM
    document.body.appendChild(toast);
    
    // Show with animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => document.body.removeChild(toast), 500);
    }, 3000);
  };

  // Navigation function
  const navigateTo = (page) => {
    setCurrentPage(page);
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    document.querySelectorAll(`[data-page="${page}"]`).forEach(link => {
      link.classList.add('active');
    });
  };

  // Admin tab navigation
  const switchAdminTab = (tabId) => {
    document.querySelectorAll('.admin-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelectorAll(`[data-tab="${tabId}"]`).forEach(tab => {
      tab.classList.add('active');
    });
    
    document.querySelectorAll('.admin-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`${tabId}-tab`).classList.add('active');
  };

  return (
    <div className="App">
      {/* Inline styles from your HTML design */}
      <style jsx="true">{`
        :root {
          --primary: #1a237e;
          --secondary: #303f9f;
          --accent: #e53935;
          --light: #f5f7ff;
          --dark: #0d1440;
          --success: #43a047;
          --warning: #ffb300;
          --danger: #e53935;
          --info: #0288d1;
          --gradient: linear-gradient(135deg, #1a237e, #303f9f);
          --shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          --card-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          --admin-gradient: linear-gradient(135deg, #4a148c, #7b1fa2);
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .App {
          background-color: #f8faff;
          color: #333;
          line-height: 1.6;
          min-height: 100vh;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        /* Header Styles */
        header {
          background: var(--gradient);
          color: white;
          padding: 1rem 0;
          box-shadow: var(--shadow);
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(10px);
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .logo i {
          font-size: 2rem;
          color: white;
          background: rgba(255, 255, 255, 0.2);
          padding: 8px;
          border-radius: 10px;
        }
        
        .logo h1 {
          font-size: 1.6rem;
          font-weight: 700;
        }
        
        .logo span {
          color: #ffcc80;
        }
        
        nav ul {
          display: flex;
          list-style: none;
          gap: 1.5rem;
        }
        
        nav a {
          color: white;
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        
        nav a:hover, nav a.active {
          background-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }
        
        .user-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .connect-btn {
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .connect-btn:hover {
          background-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }
        
        .user-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ffcc80, #ff9800);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--dark);
          font-weight: bold;
          cursor: pointer;
          border: 2px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s;
        }
        
        .user-avatar:hover {
          transform: scale(1.05);
        }
        
        /* Main Content Styles */
        main {
          padding: 2rem 0;
          min-height: calc(100vh - 140px);
        }
        
        .page {
          display: none;
          animation: fadeIn 0.5s ease;
        }
        
        .page.active {
          display: block;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .page-header {
          margin-bottom: 2.5rem;
          text-align: center;
        }
        
        .page-header h2 {
          font-size: 2.2rem;
          color: var(--primary);
          margin-bottom: 0.8rem;
          position: relative;
          display: inline-block;
        }
        
        .page-header h2:after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 4px;
          background: var(--gradient);
          border-radius: 2px;
        }
        
        .page-header p {
          color: #666;
          max-width: 700px;
          margin: 1.5rem auto 0;
          font-size: 1.1rem;
        }
        
        /* Blockchain Status */
        .blockchain-status {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          margin-left: 1rem;
        }
        
        .status-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #4caf50;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        
        /* Toast Notification */
        .toast {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: var(--success);
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 1000;
          transform: translateY(100px);
          opacity: 0;
          transition: all 0.5s ease;
        }
        
        .toast.show {
          transform: translateY(0);
          opacity: 1;
        }
        
        .toast.error {
          background: var(--danger);
        }
        
        .toast.warning {
          background: var(--warning);
        }
        
        /* Home/Team Page Styles */
        .hero-section {
          background: var(--gradient);
          color: white;
          padding: 4rem 0;
          border-radius: 12px;
          margin-bottom: 3rem;
          text-align: center;
        }
        
        .hero-section h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .hero-section p {
          font-size: 1.2rem;
          max-width: 800px;
          margin: 0 auto 2rem;
        }
        
        .team-section {
          margin: 4rem 0;
        }
        
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }
        
        .team-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          box-shadow: var(--card-shadow);
          transition: all 0.3s;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .team-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        
        .team-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: var(--gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          font-size: 2.5rem;
          color: white;
          border: 4px solid white;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }
        
        .team-card h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--primary);
        }
        
        .team-card .role {
          color: var(--secondary);
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .team-card p {
          color: #666;
          margin-bottom: 1.5rem;
        }
        
        .social-links {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }
        
        .social-links a {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--light);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          transition: all 0.3s;
          text-decoration: none;
        }
        
        .social-links a:hover {
          background: var(--gradient);
          color: white;
          transform: translateY(-3px);
        }
        
        /* Authentication Page Styles */
        .auth-container {
          max-width: 500px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: var(--card-shadow);
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .auth-header {
          padding: 1.8rem;
          background: var(--gradient);
          color: white;
          text-align: center;
        }
        
        .auth-header h3 {
          font-size: 1.6rem;
          margin-bottom: 0.5rem;
        }
        
        .auth-body {
          padding: 2rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.7rem;
          font-weight: 600;
          color: var(--primary);
        }
        
        .form-group input, .form-group select {
          width: 100%;
          padding: 0.9rem 1.2rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
          transition: all 0.3s;
        }
        
        .form-group input:focus, .form-group select:focus {
          border-color: var(--secondary);
          box-shadow: 0 0 0 3px rgba(41, 98, 255, 0.1);
          outline: none;
        }
        
        .auth-actions {
          display: flex;
          justify-content: center;
          margin-top: 2rem;
        }
        
        /* Button Styles */
        .btn {
          padding: 0.7rem 1.4rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
          text-align: center;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .btn-primary {
          background: var(--gradient);
          color: white;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(41, 98, 255, 0.3);
        }
        
        .btn-block {
          width: 100%;
        }
        
        /* Footer Styles */
        footer {
          background: var(--gradient);
          color: white;
          padding: 2.5rem 0;
          text-align: center;
        }
        
        .footer-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
        
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 1rem;
        }
        
        .footer-logo i {
          font-size: 2.2rem;
        }
        
        .footer-logo h2 {
          font-size: 1.8rem;
        }
        
        .footer-links {
          display: flex;
          gap: 2rem;
          margin: 1.5rem 0;
        }
        
        .footer-links a {
          color: white;
          text-decoration: none;
          transition: all 0.3s;
          font-weight: 500;
        }
        
        .footer-links a:hover {
          color: #ffcc80;
          transform: translateY(-2px);
        }
        
        .copyright {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.95rem;
          margin-top: 1rem;
        }
        
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1.2rem;
          }
          
          nav ul {
            flex-wrap: wrap;
            justify-content: center;
          }
          
          .hero-section h1 {
            font-size: 2.5rem;
          }
          
          .footer-links {
            flex-wrap: wrap;
            justify-content: center;
          }
          
          .blockchain-status {
            margin-left: 0;
            margin-top: 0.5rem;
          }
        }
      `}</style>

      {/* Header */}
      <header>
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <i className="fas fa-vote-yea"></i>
              <h1>Block<span>Vote</span></h1>
            </div>
            
            <nav>
              <ul>
                <li><a className={`nav-link ${currentPage === 'home' ? 'active' : ''}`} 
                       data-page="home" onClick={() => navigateTo('home')}>
                  <i className="fas fa-home"></i> Home
                </a></li>
                <li><a className={`nav-link ${currentPage === 'voting' ? 'active' : ''}`} 
                       data-page="voting" onClick={() => navigateTo('voting')}>
                  <i className="fas fa-vote-yea"></i> Vote
                </a></li>
                <li><a className={`nav-link ${currentPage === 'auth' ? 'active' : ''}`} 
                       data-page="auth" onClick={() => navigateTo('auth')}>
                  <i className="fas fa-user-shield"></i> Authentication
                </a></li>
                {isAdmin && (
                  <li><a className={`nav-link ${currentPage === 'admin' ? 'active' : ''}`} 
                         data-page="admin" onClick={() => navigateTo('admin')}>
                    <i className="fas fa-user-cog"></i> Admin Panel
                  </a></li>
                )}
              </ul>
            </nav>
            
            <div className="user-actions">
              <div className="blockchain-status">
                <div className="status-indicator"></div>
                <span>Blockchain Connected</span>
              </div>
              <button className="connect-btn" onClick={connectWallet}>
                <i className="fas fa-wallet"></i> Connect Wallet
              </button>
              <div className="user-avatar" title={studentData?.name || 'Guest'}>
                {studentData?.avatarInitials || 'DV'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <div className="container">
          {/* Home/Team Page */}
          <section id="home" className={`page ${currentPage === 'home' ? 'active' : ''}`}>
            <div className="hero-section">
              <h1>Decentralized Voting System</h1>
              <p>A secure, transparent, and tamper-proof voting platform built on blockchain technology for educational institutions.</p>
              <button className="btn btn-primary" onClick={() => navigateTo(studentVerified ? 'voting' : 'auth')}>
                <i className="fas fa-vote-yea"></i> Start Voting
              </button>
            </div>
            
            <div className="team-section">
              <div className="page-header">
                <h2>Our Team</h2>
                <p>Final Year Artificial Intelligence and Data Science Engineering Students</p>
              </div>
              
              <div className="team-grid">
                <div className="team-card">
                  <div className="team-avatar">DK</div>
                  <h3>Dhivya Kirthi V K</h3>
                  <p className="role">Blockchain Developer</p>
                  <p>Final year AI&DS student specializing in blockchain technology and smart contract development.</p>
                  <div className="social-links">
                    <a href="#"><i className="fab fa-linkedin"></i></a>
                    <a href="#"><i className="fab fa-github"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                  </div>
                </div>
                
                <div className="team-card">
                  <div className="team-avatar">JV</div>
                  <h3>Jaya Varsha R</h3>
                  <p className="role">Backend Developer</p>
                  <p>Final year AI&DS student with expertise in backend systems and database management.</p>
                  <div className="social-links">
                    <a href="#"><i className="fab fa-linkedin"></i></a>
                    <a href="#"><i className="fab fa-github"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                  </div>
                </div>
                
                <div className="team-card">
                  <div className="team-avatar">PT</div>
                  <h3>Pethal T</h3>
                  <p className="role">Data Analyst</p>
                  <p>Final year AI&DS student passionate about creating intuitive and beautiful user interfaces.</p>
                  <div className="social-links">
                    <a href="#"><i className="fab fa-linkedin"></i></a>
                    <a href="#"><i className="fab fa-github"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                  </div>
                </div>
                
                <div className="team-card">
                  <div className="team-avatar">SH</div>
                  <h3>S R Harini</h3>
                  <p className="role">Frontend Developer</p>
                  <p>Final year AI&DS student with strong organizational skills and project coordination abilities.</p>
                  <div className="social-links">
                    <a href="#"><i className="fab fa-linkedin"></i></a>
                    <a href="#"><i className="fab fa-github"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Voting Page */}
          <section id="voting" className={`page ${currentPage === 'voting' ? 'active' : ''}`}>
            {!studentVerified ? (
              <div>
                <div className="page-header">
                  <h2>Access Required</h2>
                  <p>Please verify your student status to access the voting system.</p>
                </div>
                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                  <button className="btn btn-primary" onClick={() => navigateTo('auth')}>
                    <i className="fas fa-user-check"></i> Go to Verification
                  </button>
                </div>
              </div>
            ) : (
              <VoteNow />
            )}
          </section>

          {/* Authentication Page */}
          <section id="auth" className={`page ${currentPage === 'auth' ? 'active' : ''}`}>
            <div className="page-header">
              <h2>Voter Authentication</h2>
              <p>Verify your identity to participate in the voting process.</p>
            </div>
            
            <div className="auth-container">
              <div className="auth-header">
                <h3>Student Verification</h3>
                <p>Please provide your details to verify eligibility</p>
              </div>
              
              <div className="auth-body">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  verifyStudent(
                    formData.get('studentId'),
                    formData.get('name'),
                    formData.get('department'),
                    formData.get('year')
                  );
                }}>
                  <div className="form-group">
                    <label htmlFor="studentId">Student ID</label>
                    <input type="text" id="studentId" name="studentId" placeholder="Enter your student ID" required />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input type="text" id="fullName" name="name" placeholder="Enter your full name" required />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="department">Department</label>
                    <select id="department" name="department" required>
                      <option value="">Select your department</option>
                      <option value="cse">Computer Science & Engineering</option>
                      <option value="ece">Electronics & Communication</option>
                      <option value="mech">Mechanical Engineering</option>
                      <option value="civil">Civil Engineering</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="year">Academic Year</label>
                    <select id="year" name="year" required>
                      <option value="">Select your year</option>
                      <option value="1">First Year</option>
                      <option value="2">Second Year</option>
                      <option value="3">Third Year</option>
                      <option value="4">Final Year</option>
                    </select>
                  </div>
                  
                  <div className="auth-actions">
                    <button type="submit" className="btn btn-primary btn-block">
                      <i className="fas fa-user-check"></i> Verify & Proceed
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>

          {/* Admin Panel - Simplified version */}
          {isAdmin && (
            <section id="admin" className={`page ${currentPage === 'admin' ? 'active' : ''}`}>
              <div className="page-header">
                <h2>Admin Panel</h2>
                <p>Manage the voting process and view results</p>
              </div>
              
              <div style={{ 
                background: 'white', 
                borderRadius: '12px', 
                padding: '2rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                marginTop: '2rem'
              }}>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  marginBottom: '1.5rem', 
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <i className="fas fa-vote-yea"></i> Voting Control
                </h3>
                
                <p style={{ marginBottom: '2rem', color: '#666' }}>
                  As an admin, you can start and end the voting period. Remember to start voting before students can cast their votes.
                </p>
                
                <div style={{ textAlign: 'center', padding: '2rem', background: '#f8f9fa', borderRadius: '8px' }}>
                  <p style={{ marginBottom: '1.5rem' }}>Go to the voting page to access admin controls.</p>
                  <button className="btn btn-primary" onClick={() => navigateTo('voting')}>
                    <i className="fas fa-arrow-right"></i> Go to Voting Page
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <i className="fas fa-vote-yea"></i>
              <h2>BlockVote</h2>
            </div>
            <p>Decentralized Online Voting System Using Ethereum Smart Contracts</p>
            <div className="footer-links">
              <a href="#" onClick={() => navigateTo('home')}><i className="fas fa-info-circle"></i> About</a>
              <a href="#" onClick={() => navigateTo('voting')}><i className="fas fa-cogs"></i> How It Works</a>
              <a href="#" onClick={() => navigateTo('auth')}><i className="fas fa-question-circle"></i> FAQ</a>
            </div>
            <p className="copyright">&copy; 2025 BlockVote. All rights reserved. | Department of Computer Science and Engineering</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;