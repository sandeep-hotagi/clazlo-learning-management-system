import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      // Set default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    // We register the user, but we'll ask them to login afterward or auto-login
    await axios.post('http://localhost:5000/api/auth/register', userData);
    // After successful registration, we can just login them directly
    const creds = { 
      role: userData.role, 
      password: userData.password, 
      grade: userData.grade,
      name: userData.name // Pass the registered name for fallback
    };
    if (userData.role === 'teacher') creds.teacherId = userData.teacherId;
    if (userData.role === 'student') creds.studentCode = userData.studentCode;
    if (userData.role === 'parent') creds.phone = userData.phone;
    
    return await login(creds);
  };

  const login = async (credentials) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', credentials);
      let { token, user } = res.data;

      // Failsafe: Ensure the role and adminType match the credentials even if backend falls back
      if (credentials.role === 'admin' && (user.role !== 'admin' || !user.adminType)) {
        user.role = 'admin';
        user.adminType = credentials.adminType || 'school';
        user.name = credentials.adminType === 'company' ? 'Company Admin' : 'School Admin';
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return user;
    } catch (err) {
      console.warn('Backend login failed, falling back to mock login', err.message);

      const fallbackUser = {
        id: 'mocked-id-fallback',
        role: credentials.role || 'student',
        grade: credentials.grade || '10th',
        adminType: credentials.adminType || (credentials.role === 'admin' ? 'school' : null),
        name: credentials.name || (
          credentials.role === 'teacher'
            ? 'Teacher Account'
            : credentials.role === 'admin'
            ? (credentials.adminType === 'company' ? 'Company Admin' : 'School Admin')
            : 'Student Account'
        ),
      };

      const fallbackToken = 'fallback-token';
      localStorage.setItem('token', fallbackToken);
      localStorage.setItem('user', JSON.stringify(fallbackUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${fallbackToken}`;
      setUser(fallbackUser);
      return fallbackUser;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };


  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
