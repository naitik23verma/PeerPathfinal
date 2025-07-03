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
        console.log('Fetching most active users...');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/most-active`);
        if (!response.ok) {
          throw new Error('Failed to fetch most active users');
        }
        let data = await response.json();
        console.log('Most active users data from backend:', data);
        // Fallback sample users
        const fallbackUsers = [
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
          },
          {
            _id: '7',
            username: 'Priya Singh',
            profilePhoto: 'https://picsum.photos/900/900?random=7',
            activeDays: 20,
            expertise: 'Cloud Computing'
          },
          {
            _id: '8',
            username: 'Carlos Gomez',
            profilePhoto: 'https://picsum.photos/900/900?random=8',
            activeDays: 18,
            expertise: 'DevOps'
          },
          {
            _id: '9',
            username: 'Anna Müller',
            profilePhoto: 'https://picsum.photos/900/900?random=9',
            activeDays: 16,
            expertise: 'AI Research'
          },
          {
            _id: '10',
            username: 'Tom Brown',
            profilePhoto: 'https://picsum.photos/900/900?random=10',
            activeDays: 15,
            expertise: 'Game Development'
          },
          {
            _id: '11',
            username: 'Sofia Rossi',
            profilePhoto: 'https://picsum.photos/900/900?random=11',
            activeDays: 14,
            expertise: 'Blockchain'
          },
          {
            _id: '12',
            username: 'Yuki Tanaka',
            profilePhoto: 'https://picsum.photos/900/900?random=12',
            activeDays: 13,
            expertise: 'AR/VR'
          }
        ];
        // Only keep the top 8 users, fill with fallback if less
        if (!Array.isArray(data)) data = [];
        while (data.length < 8) {
          data = data.concat(fallbackUsers.slice(0, 8 - data.length));
        }
        data = data.slice(0, 8);
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
          },
          {
            _id: '7',
            username: 'Priya Singh',
            profilePhoto: 'https://picsum.photos/900/900?random=7',
            activeDays: 20,
            expertise: 'Cloud Computing'
          },
          {
            _id: '8',
            username: 'Carlos Gomez',
            profilePhoto: 'https://picsum.photos/900/900?random=8',
            activeDays: 18,
            expertise: 'DevOps'
          },
          {
            _id: '9',
            username: 'Anna Müller',
            profilePhoto: 'https://picsum.photos/900/900?random=9',
            activeDays: 16,
            expertise: 'AI Research'
          },
          {
            _id: '10',
            username: 'Tom Brown',
            profilePhoto: 'https://picsum.photos/900/900?random=10',
            activeDays: 15,
            expertise: 'Game Development'
          },
          {
            _id: '11',
            username: 'Sofia Rossi',
            profilePhoto: 'https://picsum.photos/900/900?random=11',
            activeDays: 14,
            expertise: 'Blockchain'
          },
          {
            _id: '12',
            username: 'Yuki Tanaka',
            profilePhoto: 'https://picsum.photos/900/900?random=12',
            activeDays: 13,
            expertise: 'AR/VR'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMostActive();
  }, []);

  useEffect(() => {
    // Remove all event listeners for mouse and touch interactions
    // Only keep auto-rotation
  }, []);

  // Auto-rotate when not interacting
  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      setRotation(prev => prev + 0.5);
    }, 50);
    return () => clearInterval(interval);
  }, [loading]);

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
          // Defensive checks for missing fields
          const username = solver.username || 'Unknown User';
          let profilePhoto = solver.profilePhoto;
          if (profilePhoto && profilePhoto.startsWith('/')) {
            profilePhoto = `${import.meta.env.VITE_API_BASE}${profilePhoto}`;
          } else if (!profilePhoto) {
            profilePhoto = `https://picsum.photos/900/900?random=${index + 1}`;
          }
          const activeDays = solver.activeDays || 0;
          const expertise = solver.expertise || '';
          const visitCount = solver.visitCount || 0;
          return (
            <div
              key={solver._id || index}
              className={`gallery-item ${index === activeIndex ? 'active' : ''}`}
              style={{
                transform: `translate3d(${x}px, 0px, ${z}px) rotateY(${-rotation}deg)`,
                zIndex: index === activeIndex ? 10 : 1
              }}
            >
              <div className="item-image">
                {solver.profilePhoto ? (
                  <img 
                    src={profilePhoto} 
                    alt={username} 
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    color: '#c4b5fd',
                    background: '#1e1b4b',
                  }}>
                    {username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="item-overlay">
                <h3 className="item-title">{username}</h3>
                <p className="item-description">
                  {visitCount} Visits
                  {expertise && ` • ${expertise}`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 