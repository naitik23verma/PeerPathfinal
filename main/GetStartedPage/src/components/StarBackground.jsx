import React, { useEffect, useRef, useState } from 'react';
import './StarBackground.css';

const StarBackground = () => {
  const canvasRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Scroll detection
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Hide stars when scrolling down more than 50% of viewport height
      if (scrollY > windowHeight * 0.5) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Enhanced Star class with different types
    class Star {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 0.8 + 0.15; // Further reduced size range
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.1; // Reduced opacity
        this.twinkleSpeed = Math.random() * 0.015 + 0.005;
        this.twinkleDirection = 1;
        this.type = Math.random() < 0.1 ? 'shooting' : Math.random() < 0.2 ? 'bright' : 'normal';
        this.color = this.getStarColor();
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.03 + 0.01;
      }

      getStarColor() {
        const colors = [
          '#ffffff', // White
          '#f0f8ff', // Alice blue
          '#e6f3ff', // Light blue
          '#fff8dc', // Cornsilk
          '#f0f0f0', // Light gray
          '#ffd700', // Gold (for bright stars)
          '#87ceeb', // Sky blue
          '#dda0dd', // Plum
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        // Move star
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        this.pulsePhase += this.pulseSpeed;

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Twinkle effect
        this.opacity += this.twinkleSpeed * this.twinkleDirection;
        if (this.opacity > 0.4 || this.opacity < 0.1) { // Reduced max opacity
          this.twinkleDirection *= -1;
        }
      }

      draw() {
        if (!isVisible) return; // Don't draw if not visible
        
        ctx.save();
        ctx.globalAlpha = this.opacity * 0.6; // Further reduce overall opacity
        
        if (this.type === 'shooting') {
          this.drawShootingStar();
        } else if (this.type === 'bright') {
          this.drawBrightStar();
        } else {
          this.drawNormalStar();
        }
        
        ctx.restore();
      }

      drawNormalStar() {
        // Main star
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 6; // Reduced blur
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle glow
        ctx.shadowBlur = 10; // Reduced blur
        ctx.globalAlpha = this.opacity * 0.2; // Reduced glow opacity
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      drawBrightStar() {
        // Bright star with cross pattern
        const pulse = Math.sin(this.pulsePhase) * 0.3 + 1;
        const size = this.size * pulse;

        // Outer glow
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 12; // Reduced blur
        ctx.globalAlpha = this.opacity * 0.15; // Reduced glow opacity
        ctx.beginPath();
        ctx.arc(this.x, this.y, size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Main star
        ctx.globalAlpha = this.opacity * 0.6; // Reduced main star opacity
        ctx.shadowBlur = 8; // Reduced blur
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Cross pattern
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 0.8; // Reduced line width
        ctx.globalAlpha = this.opacity * 0.4; // Reduced cross opacity
        ctx.beginPath();
        ctx.moveTo(this.x - size * 2, this.y);
        ctx.lineTo(this.x + size * 2, this.y);
        ctx.moveTo(this.x, this.y - size * 2);
        ctx.lineTo(this.x, this.y + size * 2);
        ctx.stroke();
      }

      drawShootingStar() {
        // Shooting star trail
        const trailLength = 25; // Reduced trail length
        const gradient = ctx.createLinearGradient(
          this.x, this.y, 
          this.x - this.speedX * trailLength, this.y - this.speedY * trailLength
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1; // Reduced line width
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.speedX * trailLength, this.y - this.speedY * trailLength);
        ctx.stroke();

        // Shooting star head
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8; // Reduced blur
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 1.1, 0, Math.PI * 2); // Reduced head size
        ctx.fill();
      }
    }

    // Create stars with different densities
    const stars = [];
    const numStars = Math.min(150, Math.floor((canvas.width * canvas.height) / 6000)); // Reduced star count
    
    for (let i = 0; i < numStars; i++) {
      stars.push(new Star());
    }

    // Add occasional shooting stars
    let shootingStarTimer = 0;
    const shootingStarInterval = 5000; // Increased interval (5 seconds)

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Enhanced gradient background with reduced opacity
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      );
      gradient.addColorStop(0, 'rgba(26, 10, 82, 0.1)'); // Even darker
      gradient.addColorStop(0.5, 'rgba(5, 5, 5, 0.05)'); // Much darker
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.02)'); // Very dark
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add subtle nebula effect with reduced opacity
      const time = Date.now() * 0.001;
      const nebulaGradient = ctx.createRadialGradient(
        canvas.width * 0.3 + Math.sin(time * 0.1) * 100,
        canvas.height * 0.7 + Math.cos(time * 0.1) * 100,
        0,
        canvas.width * 0.3 + Math.sin(time * 0.1) * 100,
        canvas.height * 0.7 + Math.cos(time * 0.1) * 100,
        200
      );
      nebulaGradient.addColorStop(0, 'rgba(120, 119, 198, 0.02)'); // Even more reduced opacity
      nebulaGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = nebulaGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw stars
      stars.forEach(star => {
        star.update();
        star.draw();
      });

      // Add occasional shooting stars
      shootingStarTimer += 16; // Assuming 60fps
      if (shootingStarTimer > shootingStarInterval && isVisible) {
        const shootingStar = new Star();
        shootingStar.type = 'shooting';
        shootingStar.x = Math.random() * canvas.width;
        shootingStar.y = Math.random() * canvas.height;
        shootingStar.speedX = (Math.random() - 0.5) * 1.5; // Reduced speed
        shootingStar.speedY = (Math.random() - 0.5) * 1.5; // Reduced speed
        shootingStar.size = Math.random() * 1 + 0.5; // Reduced size
        stars.push(shootingStar);
        shootingStarTimer = 0;
      }

      // Remove old shooting stars
      for (let i = stars.length - 1; i >= 0; i--) {
        if (stars[i].type === 'shooting' && 
            (stars[i].x < -100 || stars[i].x > canvas.width + 100 || 
             stars[i].y < -100 || stars[i].y > canvas.height + 100)) {
          stars.splice(i, 1);
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible]);

  return (
    <canvas
      ref={canvasRef}
      className={`star-background ${isVisible ? 'visible' : 'hidden'}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out'
      }}
    />
  );
};

export default StarBackground; 