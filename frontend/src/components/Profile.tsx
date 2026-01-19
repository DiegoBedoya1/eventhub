import React, { useEffect, useState } from 'react';

interface User {
  name: string;
  email: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data);
          } else {
            setError('Failed to fetch user data.');
          }
        } catch (error) {
          setError('An error occurred while fetching user data.');
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Profile</h2>
        {user ? (
          <div>
            <p className="text-sm font-medium text-gray-700">Name:</p>
            <p className="mt-1 text-sm text-gray-900">{user.name}</p>
            <p className="mt-4 text-sm font-medium text-gray-700">Email:</p>
            <p className="mt-1 text-sm text-gray-900">{user.email}</p>
          </div>
        ) : (
          <p className="text-center text-gray-500">{error || 'Loading...'}</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
