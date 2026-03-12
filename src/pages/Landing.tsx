import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const followerPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX - 6}px`;
        cursorRef.current.style.top = `${e.clientY - 6}px`;
      }
      
      // Parallax effect
      const cards = document.querySelectorAll('.fcard') as NodeListOf<HTMLElement>;
      const stickers = document.querySelectorAll('.sticker') as NodeListOf<HTMLElement>;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;

      cards.forEach((card, i) => {
        const depth = (i + 1) * 0.4;
        card.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });

      stickers.forEach((s, i) => {
        const depth = (i + 1) * 0.6;
        s.style.transform = `translate(${x * depth}px, ${y * depth}px) rotate(${x * 0.5}deg)`;
      });
    };

    const animateFollower = () => {
      followerPos.current.x += (mouseRef.current.x - followerPos.current.x) * 0.12;
      followerPos.current.y += (mouseRef.current.y - followerPos.current.y) * 0.12;
      
      if (followerRef.current) {
        followerRef.current.style.left = `${followerPos.current.x - 18}px`;
        followerRef.current.style.top = `${followerPos.current.y - 18}px`;
      }
      requestRef.current = requestAnimationFrame(animateFollower);
    };

    document.addEventListener('mousemove', handleMouseMove);
    requestRef.current = requestAnimationFrame(animateFollower);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const handleGetStarted = () => {
    navigate('/auth/register');
  };

  return (
    <div className="landing-page">
      <style>{`
        :root {
          --navy: #1C274C;
          --lime: #E1F18C;
          --blue: #71A6EE;
          --pink: #F0C6E4;
          --white: #FAFBFF;
          --navy-light: #2A3A6B;
        }

        .landing-page {
          background: var(--navy);
          color: var(--white);
          font-family: 'Cabinet Grotesk', sans-serif;
          overflow-x: hidden;
          cursor: none;
          min-height: 100vh;
          position: relative;
        }

        .cursor {
          width: 12px; height: 12px;
          background: var(--lime);
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          transition: transform 0.1s ease;
          mix-blend-mode: difference;
        }
        .cursor-follower {
          width: 36px; height: 36px;
          border: 1.5px solid var(--lime);
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 9998;
          transition: all 0.15s ease;
          opacity: 0.5;
        }

        .landing-page::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1000;
          opacity: 0.4;
        }

        nav {
          position: fixed;
          top: 24px; left: 50%;
          transform: translateX(-50%);
          z-index: 100;
          padding: 16px 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 100px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          width: max-content;
          max-width: 90vw;
        }

        .logo {
          font-family: 'Cabinet Grotesk', sans-serif;
          font-weight: 900;
          font-size: 20px;
          letter-spacing: -0.5px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .logo-dot {
          width: 8px; height: 8px;
          background: var(--lime);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .nav-links {
          display: flex;
          gap: 32px;
          list-style: none;
          font-size: 14px;
          font-weight: 500;
          opacity: 0.8;
        }
        .nav-links a { 
          color: inherit; 
          text-decoration: none; 
          transition: all 0.2s; 
          position: relative;
        }
        .nav-links a:hover { 
          opacity: 1; 
          color: var(--lime);
        }

        .nav-cta {
          background: var(--white);
          color: var(--navy);
          padding: 12px 28px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 14px;
          border: none;
          cursor: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
        }
        .nav-cta:hover {
          background: var(--lime);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(225, 241, 140, 0.3);
        }

        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 120px 60px 80px;
          position: relative;
          overflow: hidden;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          animation: float 8s ease-in-out infinite;
        }
        .orb-1 {
          width: 600px; height: 600px;
          background: var(--blue);
          top: -200px; right: -100px;
          animation-delay: 0s;
        }
        .orb-2 {
          width: 400px; height: 400px;
          background: var(--lime);
          bottom: -100px; left: -100px;
          animation-delay: -3s;
        }
        .orb-3 {
          width: 300px; height: 300px;
          background: var(--pink);
          top: 40%; left: 30%;
          animation-delay: -6s;
          opacity: 0.08;
        }

        .hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(113,166,238,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(113,166,238,0.05) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%);
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(225,241,140,0.1);
          border: 1px solid rgba(225,241,140,0.3);
          border-radius: 100px;
          padding: 6px 16px 6px 8px;
          font-size: 13px;
          font-weight: 500;
          color: var(--lime);
          margin-bottom: 32px;
          animation: fadeDown 0.8s ease both;
          position: relative;
          z-index: 10;
        }
        .badge-dot {
          width: 6px; height: 6px;
          background: var(--lime);
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }

        .headline {
          font-family: 'Cabinet Grotesk', sans-serif;
          font-weight: 900;
          font-size: clamp(52px, 8vw, 96px);
          line-height: 0.95;
          letter-spacing: -3px;
          text-align: center;
          position: relative;
          z-index: 10;
          animation: fadeUp 0.8s ease 0.1s both;
          max-width: 900px;
        }

        .headline .line-1 { display: block; color: var(--white); }
        .headline .line-2 {
          display: block;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.3);
          position: relative;
        }
        .headline .line-3 {
          display: block;
          background: linear-gradient(135deg, var(--lime), #B8E44F);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtext {
          font-size: 18px;
          font-weight: 400;
          color: rgba(255,255,255,0.5);
          text-align: center;
          max-width: 480px;
          line-height: 1.6;
          margin-top: 28px;
          position: relative;
          z-index: 10;
          animation: fadeUp 0.8s ease 0.2s both;
        }
        .subtext span { color: rgba(255,255,255,0.9); font-weight: 600; }

        .cta-group {
          display: flex;
          gap: 16px;
          margin-top: 40px;
          position: relative;
          z-index: 10;
          animation: fadeUp 0.8s ease 0.3s both;
        }

        .btn-primary {
          background: var(--lime);
          color: var(--navy);
          padding: 16px 36px;
          border-radius: 100px;
          font-weight: 900;
          font-size: 16px;
          border: none;
          cursor: none;
          transition: all 0.25s;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 0 0 0 rgba(225,241,140,0.4);
        }
        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 40px rgba(225,241,140,0.25), 0 0 0 4px rgba(225,241,140,0.15);
        }
        .btn-primary .arrow {
          width: 20px; height: 20px;
          background: var(--navy);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          transition: transform 0.2s;
        }
        .btn-primary:hover .arrow { transform: rotate(45deg); }

        .btn-secondary {
          background: transparent;
          color: var(--white);
          padding: 16px 36px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 16px;
          border: 1px solid rgba(255,255,255,0.15);
          cursor: none;
          transition: all 0.25s;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.3);
          transform: translateY(-3px);
        }
        .play-icon {
          width: 20px; height: 20px;
          border: 1.5px solid rgba(255,255,255,0.4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
        }

        .social-proof {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 32px;
          position: relative;
          z-index: 10;
          animation: fadeUp 0.8s ease 0.4s both;
          font-size: 13px;
          color: rgba(255,255,255,0.4);
        }
        .avatars {
          display: flex;
        }
        .avatar {
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 2px solid var(--navy);
          margin-left: -8px;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--navy-light);
        }
        .avatar:first-child { margin-left: 0; }
        .stars { color: var(--lime); letter-spacing: -1px; }

        .floating-cards {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 9;
        }

        .fcard {
          position: absolute;
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 14px 18px;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
          white-space: nowrap;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          animation: floatCard 6s ease-in-out infinite;
        }

        .fcard-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .fcard-text { display: flex; flex-direction: column; gap: 2px; }
        .fcard-label { font-size: 11px; font-weight: 500; opacity: 0.5; }
        .fcard-value { font-size: 14px; font-weight: 700; }

        .fcard-1 {
          top: 18%; left: 4%;
          animation-delay: 0s;
        }
        .fcard-1 .fcard-icon { background: rgba(113,166,238,0.2); }
        .fcard-1 .fcard-value { color: var(--blue); }

        .fcard-2 {
          top: 15%; right: 4%;
          animation-delay: -2s;
        }
        .fcard-2 .fcard-icon { background: rgba(225,241,140,0.15); }
        .fcard-2 .fcard-value { color: var(--lime); }

        .fcard-3 {
          bottom: 28%; left: 5%;
          animation-delay: -4s;
        }
        .fcard-3 .fcard-icon { background: rgba(240,198,228,0.2); }
        .fcard-3 .fcard-value { color: var(--pink); }

        .fcard-4 {
          bottom: 25%; right: 5%;
          animation-delay: -1s;
        }
        .fcard-4 .fcard-icon { background: rgba(225,241,140,0.15); }
        .fcard-4 .fcard-value { color: var(--lime); }

        .fcard-5 {
          top: 45%; right: 3%;
          animation-delay: -3s;
          border-color: rgba(225,241,140,0.2);
          background: rgba(225,241,140,0.05);
        }

        .sticker {
          position: absolute;
          font-size: 40px;
          animation: sticker-float 5s ease-in-out infinite;
          opacity: 0.8;
          pointer-events: none;
          z-index: 8;
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
        }
        .sticker-1 { top: 12%; left: 18%; animation-delay: 0s; font-size: 32px; }
        .sticker-2 { top: 20%; right: 20%; animation-delay: -2s; font-size: 28px; }
        .sticker-3 { bottom: 35%; left: 15%; animation-delay: -4s; font-size: 36px; }
        .sticker-4 { bottom: 30%; right: 16%; animation-delay: -1s; font-size: 30px; }

        .marquee-strip {
          position: absolute;
          bottom: 0;
          left: 0; right: 0;
          overflow: hidden;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 16px 0;
          background: rgba(255,255,255,0.02);
          z-index: 10;
        }

        .marquee-track {
          display: flex;
          gap: 0;
          animation: marquee 20s linear infinite;
          width: max-content;
        }

        .marquee-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 40px;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.5px;
          white-space: nowrap;
        }
        .marquee-item span { color: var(--lime); font-size: 16px; }

        .phone-container {
          position: relative;
          z-index: 10;
          margin-top: 60px;
          animation: fadeUp 0.8s ease 0.5s both;
        }

        .phone {
          width: 260px;
          height: 520px;
          background: linear-gradient(145deg, #2A3A6B, #1C274C);
          border-radius: 40px;
          border: 1.5px solid rgba(255,255,255,0.12);
          overflow: hidden;
          position: relative;
          box-shadow:
            0 40px 80px rgba(0,0,0,0.5),
            0 0 0 1px rgba(255,255,255,0.05),
            inset 0 1px 0 rgba(255,255,255,0.1);
        }

        .phone-notch {
          width: 80px;
          height: 24px;
          background: #0D1526;
          border-radius: 0 0 16px 16px;
          margin: 0 auto;
          position: relative;
          z-index: 5;
        }

        .phone-screen {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .phone-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .phone-loc {
          font-size: 11px;
          font-weight: 700;
          color: var(--lime);
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .phone-avatar {
          width: 28px; height: 28px;
          background: linear-gradient(135deg, var(--blue), var(--pink));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .phone-hero-card {
          background: linear-gradient(135deg, #FF6F00, #FF8F00);
          border-radius: 16px;
          padding: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .phone-hero-card .phc-title {
          font-size: 12px;
          font-weight: 800;
          line-height: 1.3;
          max-width: 120px;
        }
        .phone-hero-card .phc-emoji {
          font-size: 32px;
        }

        .phone-tabs {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        .phone-tab {
          background: rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 10px 6px;
          text-align: center;
          font-size: 9px;
          font-weight: 600;
          color: rgba(255,255,255,0.6);
          display: flex;
          flex-direction: column;
          gap: 4px;
          align-items: center;
        }
        .phone-tab .tab-icon { font-size: 18px; }
        .phone-tab.active { background: rgba(225,241,140,0.15); color: var(--lime); }

        .phone-section-title {
          font-size: 11px;
          font-weight: 800;
          opacity: 0.4;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .phone-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 12px;
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .pcard-img {
          width: 44px; height: 44px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--blue), #4A7FD4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
        }
        .pcard-info { flex: 1; }
        .pcard-name { font-size: 12px; font-weight: 700; margin-bottom: 3px; }
        .pcard-meta { font-size: 10px; color: rgba(255,255,255,0.4); }
        .pcard-price {
          font-size: 12px;
          font-weight: 800;
          color: var(--lime);
        }

        .match-card {
          background: rgba(225,241,140,0.08);
          border: 1px solid rgba(225,241,140,0.2);
          border-radius: 14px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .match-avatar {
          width: 38px; height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #E1F18C, #B8E44F);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .match-info { flex: 1; }
        .match-name { font-size: 11px; font-weight: 700; margin-bottom: 2px; }
        .match-state { font-size: 10px; color: var(--lime); font-weight: 600; }
        .match-pct {
          font-size: 16px;
          font-weight: 900;
          color: var(--lime);
        }

        .phone-glow {
          position: absolute;
          width: 300px;
          height: 300px;
          background: var(--blue);
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.15;
          bottom: -100px;
          left: 50%;
          transform: translateX(-50%);
        }

        .stats-row {
          display: flex;
          gap: 48px;
          margin-top: 48px;
          position: relative;
          z-index: 10;
          animation: fadeUp 0.8s ease 0.6s both;
        }
        .stat { text-align: center; }
        .stat-num {
          font-size: 32px;
          font-weight: 900;
          color: var(--lime);
          letter-spacing: -1px;
          line-height: 1;
        }
        .stat-label {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          font-weight: 500;
          margin-top: 4px;
        }
        .stat-divider {
          width: 1px;
          background: rgba(255,255,255,0.08);
        }

        .scroll-indicator {
          position: absolute;
          bottom: 80px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0.3;
          animation: fadeUp 1s ease 1s both;
          z-index: 10;
        }
        .scroll-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, transparent, var(--white));
          animation: scrollLine 2s ease-in-out infinite;
        }
        .scroll-text { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }
        @keyframes sticker-float {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes scrollLine {
          0% { opacity: 0; transform: scaleY(0); transform-origin: top; }
          50% { opacity: 1; transform: scaleY(1); }
          100% { opacity: 0; transform: scaleY(1); transform-origin: bottom; }
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 80px;
          align-items: center;
          max-width: 1200px;
          width: 100%;
          position: relative;
          z-index: 10;
        }

        .hero-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .hero-left .badge,
        .hero-left .headline,
        .hero-left .subtext { text-align: left; }
        .hero-left .headline { text-align: left; }

        .hero-right {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .ring-1 { width: 320px; height: 320px; }
        .ring-2 { width: 420px; height: 420px; border-color: rgba(225,241,140,0.05); }
        .ring-3 { width: 520px; height: 520px; animation: float 10s ease-in-out infinite; }

        @media (max-width: 768px) {
          .cursor, .cursor-follower { display: none !important; }
          nav { 
            top: 16px;
            padding: 12px 24px; 
            width: max-content;
          }
          .nav-links { display: none; }
          .hero { padding: 100px 20px 60px; overflow-x: hidden; min-height: auto; }
          .hero-content { grid-template-columns: 1fr; gap: 60px; text-align: center; }
          .hero-left { align-items: center; width: 100%; }
          .hero-left .badge, .hero-left .headline, .hero-left .subtext { text-align: center; }
          .headline { font-size: 42px; max-width: 100%; line-height: 1.1; }
          .subtext { font-size: 16px; margin-top: 24px; padding: 0 10px; }
          .cta-group { justify-content: center; flex-direction: column; width: 100%; gap: 16px; margin-top: 32px; }
          .btn-primary, .btn-secondary { width: 100%; justify-content: center; padding: 18px 24px; }
          .social-proof { justify-content: center; margin-top: 40px; }
          .stats-row { flex-wrap: wrap; justify-content: center; gap: 30px; margin-top: 50px; }
          .stat-divider { display: none; }
          .stat { width: 40%; }
          .phone-container { margin-top: 40px; transform: scale(0.95); }
          .floating-cards, .sticker { display: none; }
          .orb { opacity: 0.15; }
          .marquee-strip { width: 100%; margin-top: 40px; position: relative; }
          .hero-right { width: 100%; overflow: visible; padding-bottom: 40px; }
          .phone { margin: 0 auto; box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
          .ring { left: 50%; transform: translateX(-50%); }
          .scroll-indicator { display: none; }
        }
      `}</style>

      <div className="cursor" ref={cursorRef}></div>
      <div className="cursor-follower" ref={followerRef}></div>

      <nav>
        <div className="logo">
          <div className="logo-dot"></div>
          ShiftSaathi
        </div>
      </nav>

      <section className="hero">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>

        <div className="sticker sticker-1">🏠</div>
        <div className="sticker sticker-2">🗺️</div>
        <div className="sticker sticker-3">🍱</div>
        <div className="sticker sticker-4">🤝</div>

        <div className="floating-cards">
          <div className="fcard fcard-1">
            <div className="fcard-icon">🏠</div>
            <div className="fcard-text">
              <span className="fcard-label">PG Found Nearby</span>
              <span className="fcard-value">₹4,500 / month</span>
            </div>
          </div>

          <div className="fcard fcard-2">
            <div className="fcard-icon">🤝</div>
            <div className="fcard-text">
              <span className="fcard-label">Roommate Match</span>
              <span className="fcard-value">From Odisha • 94%</span>
            </div>
          </div>

          <div className="fcard fcard-3">
            <div className="fcard-icon">🍱</div>
            <div className="fcard-text">
              <span className="fcard-label">Mess Today</span>
              <span className="fcard-value">Dal Rice • ₹60</span>
            </div>
          </div>

          <div className="fcard fcard-4">
            <div className="fcard-icon">⭐</div>
            <div className="fcard-text">
              <span className="fcard-label">Verified Listing</span>
              <span className="fcard-value">4.8 Rating</span>
            </div>
          </div>

          <div className="fcard fcard-5">
            <div style={{ fontSize: '20px' }}>🎉</div>
            <div className="fcard-text">
              <span className="fcard-label">New Match!</span>
              <span className="fcard-value" style={{ color: 'var(--lime)' }}>Rohit from Cuttack</span>
            </div>
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-left">
            <div className="badge">
              <div className="badge-dot"></div>
              Now live in Bangalore & Bhubaneswar
            </div>

            <h1 className="headline">
              <span className="line-1">New City.</span>
              <span className="line-2">No Stress.</span>
              <span className="line-3">ShiftSaathi.</span>
            </h1>

            <p className="subtext">
              Find your <span>room, mess & roommate</span> from your own state — before you even land in the new city.
            </p>

            <div className="cta-group">
              <button className="btn-primary" onClick={handleGetStarted}>
                Start for Free
                <div className="arrow">→</div>
              </button>
              <button className="btn-secondary">
                <div className="play-icon">▶</div>
                See how it works
              </button>
            </div>

            <div className="social-proof">
              <div className="avatars">
                <div className="avatar">😊</div>
                <div className="avatar">🙂</div>
                <div className="avatar">😄</div>
                <div className="avatar">🤩</div>
                <div className="avatar">😎</div>
              </div>
              <div>
                <div className="stars">★★★★★</div>
                <span>Loved by <strong style={{ color: 'var(--white)' }}>12,000+</strong> students & freshers</span>
              </div>
            </div>

            <div className="stats-row">
              <div className="stat">
                <div className="stat-num">50K+</div>
                <div className="stat-label">Users Shifted</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <div className="stat-num">200+</div>
                <div className="stat-label">Cities</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <div className="stat-num">94%</div>
                <div className="stat-label">Match Rate</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <div className="stat-num">4.9★</div>
                <div className="stat-label">App Rating</div>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="ring ring-1"></div>
            <div className="ring ring-2"></div>
            <div className="ring ring-3"></div>
            <div className="phone-glow"></div>

            <div className="phone">
              <div className="phone-notch"></div>
              <div className="phone-screen">

                <div className="phone-header">
                  <div className="phone-loc">📍 Koramangala, Bangalore</div>
                  <div className="phone-avatar">👤</div>
                </div>

                <div className="phone-hero-card">
                  <div className="phc-title">Find Your State Mate 🤝</div>
                  <div className="phc-emoji">🗺️</div>
                </div>

                <div className="phone-tabs">
                  <div className="phone-tab active">
                    <span className="tab-icon">🏠</span>
                    Stay
                  </div>
                  <div className="phone-tab">
                    <span className="tab-icon">🍱</span>
                    Eat
                  </div>
                  <div className="phone-tab">
                    <span className="tab-icon">📦</span>
                    More
                  </div>
                  <div className="phone-tab">
                    <span className="tab-icon">👥</span>
                    Connect
                  </div>
                </div>

                <div className="phone-section-title">Nearby PGs</div>

                <div className="phone-card">
                  <div className="pcard-img">🏠</div>
                  <div className="pcard-info">
                    <div className="pcard-name">Sharma Boys PG</div>
                    <div className="pcard-meta">⭐ 4.3 · 0.3km · Food incl.</div>
                  </div>
                  <div className="pcard-price">₹4.5K</div>
                </div>

                <div className="phone-section-title">Roommate Match 🔥</div>

                <div className="match-card">
                  <div className="match-avatar">😊</div>
                  <div className="match-info">
                    <div className="match-name">Rohit Patra</div>
                    <div className="match-state">🗺️ From Cuttack, Odisha</div>
                  </div>
                  <div className="match-pct">94%</div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <span className="scroll-text">Scroll</span>
          <div className="scroll-line"></div>
        </div>

        <div className="marquee-strip">
          <div className="marquee-track">
            <div className="marquee-item"><span>🏠</span> PG Finder</div>
            <div className="marquee-item"><span>🤝</span> Roommate from Your State</div>
            <div className="marquee-item"><span>🍱</span> Daily Mess Menu</div>
            <div className="marquee-item"><span>🗺️</span> Origin-based Matching</div>
            <div className="marquee-item"><span>💼</span> For Freshers & Students</div>
            <div className="marquee-item"><span>🔄</span> Job Transfers Welcome</div>
            <div className="marquee-item"><span>🆘</span> Emergency Contacts</div>
            <div className="marquee-item"><span>⭐</span> Verified Listings Only</div>
            <div className="marquee-item"><span>🏠</span> PG Finder</div>
            <div className="marquee-item"><span>🤝</span> Roommate from Your State</div>
            <div className="marquee-item"><span>🍱</span> Daily Mess Menu</div>
            <div className="marquee-item"><span>🗺️</span> Origin-based Matching</div>
            <div className="marquee-item"><span>💼</span> For Freshers & Students</div>
            <div className="marquee-item"><span>🔄</span> Job Transfers Welcome</div>
            <div className="marquee-item"><span>🆘</span> Emergency Contacts</div>
            <div className="marquee-item"><span>⭐</span> Verified Listings Only</div>
          </div>
        </div>
      </section>
    </div>
  );
}
