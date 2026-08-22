import React, { useState, useEffect } from 'react';
import FormField from './FormField';
import ThemeSelector from './ThemeSelector';

const ProfileForm = ({ formData, onChange, onThemeChange, onLayoutChange, onReset }) => {
  const [errors, setErrors] = useState({});

  // Basic Validation
  useEffect(() => {
    const newErrors = {};
    
    if (formData.fullName && formData.fullName.length < 2) {
      newErrors.fullName = 'Name is too short';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (formData.phone && !/^[\d\s\+\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    if (formData.website && !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(formData.website)) {
      newErrors.website = 'Invalid URL';
    }

    setErrors(newErrors);
  }, [formData]);

  const layouts = [
    { id: 'standard', label: 'Standard' },
    { id: 'compact', label: 'Compact' },
    { id: 'detailed', label: 'Detailed' }
  ];

  return (
    <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
      <div className="form-section">
        <h2 className="form-section-title">Personal Details</h2>
        <div className="form-grid">
          <div className="full-width">
            <FormField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={onChange}
              required
              placeholder="Jane Doe"
              error={errors.fullName}
            />
          </div>
          <FormField
            label="Job Title"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={onChange}
            placeholder="Frontend Developer"
          />
          <FormField
            label="Company Name"
            name="company"
            value={formData.company}
            onChange={onChange}
            placeholder="Tech Corp"
          />
          <div className="full-width">
            <FormField
              label="Bio / Tagline"
              name="bio"
              type="textarea"
              value={formData.bio}
              onChange={onChange}
              placeholder="Passionate about building great user experiences..."
              maxLength={120}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h2 className="form-section-title">Contact Information</h2>
        <div className="form-grid">
          <FormField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
            placeholder="jane@example.com"
            error={errors.email}
          />
          <FormField
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={onChange}
            placeholder="+1 (555) 000-0000"
            error={errors.phone}
          />
          <div className="full-width">
            <FormField
              label="Website URL"
              name="website"
              type="url"
              value={formData.website}
              onChange={onChange}
              placeholder="https://janedoe.com"
              error={errors.website}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h2 className="form-section-title">Social Links & Media</h2>
        <div className="form-grid">
          <div className="full-width">
            <FormField
              label="Avatar URL"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={onChange}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          <FormField
            label="GitHub Username"
            name="github"
            value={formData.github}
            onChange={onChange}
            placeholder="janedoe"
          />
          <FormField
            label="LinkedIn Username"
            name="linkedin"
            value={formData.linkedin}
            onChange={onChange}
            placeholder="in/janedoe"
          />
          <FormField
            label="Twitter Handle"
            name="twitter"
            value={formData.twitter}
            onChange={onChange}
            placeholder="@janedoe"
          />
        </div>
      </div>

      <div className="form-section">
        <h2 className="form-section-title">Card Customization</h2>
        <div className="form-grid">
          <div className="full-width">
            <label className="field-label">Theme Color</label>
            <ThemeSelector activeTheme={formData.theme} onSelect={onThemeChange} />
          </div>
          <div className="full-width" style={{ marginTop: '1rem' }}>
            <label className="field-label">Card Layout</label>
            <div className="layout-options">
              {layouts.map(layout => (
                <button
                  key={layout.id}
                  type="button"
                  className={`layout-btn ${formData.layout === layout.id ? 'active' : ''}`}
                  onClick={() => onLayoutChange(layout.id)}
                >
                  {layout.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onReset}>
          Clear All
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
