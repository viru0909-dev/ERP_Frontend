import React, { useState, useEffect } from 'react';
import { ChevronRight, Users, BookOpen, BarChart3, Shield, Zap, Globe, ArrowRight, Play, Star, Award, Target, TrendingUp, CheckCircle } from 'lucide-react';
import '../styles/LandingPage.css';


const LandingPage = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentStatistic, setCurrentStatistic] = useState(0);

    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setCurrentStatistic((prev) => (prev + 1) % 4);
        }, 3000);
        
        return () => clearInterval(interval);
    }, []);

    const statistics = [
        { name: 'Active Students', value: '25,439', icon: Users, color: '#3b82f6' },
        { name: 'Course Programs', value: '1,847', icon: BookOpen, color: '#10b981' },
        { name: 'Success Rate', value: '99.9%', icon: TrendingUp, color: '#f59e0b' },
        { name: 'Security Score', value: 'A+', icon: Shield, color: '#8b5cf6' }
    ];

    const features = [
        {
            icon: Users,
            title: "Student Management",
            description: "Comprehensive student profiles with real-time attendance tracking and academic progress monitoring",
            highlight: "AI-Powered Insights"
        },
        {
            icon: BookOpen,
            title: "Academic Excellence", 
            description: "Complete curriculum management with intelligent grade tracking and performance analytics",
            highlight: "Smart Automation"
        },
        {
            icon: BarChart3,
            title: "Predictive Analytics",
            description: "Advanced ML algorithms identify at-risk students before they struggle, enabling proactive intervention",
            highlight: "Early Warning System"
        },
        {
            icon: Shield,
            title: "Enterprise Security",
            description: "Bank-level security with role-based access control and comprehensive audit trails",
            highlight: "99.9% Uptime"
        },
        {
            icon: Zap,
            title: "Lightning Fast",
            description: "Optimized performance with real-time updates and seamless user experience",
            highlight: "Sub-second Response"
        },
        {
            icon: Globe,
            title: "Cloud-First Architecture",
            description: "Scalable infrastructure built on modern cloud technologies for maximum reliability",
            highlight: "Auto-scaling"
        }
    ];

    const benefits = [
        "Reduce administrative workload by 80%",
        "Improve student retention rates significantly", 
        "Enable data-driven decision making",
        "Ensure regulatory compliance automatically",
        "Provide 24/7 accessibility for all stakeholders"
    ];

    return (
        <div className="landing-container">
            {/* Enhanced Background Effects */}
            <div className="background-overlay"></div>
            <div className="grid-pattern"></div>
            
            {/* Subtle Floating Particles */}
            {[...Array(8)].map((_, i) => (
                <div
                    key={i}
                    className="particle"
                    style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${4 + Math.random() * 2}s`
                    }}
                />
            ))}

            {/* Statistics Cards */}
            {statistics.map((stat, index) => (
                <div
                    key={index}
                    className="floating-element"
                    style={{
                        top: index === 0 ? '15%' : index === 1 ? '25%' : 'auto',
                        bottom: index >= 2 ? '25%' : 'auto',
                        left: index % 2 === 0 ? '5%' : 'auto',
                        right: index % 2 === 1 ? '5%' : 'auto',
                        opacity: currentStatistic === index ? 1 : 0.7,
                        transform: currentStatistic === index ? 'scale(1.05)' : 'scale(1)'
                    }}
                >
                    <div className="floating-card">
                        <div className="floating-card-content">
                            <div className="floating-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                                <stat.icon size={20} />
                            </div>
                            <div>
                                <div className="floating-value">{stat.value}</div>
                                <div className="floating-label">{stat.name}</div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation */}
            <nav className="navbar">
                <div className="logo">
                    <div className="logo-icon">
                        <BookOpen size={20} />
                    </div>
                    <span className="logo-text">SmartCampus ERP</span>
                </div>
                
                <div className="nav-links">
                    <a href="#features" className="nav-link">Features</a>
                    <a href="#solutions" className="nav-link">Solutions</a>
                    <a href="#about" className="nav-link">About</a>
                    <a href="#contact" className="nav-link">Contact</a>
                </div>
                
                <a href="/login" className="nav-cta">Login Portal</a>
            </nav>

            {/* Hero Section */}
            <div className="hero-container">
                <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
                    
                    {/* Innovation Badge */}
                    <div className="hero-badge">
                        <Award className="badge-icon" />
                        SIH 2025 Innovation - Transforming Education Technology
                    </div>

                    {/* Main Heading */}
                    <h1 className="hero-title">
                        <span className="title-line1">Smart Campus ERP</span>
                        <span className="title-gradient">for Academic Excellence</span>
                    </h1>

                    {/* Enhanced Subtitle */}
                    <p className="hero-subtitle">
                        Experience the future of educational management with our AI-powered ERP platform. 
                        Streamline operations, boost student success, and make data-driven decisions with confidence.
                    </p>

                    {/* Value Proposition */}
                    <div className="value-props">
                        {benefits.slice(0, 3).map((benefit, index) => (
                            <div key={index} className="value-prop">
                                <CheckCircle size={16} className="value-check" />
                                <span>{benefit}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="cta-container">
                        <a href="/admissions" className="cta-button cta-primary">
                            <span>Apply for Admission</span>
                            <ArrowRight className="arrow-icon" />
                        </a>
                        
                        <a href="/login" className="cta-button cta-secondary">
                            <div className="play-button">
                                <Play size={18} />
                            </div>
                            <span>Access Portal</span>
                        </a>
                    </div>

                    {/* Track Application Link */}
                    <div className="track-link-container">
                        <a href="/track-application" className="track-link">
                            <span className="track-underline">
                                Track your application status
                            </span>
                            <ArrowRight size={14} />
                        </a>
                    </div>

                    {/* Features Grid */}
                    <div className="features-grid" id="features">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="feature-header">
                                    <div className="feature-icon">
                                        <feature.icon size={24} />
                                    </div>
                                    <div className="feature-highlight">{feature.highlight}</div>
                                </div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="scroll-indicator">
                    <div className="scroll-mouse">
                        <div className="scroll-dot" />
                    </div>
                    <p className="scroll-text">Explore Features</p>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <div className="footer-logo">
                            <div className="logo-icon">
                                <BookOpen size={20} />
                            </div>
                            <span>SmartCampus ERP</span>
                        </div>
                        <p className="footer-desc">
                            Empowering educational institutions with intelligent technology solutions.
                        </p>
                    </div>
                    
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <div className="footer-links">
                            <a href="/admissions">Admissions</a>
                            <a href="/login">Portal Login</a>
                            <a href="/track-application">Track Application</a>
                            <a href="#contact">Contact</a>
                        </div>
                    </div>
                    
                    <div className="footer-section">
                        <h4>Support</h4>
                        <div className="footer-links">
                            <a href="mailto:gadekarvirendra4@sih.com">gadekarvirendra4@sih.com</a>
                            <a href="#help">Help Center</a>
                            <a href="#documentation">Documentation</a>
                        </div>
                    </div>
                </div>
                
                <div className="footer-bottom">
                    <div className="footer-bottom-content">
                        <p>&copy; 2025 SmartCampus ERP. All rights reserved.</p>
                        <p className="footer-license">
                            Developed by <strong>Desert Coder Group</strong> | Licensed under MIT License
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;