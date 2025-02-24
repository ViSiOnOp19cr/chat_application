import { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';


import { Input } from '../ui/input';
import { Button } from '../ui/button';

const BACKEND_URL = "http://localhost:3000/api/v1";

export const Login = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        
        try {
            setError('');
            setLoading(true);

            const email = emailRef.current?.value;
            const password = passwordRef.current?.value;

            if (!email || !password) {
                setError('Please fill in all fields');
                return;
            }

            const response = await axios.post(`${BACKEND_URL}/login`, {
                email,
                password
            });
            console.log(response.data);

            const { token, userId } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        Sign in to your account
                    </h2>
                </div>
                <div className="mt-8 space-y-6">
                    {error && (
                        <div className="bg-red-500 text-white p-3 rounded-md text-center">
                            {error}
                        </div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <Input
                                placeholder="Email"
                                reference={emailRef as React.RefObject<HTMLInputElement>}

                                type="email"
                            />
                        </div>
                        <div>
                            <Input
                                placeholder="Password"
                                reference={passwordRef as React.RefObject<HTMLInputElement>}

                                type="password"
                            />
                        </div>
                    </div>

                    <div>
                        <Button
                            onClick={handleSubmit}
                            varient="primary"
                            text={loading ? "Signing in..." : "Sign in"}
                            size="lg"

                        />
                    </div>

                    <div className="text-center">
                        <p className="text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-blue-500 hover:text-blue-400">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};