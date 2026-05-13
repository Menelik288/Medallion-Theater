import React, { useState, useEffect } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeaveWindow = () => setIsVisible(false);
    const handleMouseEnterWindow = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed pointer-events-none z-[999999] mix-blend-difference hidden md:block"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* Outer Ring */}
      <div 
        className={`border border-[#C5A059] rounded-full transition-all duration-300 ease-out ${
          isHovering ? 'w-12 h-12 border-[#E9C176] bg-[#C5A059]/10' : 'w-8 h-8'
        }`} 
      />
      {/* Center Dot */}
      <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ${
        isHovering ? 'w-2 h-2 bg-[#E9C176] shadow-[0_0_10px_#E9C176]' : 'w-1 h-1 bg-white'
      }`} />
    </div>
  );
}
