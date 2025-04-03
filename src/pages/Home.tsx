import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { locationsApi } from '../services/api';
import { Location } from '../types';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [featuredLocations, setFeaturedLocations] = React.useState<Location[]>([]);

  React.useEffect(() => {
    const fetchFeaturedLocations = async () => {
      try {
        const locations = await locationsApi.getAll();
        setFeaturedLocations(locations.slice(0, 3));
      } catch (error) {
        console.error('Error fetching featured locations:', error);
      }
    };

    fetchFeaturedLocations();
  }, []);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontFamily: '"MedievalSharp", cursive' }}
          >
            Welcome to Huzzah!
          </Typography>
          <Typography variant="h5" paragraph>
            Discover and review D&D locations from your adventures
          </Typography>
          {!isAuthenticated && (
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ mt: 2 }}
            >
              Join the Adventure
            </Button>
          )}
        </Container>
      </Box>

      {/* Featured Locations */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          sx={{ textAlign: 'center', fontFamily: '"MedievalSharp", cursive' }}
        >
          Featured Locations
        </Typography>
        <Grid container spacing={4}>
          {featuredLocations.map((location) => (
            <Grid item key={location.id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/locations/${location.id}`)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={`https://source.unsplash.com/random/400x300/?${location.type.toLowerCase()}`}
                  alt={location.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h3">
                    {location.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {location.type} • {location.world}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rating: {location.averageRating.toFixed(1)}/5
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 