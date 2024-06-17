import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, Button, Grid, Paper, Avatar, Box, CircularProgress } from '@mui/material';
import TelegramIcon from '@mui/icons-material/Telegram';
import TranslateIcon from '@mui/icons-material/Translate';
import CodeIcon from '@mui/icons-material/Code';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BugReportIcon from '@mui/icons-material/BugReport';
import BuildIcon from '@mui/icons-material/Build';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import ApiIcon from '@mui/icons-material/Api';
import DescriptionIcon from '@mui/icons-material/Description';
import './Chatbot.css';

const Chatbot = ({ code, isVisible, onClose }) => {
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [submittedPrompt, setSubmittedPrompt] = useState('');
  const [chatResponse, setChatResponse] = useState(''); // State to store raw response
  const [loading, setLoading] = useState(false); // State to handle loading spinner

  useEffect(() => {
    if (!isVisible) {
      setSubmittedPrompt('');
      setChatResponse('');
    }
  }, [isVisible]);

  const handleGo = async () => {
    setSubmittedPrompt(additionalPrompt);
    setAdditionalPrompt('');  // Clear the text field
    setLoading(true); // Start loading

    try {
      const response = await fetch('https://code-reviewr-backend-python.onrender.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code, userPrompt: additionalPrompt }),  // Send code and prompt
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const rawResponse = await response.text();
      setChatResponse(rawResponse); // Store the raw response
    } catch (error) {
      console.error('Error:', error);
      setChatResponse('Error decoding response'); // Store error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default behavior of Enter key
      handleGo();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Card
      style={{
        position: 'absolute',
        top: '0',
        left: '60.2%',
        width: '38.5%', // Adjust the width to 50% of the parent
        height: 'calc(98.5vh - 10px)', // Adjust this value if necessary
        zIndex: 999, // Ensure it appears above other elements
        backgroundColor: '#fff',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <CardContent style={{ flexGrow: 1 }}>
        <Typography variant="h4" component="div" style={{ marginBottom: '10px', fontWeight: 'bold', color: '#3f51b5' }}>
          CodeCraft
        </Typography>
        <hr />
        {submittedPrompt ? (
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar alt="User" src="/images/user.png" style={{ marginRight: '10px' }} />
            <Paper elevation={3} style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '10px', display: 'inline-block' }}>
              <Typography variant="body1" style={{ wordWrap: 'break-word' }}>
                {submittedPrompt}
              </Typography>
            </Paper>
          </Box>
        ) : (
          <>
            <h2 style={{ marginLeft: '23%' }}>Hello, How can I help you today?</h2>
            <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ height: '80%', marginTop: '60px' }}>
              <Grid item xs={5}>
                <Paper style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f5f5f5', cursor: 'pointer' }}>
                  <TranslateIcon style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                  <Typography variant="body1" component="span">Translate Code</Typography>
                </Paper>
              </Grid>
              <Grid item xs={5}>
                <Paper style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f5f5f5', cursor: 'pointer' }}>
                  <CodeIcon style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                  <Typography variant="body1" component="span">Convert My Code</Typography>
                </Paper>
              </Grid>
              <Grid item xs={5}>
                <Paper style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f5f5f5', cursor: 'pointer' }}>
                  <AssignmentIcon style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                  <Typography variant="body1" component="span">Generate Test Cases</Typography>
                </Paper>
              </Grid>
              <Grid item xs={5}>
                <Paper style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f5f5f5', cursor: 'pointer' }}>
                  <NoteAddIcon style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                  <Typography variant="body1" component="span">Code Explanation</Typography>
                </Paper>
              </Grid>
              <Grid item xs={5}>
                <Paper style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f5f5f5', cursor: 'pointer' }}>
                  <BuildIcon style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                  <Typography variant="body1" component="span">Code Optimization</Typography>
                </Paper>
              </Grid>
              <Grid item xs={5}>
                <Paper style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f5f5f5', cursor: 'pointer' }}>
                  <BugReportIcon style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                  <Typography variant="body1" component="span">Bug Detection</Typography>
                </Paper>
              </Grid>
              <Grid item xs={5}>
                <Paper style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f5f5f5', cursor: 'pointer' }}>
                  <NoteAddIcon style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                  <Typography variant="body1" component="span">Snippet Generation</Typography>
                </Paper>
              </Grid>
              <Grid item xs={5}>
                <Paper style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f5f5f5', cursor: 'pointer' }}>
                  <ApiIcon style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                  <Typography variant="body1" component="span">API Integration</Typography>
                </Paper>
              </Grid>
              <Grid item xs={5}>
                <Paper style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f5f5f5', cursor: 'pointer' }}>
                  <DescriptionIcon style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                  <Typography variant="body1" component="span">Document My Code</Typography>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
        {loading ? (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress />
          </Box>
        ) : (
          chatResponse && (
            <Box display="flex" alignItems="center" mt={2}>
              <Avatar alt="Bot" src="/images/bot.png" style={{ marginRight: '10px' }} />
              <Paper elevation={3} style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '10px', display: 'inline-block', width: '100%' }}>
                <Typography variant="body1" style={{ wordWrap: 'break-word' }}>
                  {chatResponse}
                </Typography>
              </Paper>
            </Box>
          )
        )}
      </CardContent>
      <CardContent>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            variant="outlined"
            placeholder="Type your prompt here..."
            value={additionalPrompt}
            onChange={(e) => setAdditionalPrompt(e.target.value)}
            multiline
            onKeyPress={handleKeyPress}
            InputProps={{
              style: { height: '60px', overflowY: 'auto', wordWrap: 'break-word' },
            }}
            style={{ width: '90%' }}
            sx={{
              '& label.Mui-focused': {
                color: '#1976D2',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#1976D2',
                },
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleGo}
            style={{ height: '46px', marginLeft: '10px' }}
          >
            <TelegramIcon />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chatbot;
