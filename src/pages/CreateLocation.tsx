import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
} from '@mui/material';
import { locationsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Location } from '../types';

const locationTypes = ['Tavern', 'Dungeon', 'Castle', 'Temple', 'City', 'Wilderness'];
const worlds = ['Forgotten Realms', 'Eberron', 'Ravnica', 'Exandria', 'Custom'];

const CreateLocation: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '' as Location['type'],
    world: '',
    coordinates: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to create a location');
      return;
    }

    try {
      const locationData = {
        ...formData,
        coordinates: formData.coordinates ? {
          latitude: parseFloat(formData.coordinates.split(',')[0]),
          longitude: parseFloat(formData.coordinates.split(',')[1])
        } : undefined
      };

      await locationsApi.create(locationData);
      navigate('/locations');
    } catch (error) {
      setError('Failed to create location');
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
          Create New Location
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
                id="name"
                label="Location Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="description"
                label="Description"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                id="type"
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                {locationTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                id="world"
                label="World"
                name="world"
                value={formData.world}
                onChange={handleChange}
              >
                {worlds.map((world) => (
                  <MenuItem key={world} value={world}>
                    {world}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="coordinates"
                label="Coordinates (optional)"
                name="coordinates"
                value={formData.coordinates}
                onChange={handleChange}
                helperText="Format: X, Y, Z or any other coordinate system"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Create Location
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate('/locations')}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateLocation; 