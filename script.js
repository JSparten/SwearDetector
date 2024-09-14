// Check if browser supports Speech Recognition
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (window.SpeechRecognition) {
  const recognition = new window.SpeechRecognition();
  recognition.continuous = false; // Set to false to manually control when to start
  recognition.interimResults = false;

  let isListening = false;
  let showDetectedWords = false;

  const startButton = document.getElementById('start-button');
  const listeningStatus = document.getElementById('listening-status');
  const messageElement = document.getElementById('message');
  const warningSound = document.getElementById('warning-sound');
  const toggleWordsButton = document.getElementById('toggle-words-button');
  const detectedWordsElement = document.getElementById('detected-words');

  const swearWords = ['shit', 's***', 'c***', 'bullshit', 'fucked', 'f*****', 'b*******',  'f******', 'dam', 'f***', 'cunt', 'prick', 'fucking', 'fuck']; // Replace with your list

  startButton.addEventListener('click', () => {
    if (isListening) {
      // Stop listening
      recognition.stop();
      isListening = false;
      listeningStatus.textContent = 'No';
      startButton.textContent = 'Start Listening';
    } else {
      // Start listening
      startRecognition();
    }
  });

  toggleWordsButton.addEventListener('click', () => {
    showDetectedWords = !showDetectedWords;
    toggleWordsButton.textContent = showDetectedWords ? 'Hide Detected Words' : 'Show Detected Words';
    detectedWordsElement.style.display = showDetectedWords ? 'block' : 'none';
  });

  function startRecognition() {
    recognition.start();
    isListening = true;
    listeningStatus.textContent = 'Yes';
    startButton.textContent = 'Stop Listening';
    messageElement.textContent = '';
  }

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    if (showDetectedWords) {
      detectedWordsElement.textContent = `Detected Words: ${transcript}`;
    }
    checkForSwearWords(transcript);
  };

  function checkForSwearWords(speech) {
    for (const word of swearWords) {
      if (speech.includes(word)) {
        playWarningSound();
        showWarningMessage();
        break;
      }
    }
  }

  function playWarningSound() {
    warningSound.currentTime = 0; // Reset to start
    warningSound.play();
  }

  function showWarningMessage() {
    messageElement.textContent = 'You have been fined one credit';
    messageElement.style.display = 'block';

    // Stop listening
    recognition.stop();
    isListening = false;
    listeningStatus.textContent = 'No';
    startButton.textContent = 'Start Listening';

    // Hide the message and resume listening after 5 seconds
    setTimeout(() => {
      messageElement.style.display = 'none';
      // Resume listening
      startRecognition();
    }, 6000);
  }

  recognition.onend = () => {
    if (isListening) {
      // Automatically restart recognition if it's supposed to be listening
      recognition.start();
    }
  };

  recognition.onerror = (event) => {
    console.error('Speech Recognition Error:', event.error);
    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
      alert('Microphone access was denied. Please allow access and try again.');
      recognition.stop();
      isListening = false;
      listeningStatus.textContent = 'No';
      startButton.textContent = 'Start Listening';
    }
  };
} else {
  alert('Sorry, your browser does not support speech recognition.');
}

// Initialize particles.js
particlesJS.load('particles-js', 'particles.json', function() {
  console.log('particles.js loaded - callback');
});