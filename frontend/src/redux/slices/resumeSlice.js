import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  resumes: [],
  currentResume: null,
  loading: false,
  uploading: false,
  uploadProgress: 0,
  error: null,
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    uploadStart: (state) => {
      state.uploading = true;
      state.uploadProgress = 0;
      state.error = null;
    },
    uploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    uploadSuccess: (state, action) => {
      state.uploading = false;
      state.uploadProgress = 100;
      state.currentResume = action.payload;
      state.resumes.unshift(action.payload);
    },
    uploadFailure: (state, action) => {
      state.uploading = false;
      state.uploadProgress = 0;
      state.error = action.payload;
    },
    fetchResumesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchResumesSuccess: (state, action) => {
      state.loading = false;
      state.resumes = action.payload;
    },
    fetchResumesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentResume: (state, action) => {
      state.currentResume = action.payload;
    },
    deleteResumeSuccess: (state, action) => {
      state.resumes = state.resumes.filter(r => r._id !== action.payload);
      if (state.currentResume?._id === action.payload) {
        state.currentResume = null;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentResume: (state) => {
      state.currentResume = null;
      state.error = null;
      state.uploadProgress = 0;
    },
  },
});

export const {
  uploadStart,
  uploadProgress,
  uploadSuccess,
  uploadFailure,
  fetchResumesStart,
  fetchResumesSuccess,
  fetchResumesFailure,
  setCurrentResume,
  deleteResumeSuccess,
  clearError,
  clearCurrentResume,
} = resumeSlice.actions;

export default resumeSlice.reducer;
