import React from 'react';
import { loadFont } from "@remotion/google-fonts/Inter";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";

loadFont();
loadPoppins();
loadOswald();

interface TextStyleProps {
  children: React.ReactNode;
  x?: number;
  y?: number;
  fontSize?: number;
}

const DEFAULT_FONT_SIZE = 70;

const baseStyles: React.CSSProperties = {
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
};

export const TiktokBlack: React.FC<TextStyleProps> = ({ children, x = 50, y = 50, fontSize = DEFAULT_FONT_SIZE }) => (
  <div style={{
    ...baseStyles,
    left: `${x}%`,
    top: `${y}%`,
    backgroundColor: 'white',
    color: 'black',
    padding: '10px 20px',
    borderRadius: '5px',
    fontFamily: 'Inter',
    fontSize: `${fontSize}px`,
    fontWeight: 'bold',
  }}>
    {children}
  </div>
);

export const TiktokWhiteBorder: React.FC<TextStyleProps> = ({ children, x = 50, y = 50, fontSize = DEFAULT_FONT_SIZE }) => (
  <div style={{
    ...baseStyles,
    left: `${x}%`,
    top: `${y}%`,
    color: 'white',
    textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000',
    fontFamily: 'Inter',
    fontSize: `${fontSize}px`,
    fontWeight: 'bold',
  }}>
    {children}
  </div>
);

export const TiktokWhite: React.FC<TextStyleProps> = ({ children, x = 50, y = 50, fontSize = DEFAULT_FONT_SIZE }) => (
  <div style={{
    ...baseStyles,
    left: `${x}%`,
    top: `${y}%`,
    color: 'white',
    fontFamily: 'Inter',
    fontSize: `${fontSize}px`,
    fontWeight: 'bold',
  }}>
    {children}
  </div>
);

export const Shadow: React.FC<TextStyleProps> = ({ children, x = 50, y = 50, fontSize = DEFAULT_FONT_SIZE }) => (
  <div style={{
    ...baseStyles,
    left: `${x}%`,
    top: `${y}%`,
    color: 'white',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
    fontFamily: 'Poppins',
    fontSize: `${fontSize}px`,
    fontWeight: '600',
  }}>
    {children}
  </div>
);

export const Uppercase: React.FC<TextStyleProps> = ({ children, x = 50, y = 50, fontSize = DEFAULT_FONT_SIZE }) => (
  <div style={{
    ...baseStyles,
    left: `${x}%`,
    top: `${y}%`,
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    fontFamily: 'Oswald',
    fontSize: `${fontSize}px`,
    fontWeight: 'bold',
  }}>
    {children}
  </div>
);

export const Laura: React.FC<TextStyleProps> = ({ children, x = 50, y = 50, fontSize = DEFAULT_FONT_SIZE }) => (
  <div style={{
    ...baseStyles,
    left: `${x}%`,
    top: `${y}%`,
    color: '#FF6B6B',
    fontFamily: 'Poppins',
    fontSize: `${fontSize}px`,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  }}>
    {children}
  </div>
);

export const Logan: React.FC<TextStyleProps> = ({ children, x = 50, y = 50, fontSize = DEFAULT_FONT_SIZE }) => (
  <div style={{
    ...baseStyles,
    left: `${x}%`,
    top: `${y}%`,
    color: 'white',
    fontFamily: 'Oswald',
    fontSize: `${fontSize}px`,
    fontWeight: 'bold',
    letterSpacing: '1px',
    textShadow: '3px 3px 0 #000',
  }}>
    {children}
  </div>
);

export const Enrico: React.FC<TextStyleProps> = ({ children, x = 50, y = 50, fontSize = DEFAULT_FONT_SIZE }) => (
  <div style={{
    ...baseStyles,
    left: `${x}%`,
    top: `${y}%`,
    color: '#4ECDC4',
    fontFamily: 'Poppins',
    fontSize: `${fontSize}px`,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  }}>
    {children}
  </div>
);

export const Mike: React.FC<TextStyleProps> = ({ children, x = 50, y = 50, fontSize = DEFAULT_FONT_SIZE }) => (
  <div style={{
    ...baseStyles,
    left: `${x}%`,
    top: `${y}%`,
    color: 'white',
    fontFamily: 'Inter',
    fontSize: `${fontSize}px`,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: '8px 16px',
    borderRadius: '4px',
  }}>
    {children}
  </div>
);

export const Devin: React.FC<TextStyleProps> = ({ children, x = 50, y = 50, fontSize = DEFAULT_FONT_SIZE }) => (
  <div style={{
    ...baseStyles,
    left: `${x}%`,
    top: `${y}%`,
    color: '#FFA07A',
    fontFamily: 'Poppins',
    fontSize: `${fontSize}px`,
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
  }}>
    {children}
  </div>
);

export const Hormozi: React.FC<TextStyleProps> = ({ children, x = 50, y = 50, fontSize = DEFAULT_FONT_SIZE }) => (
  <div style={{
    ...baseStyles,
    left: `${x}%`,
    top: `${y}%`,
    color: 'white',
    fontFamily: 'Inter',
    fontSize: `${fontSize}px`,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '3px',
    textShadow: '2px 2px 0 #FF6B6B',
  }}>
    {children}
  </div>
);

export const Masi: React.FC<TextStyleProps> = ({ children, x = 50, y = 50, fontSize = DEFAULT_FONT_SIZE }) => (
  <div style={{
    ...baseStyles,
    left: `${x}%`,
    top: `${y}%`,
    color: '#98D8C8',
    fontFamily: 'Poppins',
    fontSize: `${fontSize}px`,
    fontWeight: 'bold',
    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)',
  }}>
    {children}
  </div>
);

export const Ali: React.FC<TextStyleProps> = ({ children, x = 50, y = 50, fontSize = DEFAULT_FONT_SIZE }) => (
  <div style={{
    ...baseStyles,
    left: `${x}%`,
    top: `${y}%`,
    color: 'white',
    fontFamily: 'Inter',
    fontSize: `${fontSize}px`,
    fontWeight: 'bold',
    backgroundColor: '#45B7D1',
    padding: '10px 20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  }}>
    {children}
  </div>
);
