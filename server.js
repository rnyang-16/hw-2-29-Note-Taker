// Dependencies
var http = require("http");
var fs = require("fs");
var express = require("express");
var path = require("path");

var PORT = 8080;

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Add ids to notes
function assignIdForNotes(notes) {
  for (var i=0; i<notes.length; i++) {
    notes[i].id = i+1;
  }
  return notes;
}


// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// Read the db.json file and return all saved notes as JSON
app.get("/api/notes", function(req, res) {
  var rawdata = fs.readFileSync(path.join(__dirname, "db/db.json"));
  var notes = JSON.parse(rawdata);
  // notes = assignIdForNotes(notes);
  // console.log(notes);
  return res.json(notes);
});

// Receive a new note to save on the request body, add it to the db.json file,
// and then return the new note to the client.
app.post("/api/notes", function(req, res) {
  var newNote = req.body;
  // console.log(newNote)
  var rawdata = fs.readFileSync(path.join(__dirname, "db/db.json"));
  var notes = JSON.parse(rawdata);

  notes.push(newNote);
  notes = assignIdForNotes(notes);
  fs.writeFileSync(path.join(__dirname, "db/db.json"), JSON.stringify(notes));

  res.json(newNote);
});

app.delete("/api/notes/:id", function(req, res) {

  var rawdata = fs.readFileSync(path.join(__dirname, "db/db.json"));
  var notes = JSON.parse(rawdata);

  // console.log(req.params.id);
  notes = notes.filter(function(note) {
    return note.id !== parseInt(req.params.id);
  });
  // console.log(notes);
  notes = assignIdForNotes(notes);
  fs.writeFileSync(path.join(__dirname, "db/db.json"), JSON.stringify(notes));
  return res.json(notes);

});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});