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

const DEFAULT_FONT_SIZE = 56;

const baseStyles: React.CSSProperties = {
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
  width: 'fit-content',
  maxWidth: '90%',
  whiteSpace: 'pre-line',
};

export const TiktokBlack: React.FC<TextStyleProps> = ({ children, x = 50, y = 50, fontSize = DEFAULT_FONT_SIZE }) => (
  <div style={{
    ...baseStyles,
    left: `${x}%`,
    top: `${y}%`,
    backgroundColor: 'white',
    color: 'black',
    padding: `${fontSize * 0.14}px ${fontSize * 0.28}px`,
    borderRadius: `${fontSize * 0.07}px`,
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
    textShadow: `${fontSize * 0.12}px ${fontSize * 0.12}px 0 #000, ${fontSize * -0.12}px ${fontSize * 0.12}px 0 #000, ${fontSize * 0.12}px ${fontSize * -0.12}px 0 #000, ${fontSize * -0.12}px ${fontSize * -0.12}px 0 #000`,
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
    textShadow: `${fontSize * 0.03}px ${fontSize * 0.03}px ${fontSize * 0.06}px rgba(0, 0, 0, 0.5)`,
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
    letterSpacing: `${fontSize * 0.03}px`,
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
    letterSpacing: `${fontSize * 0.014}px`,
    textShadow: `${fontSize * 0.043}px ${fontSize * 0.043}px 0 #000`,
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
    letterSpacing: `${fontSize * 0.03}px`,
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
    padding: `${fontSize * 0.11}px ${fontSize * 0.23}px`,
    borderRadius: `${fontSize * 0.06}px`,
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
    textShadow: `${fontSize * 0.03}px ${fontSize * 0.03}px ${fontSize * 0.06}px rgba(0, 0, 0, 0.3)`,
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
    letterSpacing: `${fontSize * 0.043}px`,
    textShadow: `${fontSize * 0.1}px ${fontSize * 0.1}px 0 #FF6B6B`,
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
    textShadow: `${fontSize * 0.05}px ${fontSize * 0.05}px ${fontSize * 0.1}px rgba(0, 0, 0, 0.4)`,
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
    padding: `${fontSize * 0.14}px ${fontSize * 0.28}px`,
    borderRadius: `${fontSize * 0.11}px`,
    boxShadow: `${fontSize * 0.05}px ${fontSize * 0.05}px ${fontSize * 0.1}px rgba(0, 0, 0, 0.2)`,
  }}>
    {children}
  </div>
);
