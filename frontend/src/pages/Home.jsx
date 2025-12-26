import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Alert,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import FileUpload from '../components/FileUpload';
import ResumeAnalysis from '../components/ResumeAnalysis';
import {
  uploadStart,
  uploadProgress,
  uploadSuccess,
  uploadFailure,
} from '../redux/slices/resumeSlice';
import { resumeService } from '../services/resumeService';

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const dispatch = useDispatch();
  const { currentResume, uploading, uploadProgress: progress, error } = useSelector(
    (state) => state.resume
  );

  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    dispatch(uploadStart());

    try {
      const response = await resumeService.uploadResume(file, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        dispatch(uploadProgress(percentCompleted));
      });

      dispatch(uploadSuccess(response.data.resume));
    } catch (err) {
      dispatch(uploadFailure(err.response?.data?.message || 'Upload failed'));
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" align="center" gutterBottom>
          AI-Powered Resume Analyzer
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary" paragraph>
          Upload your resume and get instant AI-powered feedback
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!currentResume && !uploading && (
          <Box sx={{ mt: 4 }}>
            <FileUpload onFileSelect={handleFileSelect} />
          </Box>
        )}

        {uploading && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Analyzing your resume...
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              This may take a few moments
            </Typography>
            <Box sx={{ width: '100%', mt: 2 }}>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
          </Box>
        )}

        {currentResume && !uploading && (
          <ResumeAnalysis
            analysis={currentResume.analysis}
            fileName={currentResume.fileName}
          />
        )}
      </Box>
    </Container>
  );
};

export default Home;
