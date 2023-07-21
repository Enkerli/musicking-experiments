class Button {
  constructor(label, x, y, w, h, midiNote, color, textColour) {
    this.label = label;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.midiNote = midiNote;
    this.frequency = midiToFreq(midiNote);
    this.color = color;
    this.textColour = textColour;
    this.isHighlighted = false;
  }

  show() {
    let buttonElement = createButton(this.label)
      .position(this.x, this.y)
      .size(this.w, this.h);

    if (this.isHighlighted) {
      buttonElement.style('border', '3px solid black'); // Apply border highlight for highlighted buttons
      buttonElement.style('color', this.textColour);
      buttonElement.style('background-color', this.color);
    }

    buttonElement.mousePressed(() => this.buttonClicked());
  }

  buttonClicked() {
    // console.log("Button clicked:", this.label);
    this.playNote();
  }

  playNote() {
    let gridNote = constrain(this.midiNote, 33, 81);
    epNotes[gridNote].play();
  }
}

let baseNote = 33;
let rows = 5;
let cols = 5;
let startX = 50;
let startY = 500;
let cellWidth = 50;
let cellHeight = 50;
let buttons = [];
let epNotes = [];
let noteNames = [
  "C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"
];
let colors = [
  "#FFFF00", "#0080FF", "#FF8000", "#00FFFF", "#FF00FF", "#00FF00",
  "#0000FF", "#FFC000", "#00C0FF", "#FF0000", "#40FFC0", "#8000FF"
];
let textColours = [
  "#000000", "#FFFFFF", "#000000", "#000000", "#000000", "#000000",
  "#FFFFFF", "#000000", "#000000", "#000000", "#000000", "#FFFFFF"
];
let rootNote = "C"; // Default root note is C
let currentScale = "pentatonic"; // Default scale is A minor pentatonic

function setup() {
  createCanvas(400, 600); // Extend the canvas height to accommodate the menu
  createGrid(rows, cols, startX, startY, cellWidth, cellHeight);
  createMenu();
  updateGrid(); // Update the grid based on the default values of rows and cols
}

function createMenu() {
  let scaleSelect = createSelect();
  scaleSelect.position(50, 570);
  scaleSelect.option('Minor Pentatonic', 'pentatonic');
  scaleSelect.option('Minor', 'minor');
  scaleSelect.option('Blues', 'blues');
  scaleSelect.option('Lydian', 'lydian');
  scaleSelect.option('Chromatic', 'chromatic');
  scaleSelect.option('Dominant Bebop', 'bebop');
  scaleSelect.option('Whole Tone', 'wholetone');
  scaleSelect.option('Altered (HW)', 'alteredhw');
  scaleSelect.option('Altered (WH)', 'alteredwh');
  scaleSelect.option('Harmonic Minor', 'harmonic');
  scaleSelect.option('Melodic Minor (Descending)', 'melodicdescending');
  scaleSelect.option('Melodic Minor (Ascending)', 'melodicascending');
  scaleSelect.changed(() => {
    currentScale = scaleSelect.value();
    updateGrid(); // Update the grid with the new scale
  });
  scaleSelect.value(currentScale); // Set the default value

  // Create a menu to choose the number of rows
  let rowSelect = createSelect();
  rowSelect.position(50, 590); // Adjust the position to avoid overlap with other menus
  for (let i = 5; i <= 10; i++) {
    rowSelect.option(i.toString()+" rows", i);
  }
  rowSelect.changed(() => {
    rows = int(rowSelect.value()); // Update the rows with the selected value
    updateGrid(); // Update the grid with the new rows and cols
  });
  rowSelect.value(rows.toString()); // Set the default value

  // Create a menu to choose the number of columns
  let colSelect = createSelect();
  colSelect.position(150, 590); // Adjust the position to avoid overlap with other menus
  for (let i = 5; i <= 12; i++) {
    colSelect.option(i.toString()+" columns", i);
  }
  colSelect.changed(() => {
    cols = int(colSelect.value()); // Update the cols with the selected value
    updateGrid(); // Update the grid with the new rows and cols
  });
  colSelect.value(cols.toString()); // Set the default value
}

function loadNote(midiNote) {
  midiNote = constrain(midiNote, 33, 81);
  epNotes[midiNote] = loadSound(('EPnotes/' + String(midiNote) + '.mp3'));
}

