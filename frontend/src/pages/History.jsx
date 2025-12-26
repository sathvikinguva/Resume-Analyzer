import React, { useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchResumesStart,
  fetchResumesSuccess,
  fetchResumesFailure,
  setCurrentResume,
  deleteResumeSuccess,
} from '../redux/slices/resumeSlice';
import { resumeService } from '../services/resumeService';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DescriptionIcon from '@mui/icons-material/Description';

const History = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resumes, loading, error } = useSelector((state) => state.resume);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    dispatch(fetchResumesStart());
    try {
      const response = await resumeService.getResumeHistory();
      dispatch(fetchResumesSuccess(response.data.resumes));
    } catch (err) {
      dispatch(fetchResumesFailure(err.response?.data?.message || 'Failed to load resumes'));
    }
  };

  const handleView = async (id) => {
    try {
      const response = await resumeService.getResume(id);
      dispatch(setCurrentResume(response.data.resume));
      navigate('/');
    } catch (err) {
      console.error('Error loading resume:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume analysis?')) {
      try {
        await resumeService.deleteResume(id);
        dispatch(deleteResumeSuccess(id));
      } catch (err) {
        console.error('Error deleting resume:', err);
      }
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Resume Analysis History
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          View and manage your previously analyzed resumes
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {resumes.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <DescriptionIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              No resume analyses yet
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => navigate('/')}
            >
              Upload Your First Resume
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {resumes.map((resume) => (
              <Grid item xs={12} sm={6} md={4} key={resume._id}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" noWrap gutterBottom>
                      {resume.fileName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Uploaded: {new Date(resume.createdAt).toLocaleDateString()}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={`Score: ${resume.analysis?.score || 'N/A'}/100`}
                        color={getScoreColor(resume.analysis?.score || 0)}
                        size="small"
                      />
                      <Chip
                        label={resume.fileType.toUpperCase()}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleView(resume._id)}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(resume._id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default History;
