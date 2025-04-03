import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
} from '@mui/material';
import { locationsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CreateLocationInput } from '../types';

const locationTypes = ['Tavern', 'Dungeon', 'Castle', 'Temple', 'City', 'Wilderness'];

const CreateLocation: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<CreateLocationInput>({
    name: '',
    description: '',
    type: 'Tavern',
    world: '',
    coordinates: undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to create a location');
      return;
    }

    try {
      const locationData: CreateLocationInput = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        world: formData.world,
        coordinates: formData.coordinates,
      };

      await locationsApi.create(locationData);
      navigate('/locations');
    } catch (error) {
      setError('Failed to create location');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Location
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              select
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
              label="World"
              name="world"
              value={formData.world}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Coordinates (latitude,longitude)"
              name="coordinates"
              value={formData.coordinates ? `${formData.coordinates.latitude},${formData.coordinates.longitude}` : ''}
              onChange={(e) => {
                const [lat, lon] = e.target.value.split(',');
                if (lat && lon) {
                  setFormData((prev) => ({
                    ...prev,
                    coordinates: {
                      latitude: parseFloat(lat),
                      longitude: parseFloat(lon),
                    },
                  }));
                } else {
                  setFormData((prev) => ({
                    ...prev,
                    coordinates: undefined,
                  }));
                }
              }}
              helperText="Optional. Format: latitude,longitude"
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Create Location
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default CreateLocation; 