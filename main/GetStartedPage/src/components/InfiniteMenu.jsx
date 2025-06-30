import { useEffect, useRef, useState } from 'react';
import './InfiniteMenu.css';

export default function InfiniteMenu() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [topSolvers, setTopSolvers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch most active users from backend
  useEffect(() => {
    const fetchMostActive = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/most-active');
        if (!response.ok) {
          throw new Error('Failed to fetch most active users');
        }
        const data = await response.json();
        setTopSolvers(data);
      } catch (error) {
        console.error('Error fetching most active users:', error);
        // Fallback to sample data if API fails
        setTopSolvers([
          {
            _id: '1',
            username: 'Alex Chen',
            profilePhoto: 'https://picsum.photos/900/900?random=1',
            activeDays: 45,
            expertise: 'Web Development'
          },
          {
            _id: '2',
            username: 'Sarah Kim',
            profilePhoto: 'https://picsum.photos/900/900?random=2',
            activeDays: 38,
            expertise: 'Data Science'
          },
          {
            _id: '3',
            username: 'Mike Johnson',
            profilePhoto: 'https://picsum.photos/900/900?random=3',
            activeDays: 32,
            expertise: 'Machine Learning'
          },
          {
            _id: '4',
            username: 'Emma Wilson',
            profilePhoto: 'https://picsum.photos/900/900?random=4',
            activeDays: 28,
            expertise: 'Mobile Development'
          },
          {
            _id: '5',
            username: 'David Lee',
            profilePhoto: 'https://picsum.photos/900/900?random=5',
            activeDays: 25,
            expertise: 'Cybersecurity'
          },
          {
            _id: '6',
            username: 'Lisa Park',
            profilePhoto: 'https://picsum.photos/900/900?random=6',
            activeDays: 22,
            expertise: 'UI/UX Design'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMostActive();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDragging = false;
    let startX = 0;
    let startRotation = 0;

    const handleMouseDown = (e) => {
      isDragging = true;
      startX = e.clientX;
      startRotation = rotation;
      setIsMoving(true);
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const newRotation = startRotation + (deltaX / 2);
      setRotation(newRotation);
      setIsMoving(true);
    };

    const handleMouseUp = () => {
      isDragging = false;
      setTimeout(() => setIsMoving(false), 100);
    };

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 30 : -30;
      setRotation(prev => prev + delta);
      setIsMoving(true);
      setTimeout(() => setIsMoving(false), 100);
    };

    container.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
    };
  }, [rotation]);

  // Auto-rotate when not interacting
  useEffect(() => {
    if (isMoving || loading) return;
    
    const interval = setInterval(() => {
      setRotation(prev => prev + 0.5);
    }, 50);

    return () => clearInterval(interval);
  }, [isMoving, loading]);

  const handleItemClick = (index) => {
    setActiveIndex(index);
    console.log('Selected solver:', topSolvers[index]);
  };

  if (loading) {
    return (
      <div className="infinite-menu-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading top solvers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="infinite-menu-container" ref={containerRef}>
      <div 
        className="gallery-sphere"
        style={{ 
          transform: `rotateY(${rotation}deg)`,
          transition: isMoving ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        {topSolvers.map((solver, index) => {
          const angle = (index / topSolvers.length) * 360;
          const radius = 300; // Distance from center
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const z = Math.sin((angle * Math.PI) / 180) * radius;
          
          return (
            <div
              key={solver._id}
              className={`gallery-item ${index === activeIndex ? 'active' : ''}`}
              style={{
                transform: `translate3d(${x}px, 0px, ${z}px) rotateY(${-rotation}deg)`,
                zIndex: index === activeIndex ? 10 : 1
              }}
              onClick={() => handleItemClick(index)}
            >
              <div className="item-image">
                <img 
                  src={solver.profilePhoto ? `http://localhost:5000${solver.profilePhoto}` : `https://picsum.photos/900/900?random=${index + 1}`} 
                  alt={solver.username} 
                />
              </div>
              <div className="item-overlay">
                <h3 className="item-title">{solver.username}</h3>
                <p className="item-description">
                  {solver.activeDays} days active
                  {solver.expertise && ` • ${solver.expertise}`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 