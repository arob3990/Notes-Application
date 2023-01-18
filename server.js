const express = require('express');
const path = require('path');
let db = require('./db/db.json') 
const fs = require('fs');

// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT ||   3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//GET Route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for homepage
app.get('*', (req,res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);



// GET Route for retrieving the notes json
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for feedback`);
  
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
  });

// POST Route for submitting feedback
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to submit note`);
  
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        title: title,
        text: text,
        note_id: uuid(),
      };
  
      readAndAppend(newNote, './db/notes.json');
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      res.json(response);
    } else {
      res.json('Error in posting new note');
    }
    db.push(newNote);
    fs.writeFile('../db/db.json', JSON.stringify(db), (err,res) => {
      if(err) throw err;
    })
    res.json(db)
  });

 

  

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);