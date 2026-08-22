import React from 'react';

const themes = [
  { id: 'ocean', name: 'Ocean' },
  { id: 'sunset', name: 'Sunset' },
  { id: 'forest', name: 'Forest' },
  { id: 'purple', name: 'Purple' },
  { id: 'midnight', name: 'Midnight' }
];

const ThemeSelector = ({ activeTheme, onSelect }) => {
  return (
    <div className="theme-options">
      {themes.map((theme) => (
        <button
          key={theme.id}
          type="button"
          onClick={() => onSelect(theme.id)}
          className={`theme-btn ${activeTheme === theme.id ? 'active' : ''}`}
          title={theme.name}
          aria-label={`Select ${theme.name} theme`}
        >
          <div className={`theme-color-inner theme-${theme.id}`}></div>
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;
