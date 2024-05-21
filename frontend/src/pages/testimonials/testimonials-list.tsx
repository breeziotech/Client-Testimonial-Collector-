import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Container, Avatar } from '@mui/material';

const TestimonialForm = () => {
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [testimonial, setTestimonial] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3 }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          {/* Add a relevant icon */}
        </Avatar>
        <Typography component="h1" variant="h5">
          Submit Your Testimonial
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="testimonial"
            label="Testimonial"
            id="testimonial"
            multiline
            rows={4}
            value={testimonial}
            onChange={(e) => setTestimonial(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="email"
            label="Email"
            id="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button variant="contained" component="label">
            Upload Photo
            <input type="file" hidden onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)} />
          </Button>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TestimonialForm;
