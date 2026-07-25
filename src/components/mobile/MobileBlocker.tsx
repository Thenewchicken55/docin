import { useEffect, useState } from 'react';

export function MobileBlocker() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileWidth = window.innerWidth < 768;
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      setIsMobile(isMobileWidth || isMobileUA);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <div className="mobile-blocker">
      <div className="mobile-blocker-content">
        <div className="mobile-icon">🖥️</div>
        <h1>Desktop Only</h1>
        <p>
          Docin is designed for desktop use only. Please access this application on a
          desktop or laptop computer for the best experience.
        </p>
        <div className="mobile-info">
          <p>Minimum screen size: 768px</p>
          <p>Supported platforms: Windows, macOS, Linux</p>
        </div>
      </div>
    </div>
  );
}
