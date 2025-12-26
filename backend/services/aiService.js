const openai = require('../config/openai');

class AIService {
  async analyzeResume(resumeText) {
    try {
      const prompt = `Analyze the following resume and provide detailed feedback. Format your response as a JSON object with the following structure:
{
  "overallAssessment": "Brief overall assessment of the resume",
  "strengths": ["strength1", "strength2", ...],
  "weaknesses": ["weakness1", "weakness2", ...],
  "skillGaps": ["skill gap 1", "skill gap 2", ...],
  "suggestions": ["suggestion1", "suggestion2", ...],
  "sectionFeedback": {
    "contact": "Feedback on contact information",
    "summary": "Feedback on summary/objective",
    "experience": "Feedback on work experience",
    "education": "Feedback on education",
    "skills": "Feedback on skills section",
    "projects": "Feedback on projects (if any)"
  },
  "score": 75
}

Resume Content:
${resumeText}

Please provide constructive, actionable feedback focusing on:
1. Content quality and relevance
2. Formatting and structure
3. Missing skills or qualifications for modern job markets
4. ATS (Applicant Tracking System) optimization
5. Overall professionalism

Provide a score out of 100 based on overall quality.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume reviewer and career coach with years of experience in hiring and recruitment. Provide detailed, constructive feedback.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const analysisText = response.choices[0].message.content;
      
      // Parse JSON response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse AI response');
    } catch (error) {
      console.error('Error analyzing resume:', error);
      throw new Error('Failed to analyze resume: ' + error.message);
    }
  }

  async getSuggestions(skillGaps) {
    try {
      const prompt = `Based on these skill gaps in a resume: ${skillGaps.join(', ')}, provide 5 specific, actionable suggestions for improvement. Return as a JSON array of strings.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const suggestionsText = response.choices[0].message.content;
      const jsonMatch = suggestionsText.match(/\[[\s\S]*\]/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return suggestionsText.split('\n').filter(s => s.trim());
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return ['Unable to generate suggestions at this time'];
    }
  }
}

module.exports = new AIService();
