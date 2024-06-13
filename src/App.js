import React, { useState } from 'react';
import { Grid, Button, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ProjectExplorer from './components/ProjectExplorer';
import CodeEditor from './components/CodeEditor';
import Response from './components/Response';
import Draggable from 'react-draggable'; // Import Draggable
import Chatbot from './components/Chatbot'; // Import the Chatbot component

function App() {
  const [folder, setFolder] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [fixedCode, setFixedCode] = useState('// Your fixed code will appear here...');
  const [enhancedCode, setEnhancedCode] = useState('// Your enhanced code will appear here...');
  const [errorDescription, setErrorDescription] = useState('Errors description content goes here...');
  const [errorMessage, setErrorMessage] = useState(''); // New state for error message
  const [botOpen, setBotOpen] = useState(false); // State to handle bot visibility

  const openFolder = async () => {
    try {
      setLoading(true); // Start loading
      const handle = await window.showDirectoryPicker();
      const rootFolder = await buildFileTree(handle);
      setFolder(rootFolder);
      setSelectedFile(null); // Clear the selected file when a new project is opened
      setLoading(false); // Stop loading
    } catch (err) {
      console.error('Error opening folder:', err);
      setLoading(false); // Stop loading in case of error
    }
  };

  const buildFileTree = async (handle) => {
    const folder = { name: handle.name, path: handle.name, subFolders: [], files: [] };
    for await (const entry of handle.values()) {
      if (entry.kind === 'directory') {
        folder.subFolders.push(await buildFileTree(entry));
      } else {
        folder.files.push({ name: entry.name, path: entry.name, handle: entry });
      }
    }
    return folder;
  };

  const saveFile = async (file, content) => {
    const writable = await file.handle.createWritable();
    await writable.write(content);
    await writable.close();
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filterFiles = (folder) => {
    if (!searchQuery) return folder;

    const filterFolder = (folder) => {
      const filteredSubFolders = folder.subFolders
        .map(filterFolder)
        .filter(subFolder => subFolder.files.length || subFolder.subFolders.length);
      const filteredFiles = folder.files.filter(file => file.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return { ...folder, subFolders: filteredSubFolders, files: filteredFiles };
    };

    return filterFolder(folder);
  };

  const backToHome = () => {
    window.location.href = 'https://content-crafter-beta.vercel.app/';
  };

  const handleBotClick = () => {
    setBotOpen(!botOpen);
  };

  return (
    <Grid container spacing={2} style={{ height: '100vh' }}>
      <Grid item xs={2.4} style={{ height: '101%', overflowY: 'auto', padding: '10px', paddingRight: '0px', paddingLeft: '16px', backgroundColor: '#000' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems:'flex-start', marginBottom: '1px',backgroundColor:'white' }}>
          <img src="/images/stackroute_logo.png" alt="StackRoute Logo" style={{ height: '160px' }} />
          <button className="back-button" onClick={backToHome} style={{ marginLeft: '1px' }}>
            <ArrowBackIosNewIcon style={{ color: 'white' }} />
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', marginTop: '40px' }}>
          <Button
            variant="contained"
            color="primary"
            style={{ width: '250px', height: '40px', marginLeft: '50px' }}
            onClick={openFolder}
          >
            Open Project
          </Button>
        </div>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <div className="loader" style={{ marginRight: '90px' }}></div>
            <div className="loader-text" style={{ marginLeft: '20px' }}></div>
          </div>
        ) : (
          <ProjectExplorer folder={filterFiles(folder)} onFileSelect={setSelectedFile} />
        )}
      </Grid>
      <Grid item xs={4.8} style={{ height: '100%' }}>
        <CodeEditor
          file={selectedFile}
          onSave={saveFile}
          setCode={setCode}
          setFixedCode={setFixedCode}
          setEnhancedCode={setEnhancedCode}
          setErrorDescription={setErrorDescription}
          setErrorMessage={setErrorMessage} // Pass setErrorMessage
        />
      </Grid>
      <Grid item xs={4.7} style={{ height: '100%' }}>
        <Response
          code={code}
          setCode={setCode}
          fixedCode={fixedCode}
          enhancedCode={enhancedCode}
          errorDescription={errorDescription}
          errorMessage={errorMessage} // Pass errorMessage
        />
      </Grid>
      <Draggable>
        <img
          src="/images/bot.png"
          alt="Chatbot"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '100px',
            height: '100px',
            zIndex: 1000,
            cursor: 'pointer'
          }}
          onClick={handleBotClick}
        />
      </Draggable>
      {botOpen && <Chatbot code={code} isVisible={botOpen} onClose={handleBotClick} />}
    </Grid>
  );
}

export default App;
