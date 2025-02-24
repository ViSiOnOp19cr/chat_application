import { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

import { Input } from '../ui/input';
import { Button } from '../ui/button';

const BACKEND_URL = "http://localhost:3000/api/v1";

export const Signup = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const fullNameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            setError('');
            setLoading(true);

            const fullName = fullNameRef.current?.value;
            const email = emailRef.current?.value;
            const password = passwordRef.current?.value;

            // Validation
            if (!fullName || !email || !password) {
                setError('Please fill in all fields');
                return;
            }

            if (password.length < 6) {
                setError('Password must be at least 6 characters long');
                return;
            }

            if (!email.includes('@')) {
                setError('Please enter a valid email address');
                return;
            }

            await axios.post(`${BACKEND_URL}/signup`, {
                fullName,
                email,
                password
            });

            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Join our chat community
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <Input
                                placeholder="Full Name"
                                reference={fullNameRef as React.RefObject<HTMLInputElement>}

                                type="text"
                                onKeyPress={handleKeyPress}
                                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <Input
                                placeholder="Email Address"
                                reference={emailRef as React.RefObject<HTMLInputElement>}

                                type="email"
                                onKeyPress={handleKeyPress}
                                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <Input
                                placeholder="Password"
                                reference={passwordRef as React.RefObject<HTMLInputElement>}

                                type="text"
                                onKeyPress={handleKeyPress}
                                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <Button
                            onClick={handleSubmit}

                            varient="primary"
                            text={loading ? "Creating account..." : "Sign up"}
                            size="lg"

                        />
                    </div>

                    <div className="text-center">
                        <p className="text-gray-400">
                            Already have an account?{' '}
                            <Link 
                                to="/login" 
                                className="text-blue-500 hover:text-blue-400 transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-6">
                    <p className="text-xs text-center text-gray-400">
                        By signing up, you agree to our{' '}
                        <a href="#" className="text-blue-500 hover:text-blue-400">
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-blue-500 hover:text-blue-400">
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};