import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Rating,
  Button,
  TextField,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import { Location, Review } from '../types';
import { locationsApi, reviewsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LocationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [location, setLocation] = useState<Location | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    content: '',
    visitDate: '',
    characterLevel: '',
    partySize: '',
  });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchLocationAndReviews = async () => {
      try {
        const locationData = await locationsApi.getById(id!);
        const reviewsData = await reviewsApi.getByLocation(id!);
        setLocation(locationData);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching location details:', error);
        setError('Failed to load location details');
      }
    };

    fetchLocationAndReviews();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to leave a review');
      return;
    }

    try {
      const reviewData = {
        rating: newReview.rating,
        title: newReview.title,
        content: newReview.content,
        visitDate: newReview.visitDate,
        characterLevel: parseInt(newReview.characterLevel),
        partySize: parseInt(newReview.partySize),
        location: location!
      };

      await reviewsApi.create(reviewData);
      const updatedReviews = await reviewsApi.getByLocation(id!);
      setReviews(updatedReviews);
      setNewReview({
        rating: 0,
        title: '',
        content: '',
        visitDate: '',
        characterLevel: '',
        partySize: '',
      });
      setError('');
    } catch (error) {
      setError('Failed to submit review');
    }
  };

  if (!location) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={location.image || '/placeholder-location.jpg'}
              alt={location.name}
            />
            <CardContent>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontFamily: '"MedievalSharp", cursive' }}>
                {location.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip label={location.type} color="primary" />
                <Chip label={location.world} variant="outlined" />
              </Box>
              <Typography variant="body1" paragraph>
                {location.description}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={location.averageRating} readOnly precision={0.5} />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({location.averageRating.toFixed(1)} based on {reviews.length} reviews)
                </Typography>
              </Box>
              {location.coordinates && (
                <Typography variant="body2" color="text.secondary">
                  Coordinates: {location.coordinates.latitude}, {location.coordinates.longitude}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            Reviews
          </Typography>
          {reviews.map((review) => (
            <Card key={review.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6">{review.title}</Typography>
                  <Rating value={review.rating} readOnly />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  By {review.user.username} ({review.user.characterName}) on {new Date(review.visitDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Level {review.characterLevel} | Party Size: {review.partySize}
                </Typography>
                <Typography variant="body1" paragraph>
                  {review.content}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Leave a Review
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <form onSubmit={handleReviewSubmit}>
                <Box sx={{ mb: 2 }}>
                  <Typography component="legend">Rating</Typography>
                  <Rating
                    value={newReview.rating}
                    onChange={(_, value) => setNewReview({ ...newReview, rating: value || 0 })}
                  />
                </Box>
                <TextField
                  fullWidth
                  label="Title"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Review"
                  multiline
                  rows={4}
                  value={newReview.content}
                  onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Visit Date"
                  type="date"
                  value={newReview.visitDate}
                  onChange={(e) => setNewReview({ ...newReview, visitDate: e.target.value })}
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Character Level"
                  type="number"
                  value={newReview.characterLevel}
                  onChange={(e) => setNewReview({ ...newReview, characterLevel: e.target.value })}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Party Size"
                  type="number"
                  value={newReview.partySize}
                  onChange={(e) => setNewReview({ ...newReview, partySize: e.target.value })}
                  required
                  sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Submit Review
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LocationDetails; 