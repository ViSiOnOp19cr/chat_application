import { Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, User, LogOut } from 'lucide-react';

export const Navigation = () => {
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/login';
    };

    return (
        <nav className="bg-gray-800 p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex space-x-4">
                    <Link
                        to="/"
                        className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                            location.pathname === '/' 
                                ? 'bg-gray-900 text-white' 
                                : 'text-gray-300 hover:bg-gray-700'
                        }`}
                    >
                        <HomeIcon className="w-5 h-5" />
                        <span>Home</span>
                    </Link>
                    <Link
                        to="/profile"
                        className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                            location.pathname === '/profile' 
                                ? 'bg-gray-900 text-white' 
                                : 'text-gray-300 hover:bg-gray-700'
                        }`}
                    >
                        <User className="w-5 h-5" />
                        <span>Profile</span>
                    </Link>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    );
}; 