import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Rating,
  Button,
  TextField,
  Alert,
} from '@mui/material';
import { Review } from '../types';
import { reviewsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string>('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    characterName: user?.characterName || '',
    characterClass: user?.characterClass || '',
    characterRace: user?.characterRace || '',
  });

  useEffect(() => {
    const fetchUserReviews = async () => {
      if (user) {
        try {
          const data = await reviewsApi.getByUser(user.id);
          setReviews(data);
        } catch (error) {
          console.error('Error fetching user reviews:', error);
          setError('Failed to load reviews');
        }
      }
    };

    fetchUserReviews();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement user profile update
    setEditMode(false);
  };

  if (!user) {
    return (
      <Container>
        <Typography>Please log in to view your profile</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontFamily: '"MedievalSharp", cursive' }}>
                Character Profile
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {editMode ? (
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Character Name"
                    name="characterName"
                    value={formData.characterName}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Character Class"
                    name="characterClass"
                    value={formData.characterClass}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Character Race"
                    name="characterRace"
                    value={formData.characterRace}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                  />
                  <Button type="submit" variant="contained" sx={{ mr: 1 }}>
                    Save
                  </Button>
                  <Button variant="outlined" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                </form>
              ) : (
                <>
                  <Typography variant="body1" gutterBottom>
                    <strong>Username:</strong> {user.username}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Character Name:</strong> {user.characterName}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Class:</strong> {user.characterClass}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Race:</strong> {user.characterRace}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => setEditMode(true)}
                    sx={{ mt: 2 }}
                  >
                    Edit Profile
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom sx={{ fontFamily: '"MedievalSharp", cursive' }}>
            Your Reviews
          </Typography>
          {reviews.length === 0 ? (
            <Typography>You haven't written any reviews yet.</Typography>
          ) : (
            reviews.map((review) => (
              <Card key={review.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6">{review.title}</Typography>
                    <Rating value={review.rating} readOnly />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {review.location.name} | {new Date(review.visitDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Level {review.characterLevel} | Party Size: {review.partySize}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {review.content}
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile; 