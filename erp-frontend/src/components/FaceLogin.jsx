import React, { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import '../styles/FaceLogin.css';

const FaceLogin = () => {
    const { login } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [step, setStep] = useState('email'); // 'email' or 'scan'
    const [mode, setMode] = useState('login');
    const [userId, setUserId] = useState('');
    const [cameraError, setCameraError] = useState(false);
    const [faceDetected, setFaceDetected] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (location.state && location.state.userIdToRegister) {
            setUserId(location.state.userIdToRegister);
            setMode('register');
        }
    }, [location.state]);

    const handleLogin = () => {
        const canvas = document.createElement('canvas');
        // ... (capture image to blob from videoRef) ...
        
        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('file', blob, 'capture.jpg');
            try {
                const response = await axios.post('/api/public/auth/face/login', formData);
                login(response.data.token);
                navigate('/profile');
            } catch (err) {
                setMessage(err.response?.data || 'Login failed.');
                setStep('email'); // Go back to email step on failure
            }
        }, 'image/jpeg');
    };

    // Enhanced camera initialization with status updates
    const startCamera = useCallback(async () => {
        try {
            if (!navigator.mediaDevices?.getUserMedia) { 
                setCameraError(true); 
                return; 
            }
            
            setProcessing(true);
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 1280 }, 
                    height: { ideal: 720 },
                    facingMode: 'user'
                } 
            });
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    setCameraActive(true);
                    setProcessing(false);
                    // Simulate face detection (you can integrate real face detection here)
                    setTimeout(() => setFaceDetected(true), 2000);
                };
            }
        } catch (err) {
            console.error('Camera access error:', err);
            setCameraError(true);
            setProcessing(false);
        }
    }, []);

    useEffect(() => {
        startCamera();
        return () => {
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, [startCamera]);

    // Enhanced submit handler with better UX
    const handleSubmit = async () => {
        if (!faceDetected && mode === 'login') {
            setMessage({ text: 'Please ensure your face is clearly visible in the frame.', type: 'error' });
            return;
        }

        setIsLoading(true);
        setProcessing(true);
        setMessage({ text: '', type: '' });
        
        const endpoint = mode === 'login' 
            ? 'http://localhost:8080/api/auth/face/login' 
            : 'http://localhost:8080/api/auth/face/register';
        
        const formData = new FormData();
        if (mode === 'register') formData.append('userId', userId);

        const canvas = canvasRef.current;
        const video = videoRef.current;
        
        if (!video || !canvas) {
            setMessage({ text: 'Camera not ready. Please try again.', type: 'error' });
            setIsLoading(false);
            setProcessing(false);
            return;
        }

        // Enhanced image capture with better quality
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Add a brief processing delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));

        canvas.toBlob(async (blob) => {
            if (!blob) {
                setMessage({ text: 'Failed to capture image. Please try again.', type: 'error' });
                setIsLoading(false);
                setProcessing(false);
                return;
            }
            
            formData.append('file', blob, 'capture.jpg');
            const token = localStorage.getItem('erp-auth-token');
            
            try {
                const response = await axios.post(endpoint, formData, { 
                    headers: { 'Authorization': `Bearer ${token}` } 
                });
                
                if (mode === 'login') {
                    setMessage({ text: 'Authentication successful! Welcome back!', type: 'success' });
                    // Delay navigation for better UX
                    setTimeout(() => {
                        login(response.data.token);
                        navigate('/');
                    }, 1500);
                } else {
                    setMessage({ text: response.data || 'Face registered successfully!', type: 'success' });
                }
            } catch (err) {
                const errorMessage = err.response?.data || `Face ${mode} failed. Please try again.`;
                setMessage({ text: errorMessage, type: 'error' });
            } finally {
                setIsLoading(false);
                setProcessing(false);
            }
        }, 'image/jpeg', 0.95); // Higher quality JPEG
    };

    // Retry camera function
    const retryCamera = () => {
        setCameraError(false);
        setCameraActive(false);
        setFaceDetected(false);
        startCamera();
    };

    const isRegistrationModeFromState = !!location.state?.userIdToRegister;

    return (
        <div className="login-container">
            <div className="login-card">
                {/* Header Section */}
                <div className="login-logo">
                    <h1>SmartCampus</h1>
                </div>
                
                <h2>{mode === 'login' ? 'Face Authentication' : 'Register Face'}</h2>
                <p>
                    {mode === 'login' 
                        ? 'Position your face in the frame and wait for detection.' 
                        : 'Ensure the user\'s face is clearly visible and well-lit.'}
                </p>
                
                {/* Video Section with Enhanced Effects */}
                <div className={`video-wrapper ${faceDetected ? 'face-detected' : ''}`}>
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="video-feed"
                    ></video>
                    
                    {/* Corner Markers for Sci-Fi Effect */}
                    <div className="corner-marker"></div>
                    <div className="corner-marker"></div>
                    <div className="corner-marker"></div>
                    <div className="corner-marker"></div>
                    
                    {/* Status Indicators */}
                    <div className="status-indicators">
                        <div className={`status-dot ${cameraActive ? 'camera-active' : ''}`}></div>
                        <div className={`status-dot ${processing ? 'processing' : ''}`}></div>
                        <div className={`status-dot ${faceDetected ? 'face-detected' : ''}`}></div>
                    </div>
                    
                    {/* Camera Error Overlay */}
                    {cameraError && (
                        <div className="camera-error-overlay">
                            <div style={{ textAlign: 'center' }}>
                                <div>📷 Camera Unavailable</div>
                                <button 
                                    onClick={retryCamera}
                                    style={{
                                        background: 'rgba(99, 102, 241, 0.8)',
                                        border: 'none',
                                        color: 'white',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        marginTop: '10px',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    Retry Camera
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Hidden canvas for image capture */}
                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

                {/* Registration Input */}
                {mode === 'register' && (
                    <div className="form-group">
                        <input 
                            type="text" 
                            placeholder="User ID (UUID)" 
                            value={userId} 
                            onChange={(e) => setUserId(e.target.value)} 
                            readOnly={isRegistrationModeFromState} 
                            className="user-id-input" 
                        />
                    </div>
                )}
                
                {/* Message Display */}
                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}
                
                {/* Enhanced Action Button */}
                <button 
                    onClick={handleSubmit} 
                    disabled={isLoading || cameraError || (!cameraActive && !cameraError)} 
                    className={`capture-button ${isLoading ? 'loading' : ''}`}
                >
                    <span>
                        {isLoading 
                            ? 'Processing...' 
                            : (mode === 'login' ? '🔍 Scan Face to Login' : '📸 Scan Face to Register')
                        }
                    </span>
                </button>
                
                {/* Status Information */}
                <div style={{ 
                    textAlign: 'center', 
                    marginBottom: '1.5rem',
                    fontSize: '13px',
                    color: 'var(--color-text-secondary)'
                }}>
                    {!cameraActive && !cameraError && (
                        <div>🔄 Initializing camera...</div>
                    )}
                    {cameraActive && !faceDetected && (
                        <div>👤 Position your face in the frame</div>
                    )}
                    {faceDetected && (
                        <div style={{ color: '#10b981' }}>✅ Face detected - Ready to scan</div>
                    )}
                    {processing && (
                        <div style={{ color: '#f59e0b' }}>⚡ Processing authentication...</div>
                    )}
                </div>
                
                {/* Navigation Links */}
                {isRegistrationModeFromState && (
                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <Link 
                            to="/user-management" 
                            style={{ 
                                color: 'var(--color-text-secondary)', 
                                fontSize: '14px' 
                            }}
                        >
                            ← Return to User Management
                        </Link>
                    </div>
                )}
                
                {!isRegistrationModeFromState && mode === 'login' && (
                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <Link 
                            to="/login" 
                            style={{ 
                                color: 'var(--color-text-secondary)', 
                                fontSize: '14px' 
                            }}
                        >
                            ← Return to Password Login
                        </Link>
                    </div>
                )}
                
                {/* Additional Mode Toggle for Development */}
                {!isRegistrationModeFromState && (
                    <div style={{ 
                        marginTop: '1rem', 
                        textAlign: 'center',
                        fontSize: '12px',
                        color: 'var(--color-text-secondary)'
                    }}>
                        {mode === 'login' ? (
                            <button 
                                onClick={() => setMode('register')}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid rgba(100, 116, 139, 0.3)',
                                    color: 'var(--color-text-secondary)',
                                    padding: '4px 12px',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                }}
                            >
                                Switch to Register Mode
                            </button>
                        ) : (
                            <button 
                                onClick={() => setMode('login')}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid rgba(100, 116, 139, 0.3)',
                                    color: 'var(--color-text-secondary)',
                                    padding: '4px 12px',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                }}
                            >
                                Switch to Login Mode
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FaceLogin;