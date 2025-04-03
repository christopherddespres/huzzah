import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string>('');
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          component="h1"
          variant="h3"
          sx={{ fontFamily: '"MedievalSharp", cursive' }}
        >
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link component={RouterLink} to="/register" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login; 