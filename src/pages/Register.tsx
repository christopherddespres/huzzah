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
  Grid,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string>('');
  const [formData, setFormData] = React.useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    characterName: '',
    characterClass: '',
    characterRace: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        characterName: formData.characterName,
        characterClass: formData.characterClass,
        characterRace: formData.characterRace,
      });
      navigate('/');
    } catch (error) {
      setError('Registration failed. Please try again.');
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
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="characterName"
                label="Character Name"
                name="characterName"
                value={formData.characterName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="characterClass"
                label="Character Class"
                name="characterClass"
                value={formData.characterClass}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="characterRace"
                label="Character Race"
                name="characterRace"
                value={formData.characterRace}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link component={RouterLink} to="/login" variant="body2">
              {'Already have an account? Sign in'}
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Register; 