import React, { useState } from 'react';
import ProfileForm from './components/ProfileForm';
import LivePreview from './components/LivePreview';

const initialFormData = {
  fullName: '',
  jobTitle: '',
  company: '',
  email: '',
  phone: '',
  website: '',
  bio: '',
  avatarUrl: '',
  github: '',
  linkedin: '',
  twitter: '',
  theme: 'ocean',
  layout: 'standard'
};

function App() {
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThemeChange = (theme) => {
    setFormData((prev) => ({ ...prev, theme }));
  };

  const handleLayoutChange = (layout) => {
    setFormData((prev) => ({ ...prev, layout }));
  };

  const handleReset = () => {
    if(window.confirm('Are you sure you want to clear all data?')) {
      setFormData(initialFormData);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Profile Card Builder</h1>
      </header>

      <main className="split-layout">
        <div className="form-panel">
          <ProfileForm 
            formData={formData} 
            onChange={handleInputChange} 
            onThemeChange={handleThemeChange}
            onLayoutChange={handleLayoutChange}
            onReset={handleReset}
          />
        </div>
        
        <div className="preview-panel">
          <LivePreview formData={formData} />
        </div>
      </main>
    </div>
  );
}

export default App;
