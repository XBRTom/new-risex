'use client';

import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  pulsePhase: number;
}

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  sourceNodeIndex: number;
  targetNodeIndex: number;
  progress: number;
  speed: number;
  life: number;
  maxLife: number;
  opacity: number;
  size: number;
}

const DeFiNetworkBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize nodes (representing liquidity pools)
    const initNodes = () => {
      nodesRef.current = [];
      for (let i = 0; i < 60; i++) {
        nodesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.2, // Slower movement for more nodes
          vy: (Math.random() - 0.5) * 0.2,
          radius: Math.random() * 5 + 3, // Slightly smaller nodes
          opacity: Math.random() * 0.6 + 0.4,
          pulsePhase: Math.random() * Math.PI * 2
        });
      }
    };

    // Initialize particles (representing liquidity flows)
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 80; i++) {
        const sourceIndex = Math.floor(Math.random() * nodesRef.current.length);
        let targetIndex = Math.floor(Math.random() * nodesRef.current.length);
        while (targetIndex === sourceIndex && nodesRef.current.length > 1) {
          targetIndex = Math.floor(Math.random() * nodesRef.current.length);
        }
        
        const sourceNode = nodesRef.current[sourceIndex];
        const targetNode = nodesRef.current[targetIndex];
        
        // Different speeds for different types of liquidity flows
        const speedVariation = Math.random();
        let speed, size, opacity;
        
        if (speedVariation < 0.3) {
          // Fast transactions (arbitrage, MEV)
          speed = 0.025 + Math.random() * 0.015;
          size = 1.5 + Math.random() * 0.5;
          opacity = 0.9;
        } else if (speedVariation < 0.7) {
          // Normal liquidity flows
          speed = 0.012 + Math.random() * 0.008;
          size = 1.8 + Math.random() * 0.7;
          opacity = 0.7;
        } else {
          // Large liquidity movements (slower but bigger)
          speed = 0.005 + Math.random() * 0.007;
          size = 2.5 + Math.random() * 1;
          opacity = 0.8;
        }
        
        particlesRef.current.push({
          x: sourceNode?.x || Math.random() * canvas.width,
          y: sourceNode?.y || Math.random() * canvas.height,
          targetX: targetNode?.x || Math.random() * canvas.width,
          targetY: targetNode?.y || Math.random() * canvas.height,
          sourceNodeIndex: sourceIndex,
          targetNodeIndex: targetIndex,
          progress: 0,
          speed: speed,
          life: Math.random() * 250 + 150,
          maxLife: 400,
          opacity: opacity,
          size: size
        });
      }
    };

    initNodes();
    initParticles();

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.001;

      // Update and draw nodes
      nodesRef.current.forEach((node, index) => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Boundary conditions with bounce
        if (node.x <= node.radius || node.x >= canvas.width - node.radius) {
          node.vx *= -1;
          node.x = Math.max(node.radius, Math.min(canvas.width - node.radius, node.x));
        }
        if (node.y <= node.radius || node.y >= canvas.height - node.radius) {
          node.vy *= -1;
          node.y = Math.max(node.radius, Math.min(canvas.height - node.radius, node.y));
        }

        // Update pulse phase
        node.pulsePhase += 0.02;
        const pulse = Math.sin(node.pulsePhase) * 0.3 + 0.7;

        // Draw node with glow
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.radius * 2
        );
        gradient.addColorStop(0, `rgba(59, 130, 246, ${node.opacity * pulse})`);
        gradient.addColorStop(0.5, `rgba(37, 99, 235, ${node.opacity * pulse * 0.5})`);
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections to nearby nodes
        nodesRef.current.slice(index + 1).forEach(otherNode => {
          const dx = otherNode.x - node.x;
          const dy = otherNode.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 100; // Slightly shorter connections for more nodes

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.3;
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.stroke();
          }
        });
      });

      // Update and draw particles (liquidity flows)
      particlesRef.current.forEach((particle, index) => {
        // Update progress along path from source to target node
        particle.progress += particle.speed; // Variable speed based on particle type
        particle.life--;

        // Get current source and target nodes
        const sourceNode = nodesRef.current[particle.sourceNodeIndex];
        const targetNode = nodesRef.current[particle.targetNodeIndex];

        if (sourceNode && targetNode) {
          // Update target position as nodes move
          particle.targetX = targetNode.x;
          particle.targetY = targetNode.y;
          
          // Interpolate position between source and target
          const t = Math.min(particle.progress, 1);
          particle.x = sourceNode.x + (particle.targetX - sourceNode.x) * t;
          particle.y = sourceNode.y + (particle.targetY - sourceNode.y) * t;
        }

        // Remove particles that reached target or died, create new ones
        if (particle.progress >= 1 || particle.life <= 0) {
          const sourceIndex = Math.floor(Math.random() * nodesRef.current.length);
          let targetIndex = Math.floor(Math.random() * nodesRef.current.length);
          while (targetIndex === sourceIndex && nodesRef.current.length > 1) {
            targetIndex = Math.floor(Math.random() * nodesRef.current.length);
          }
          
          const newSourceNode = nodesRef.current[sourceIndex];
          const newTargetNode = nodesRef.current[targetIndex];
          
          // Create new particle with random liquidity flow characteristics
          const speedVariation = Math.random();
          let speed, size, opacity;
          
          if (speedVariation < 0.3) {
            // Fast transactions (arbitrage, MEV)
            speed = 0.025 + Math.random() * 0.015;
            size = 1.5 + Math.random() * 0.5;
            opacity = 0.9;
          } else if (speedVariation < 0.7) {
            // Normal liquidity flows
            speed = 0.012 + Math.random() * 0.008;
            size = 1.8 + Math.random() * 0.7;
            opacity = 0.7;
          } else {
            // Large liquidity movements (slower but bigger)
            speed = 0.005 + Math.random() * 0.007;
            size = 2.5 + Math.random() * 1;
            opacity = 0.8;
          }
          
          particlesRef.current[index] = {
            x: newSourceNode?.x || Math.random() * canvas.width,
            y: newSourceNode?.y || Math.random() * canvas.height,
            targetX: newTargetNode?.x || Math.random() * canvas.width,
            targetY: newTargetNode?.y || Math.random() * canvas.height,
            sourceNodeIndex: sourceIndex,
            targetNodeIndex: targetIndex,
            progress: 0,
            speed: speed,
            life: Math.random() * 250 + 150,
            maxLife: 400,
            opacity: opacity,
            size: size
          };
        } else {
          // Draw particle with variable colors based on speed/size (representing different liquidity types)
          const alpha = (particle.life / particle.maxLife) * particle.opacity * (1 - particle.progress * 0.2);
          
          // Different colors for different liquidity flow types
          let color1, color2;
          if (particle.speed > 0.03) {
            // Fast flows - bright blue (arbitrage/MEV)
            color1 = `rgba(59, 130, 246, ${alpha})`;
            color2 = `rgba(29, 78, 216, ${alpha * 0.5})`;
          } else if (particle.size > 2.8) {
            // Large flows - cyan (big liquidity movements)
            color1 = `rgba(34, 211, 238, ${alpha})`;
            color2 = `rgba(8, 145, 178, ${alpha * 0.5})`;
          } else {
            // Normal flows - standard blue
            color1 = `rgba(59, 130, 246, ${alpha})`;
            color2 = `rgba(37, 99, 235, ${alpha * 0.5})`;
          }
          
          // Create a glow effect with variable size
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 1.5
          );
          gradient.addColorStop(0, color1);
          gradient.addColorStop(0.7, color2);
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)' }}
    />
  );
};

export default DeFiNetworkBackground;
