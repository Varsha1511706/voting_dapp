import React, { useState } from 'react';

const StudentVerification = ({ onVerify }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    department: '',
    year: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify(formData.studentId, formData.fullName, formData.department, formData.year);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Student Verification</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            name="studentId"
            placeholder="Student ID"
            value={formData.studentId}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            name="year"
            placeholder="Year (e.g., 2024)"
            value={formData.year}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        
        <button 
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        >
          Verify Student
        </button>
      </form>
    </div>
  );
};

export default StudentVerification;