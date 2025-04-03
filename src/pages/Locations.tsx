import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  MenuItem,
  Box,
  Rating,
  Button,
  Chip,
} from '@mui/material';
import { Location } from '../types';
import { locationsApi } from '../services/api';

const Locations: React.FC = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [worldFilter, setWorldFilter] = useState<string>('');

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await locationsApi.getAll();
        setLocations(data);
        setFilteredLocations(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    let filtered = locations;

    if (searchTerm) {
      filtered = filtered.filter(
        (location) =>
          location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter) {
      filtered = filtered.filter((location) => location.type === typeFilter);
    }

    if (worldFilter) {
      filtered = filtered.filter((location) => location.world === worldFilter);
    }

    setFilteredLocations(filtered);
  }, [locations, searchTerm, typeFilter, worldFilter]);

  const locationTypes = ['Tavern', 'Dungeon', 'Castle', 'Temple', 'City', 'Wilderness'];
  const worlds = ['Forgotten Realms', 'Eberron', 'Ravnica', 'Exandria', 'Custom'];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontFamily: '"MedievalSharp", cursive' }}>
          Discover Locations
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search Locations"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="">All Types</MenuItem>
              {locationTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="World"
              value={worldFilter}
              onChange={(e) => setWorldFilter(e.target.value)}
            >
              <MenuItem value="">All Worlds</MenuItem>
              {worlds.map((world) => (
                <MenuItem key={world} value={world}>
                  {world}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => navigate('/locations/new')}
              sx={{ height: '56px' }}
            >
              Add New Location
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {filteredLocations.map((location) => (
          <Grid item key={location.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.2s',
                },
              }}
              onClick={() => navigate(`/locations/${location.id}`)}
            >
              <CardMedia
                component="img"
                height="200"
                image={location.image || '/placeholder-location.jpg'}
                alt={location.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {location.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {location.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={location.averageRating} readOnly precision={0.5} />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({location.averageRating.toFixed(1)})
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label={location.type} color="primary" size="small" />
                  <Chip label={location.world} variant="outlined" size="small" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Locations; 