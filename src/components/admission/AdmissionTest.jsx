import React, { useState, useEffect, useCallback } from 'react';

import { 
  Container, 
  Typography, 
  Button, 
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Box,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './AdmissionTest.css';
import api from '../../api/client';

const AdmissionTest = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Sample questions - In real app, these would come from an API
  const questions = [
    {
      id: 1,
      subject: 'Mathematics',
      question: 'If x + 2 = 5, what is the value of x?',
      options: ['1', '2', '3', '4'],
      correctAnswer: '3'
    },
    {
      id: 2,
      subject: 'English',
      question: 'Which word is a synonym for "happy"?',
      options: ['Sad', 'Joyful', 'Angry', 'Tired'],
      correctAnswer: 'Joyful'
    },
    // Add more questions...
  ];

  const handleSubmitTest = useCallback(async () => {
    // Calculate score
    let score = 0;
    Object.keys(answers).forEach(questionIndex => {
      if (answers[questionIndex] === questions[questionIndex].correctAnswer) {
        score++;
      }
    });
    try {
      setSubmitting(true);
      await api.post('/admissions/submit-test', { score });
      const passingScore = Math.floor(questions.length * 0.6);
      if (score >= passingScore) {
        navigate('/admission/documents');
      } else {
        navigate('/admission/failed');
      }
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) {
        alert('Please login to submit the test. You will be redirected.');
        navigate('/login');
      } else {
        const msg = e?.response?.data?.message || e?.message || 'Failed to submit test';
        alert(msg);
      }
    }
    finally {
      setSubmitting(false);
    }
  }, [answers, navigate, questions]);

  useEffect(() => {
    // ensure an admission exists (idempotent)
    (async () => {
      try {
        const raw = localStorage.getItem('currentUser');
        if (!raw) {
          // Not logged in
          return; // allow viewing but API will require login on submit
        }
        const me = await api.get('/admissions/me');
        if (!me.data) {
          await api.post('/admissions/start');
        }
      } catch {}
    })();
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleSubmitTest]);

  const handleTimeUp = () => {
    handleSubmitTest();
  };

  const handleAnswerChange = (event) => {
    setAnswers({
      ...answers,
      [currentQuestion]: event.target.value
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="admission-test">
      <Container maxWidth="md">
        <Paper elevation={3} className="test-container">
          <Box className="test-header">
            <Typography variant="h5">Entrance Test</Typography>
            <Typography variant="h6" className="timer">
              Time Remaining: {formatTime(timeLeft)}
            </Typography>
          </Box>

          <LinearProgress 
            variant="determinate" 
            value={(currentQuestion + 1) / questions.length * 100} 
            sx={{ mb: 3 }}
          />

          <FormControl component="fieldset" className="question-container">
            <FormLabel component="legend">
              Question {currentQuestion + 1} of {questions.length} ({currentQuestionData.subject})
            </FormLabel>
            <Typography variant="h6" className="question">
              {currentQuestionData.question}
            </Typography>
            <RadioGroup
              value={answers[currentQuestion] || ''}
              onChange={handleAnswerChange}
            >
              {currentQuestionData.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>

          <Box className="test-actions">
            <Button
              variant="outlined"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            {currentQuestion === questions.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsSubmitDialogOpen(true)}
                disabled={submitting}
              >
                Submit Test
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!answers[currentQuestion]}
              >
                Next
              </Button>
            )}
          </Box>
        </Paper>

        <Dialog
          open={isSubmitDialogOpen}
          onClose={() => setIsSubmitDialogOpen(false)}
        >
          <DialogTitle>Submit Test?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to submit your test? You won't be able to change your answers after submission.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsSubmitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitTest} variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default AdmissionTest;