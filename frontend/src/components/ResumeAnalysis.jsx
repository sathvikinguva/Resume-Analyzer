import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Divider,
  LinearProgress,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const ResumeAnalysis = ({ analysis, fileName }) => {
  if (!analysis) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Analysis Results for: {fileName}
        </Typography>
        
        {/* Overall Score */}
        <Box sx={{ mt: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Overall Score: {analysis.score}/100
          </Typography>
          <LinearProgress
            variant="determinate"
            value={analysis.score}
            color={getScoreColor(analysis.score)}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Overall Assessment */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Overall Assessment
          </Typography>
          <Typography variant="body1" paragraph>
            {analysis.overallAssessment}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Strengths and Weaknesses Grid */}
        <Grid container spacing={3}>
          {/* Strengths */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%', borderColor: 'success.main' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">Strengths</Typography>
                </Box>
                {analysis.strengths?.map((strength, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Typography variant="body2">• {strength}</Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Weaknesses */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%', borderColor: 'error.main' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WarningIcon color="error" sx={{ mr: 1 }} />
                  <Typography variant="h6">Areas for Improvement</Typography>
                </Box>
                {analysis.weaknesses?.map((weakness, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Typography variant="body2">• {weakness}</Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Skill Gaps */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%', borderColor: 'warning.main' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUpIcon color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6">Skill Gaps</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {analysis.skillGaps?.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      color="warning"
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Suggestions */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%', borderColor: 'info.main' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LightbulbIcon color="info" sx={{ mr: 1 }} />
                  <Typography variant="h6">Suggestions</Typography>
                </Box>
                {analysis.suggestions?.map((suggestion, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Typography variant="body2">• {suggestion}</Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Section Feedback */}
        {analysis.sectionFeedback && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Section-by-Section Feedback
            </Typography>
            {Object.entries(analysis.sectionFeedback).map(([section, feedback]) => (
              feedback && (
                <Box key={section} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                    {section}:
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {feedback}
                  </Typography>
                </Box>
              )
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ResumeAnalysis;