function createGrid(rows, cols, startX, startY, cellWidth, cellHeight) {
  // Clear the canvas
  clear();

  let colorIndex = 0;
  buttons = []; // Clear the existing buttons array before re-populating
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let x = startX + j * cellWidth;
      let y = startY - i * cellHeight;

      let midiNote = (baseNote + (i * 5) + j);
      let buttonLabel = noteNames[midiNote % 12]; // Get the note name for the button
      loadNote(midiNote);
      let color = colors[(midiNote - baseNote) % 12];
      let textColour = textColours[(midiNote - baseNote) % 12];
      colorIndex++;

      let isHighlighted = isNoteInScale(midiNote, currentScale);

      let button = new Button(buttonLabel, x, y, cellWidth, cellHeight, midiNote, color, textColour);
      buttons.push(button);
      updateButtonHighlight(button); // Update the highlight status of the button
    }
  }
}

function updateButtonHighlight(button) {
  let isHighlighted = isNoteInScale(button.midiNote, currentScale);
  button.isHighlighted = isHighlighted;
  button.show();
}

    function isNoteInScale(midiNote, scale) {
      let scaleToCheck = [];
      switch (scale) {
        case 'pentatonic':
          scaleToCheck = aPentatonic;
          break;
        case 'minor':
          scaleToCheck = aMinor;
          break;
        case 'blues':
          scaleToCheck = aBlues;
          break;
        case 'lydian':
          scaleToCheck = aLydian;
          break;
        case 'wholetone':
          scaleToCheck = aWholeToneScale;
          break;
        case 'bebop':
          scaleToCheck = aBebop;
          break;
        case 'chromatic':
          scaleToCheck = chromatic;
          break;
        case 'alteredwh':
          scaleToCheck = aAlteredWHScale;
          break;
        case 'alteredhw':
          scaleToCheck = aAlteredHWScale;
          break;
        case 'harmonic':
          scaleToCheck = aHarmonicMinorScale;
          break;
        case 'melodicdescending':
          scaleToCheck = aMelodicMinorDescendingScale;
          break;
        case 'melodicascending':
          scaleToCheck = aMelodicMinorAscendingScale;
          break;
        default:
          break;
      }

      return scaleToCheck.includes(midiNote);
    }


function generateScale(baseMIDINote, intervals) {
  let scale = [];
  for (let octave = 0; octave <= 10; octave++) {
    for (let i = 0; i < intervals.length; i++) {
      let note = baseMIDINote + octave * 12 + intervals[i];
      if (note <= 127) {
        scale.push(note);
      }
    }
  }
  return scale;
}

function updateGrid() {
  // Clear the canvas
  clear();

  // Recreate the grid with the new rows and cols
  createGrid(rows, cols, startX, startY, cellWidth, cellHeight);

  // Recreate other menus
  createMenu();
}

// A Pentatonic Minor
let aPentatonic = generateScale(baseNote, [0, 3, 5, 7, 10]);

// A Minor (Aeolian)
let aMinor = generateScale(baseNote, [0, 2, 3, 5, 7, 8, 10]);

// A Lydian
let aLydian = generateScale(baseNote, [0, 2, 4, 6, 7, 9, 11]);

// A Minor Blues
let aBlues = generateScale(baseNote, [0, 3, 5, 6, 7, 10]);

// Chromatic
let chromatic = generateScale(baseNote, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

// A Bebop Dominant
let aBebop = generateScale(baseNote, [0, 2, 4, 5, 7, 9, 10, 11]);

// A Whole Tone Scale
let aWholeToneScale = generateScale(baseNote, [0, 2, 4, 6, 8, 10]);

// A Melodic Minor (Ascending) Scale
let aMelodicMinorAscendingScale = generateScale(baseNote, [0, 2, 3, 5, 7, 9, 11]);

// A Melodic Minor (Descending) Scale
let aMelodicMinorDescendingScale = generateScale(baseNote, [0, 2, 3, 5, 7, 8, 10]);

// A Harmonic Minor Scale
let aHarmonicMinorScale = generateScale(baseNote, [0, 2, 3, 5, 7, 8, 11]);

// A Altered (Whole-Half) Scale
let aAlteredWHScale = generateScale(baseNote, [0, 2, 3, 5, 6, 8, 9, 11]);

// A Altered (Half-Whole) Scale
let aAlteredHWScale = generateScale(baseNote, [0, 1, 3, 4, 6, 8, 10]);

function updateHighlightedButtons() {
  buttons.forEach(button => {
    updateButtonHighlight(button);
  });
}
