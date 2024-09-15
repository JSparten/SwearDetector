// Check if the browser supports Speech Recognition
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (window.SpeechRecognition) {
  const recognition = new window.SpeechRecognition();
  recognition.continuous = true; // Enable continuous listening
  recognition.interimResults = true; // Enable interim results

  let isListening = false;
  let isPaused = false;
  let showDetectedWords = false;

  const startButton = document.getElementById('start-button');
  const listeningStatus = document.getElementById('listening-status');
  const messageElement = document.getElementById('message');
  const warningSound = document.getElementById('warning-sound');
  const toggleWordsButton = document.getElementById('toggle-words-button');
  const detectedWordsElement = document.getElementById('detected-words');

  // Replace with the actual words you want to detect
  const swearWords = ['badword1', 'badword2', 'badword3'];

  startButton.addEventListener('click', () => {
    if (isListening) {
      // Stop listening
      recognition.stop();
      isListening = false;
      listeningStatus.textContent = 'No';
      startButton.textContent = 'Start Listening';
    } else {
      // Start listening
      isListening = true;
      isPaused = false;
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
    listeningStatus.textContent = 'Yes';
    startButton.textContent = 'Stop Listening';
    messageElement.textContent = '';
  }

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }

    if (showDetectedWords) {
      detectedWordsElement.textContent = `Detected Words: ${transcript}`;
    }

    checkForSwearWords(transcript.toLowerCase());
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
    warningSound.play().catch((error) => {
      console.error('Playback failed:', error);
    });
  }

  function showWarningMessage() {
    messageElement.textContent = 'You have been fined one credit';
    messageElement.style.display = 'block';

    // Pause listening temporarily
    isPaused = true;
    recognition.stop();

    // Hide the message and resume listening after 5 seconds
    setTimeout(() => {
      messageElement.style.display = 'none';
      // Resume listening if still intended to be listening
      if (isListening) {
        isPaused = false;
        recognition.start();
      }
    }, 5000);
  }

  recognition.onend = () => {
    if (isListening && !isPaused) {
      // Automatically restart recognition if it stopped unexpectedly
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
particlesJS.load('particles-js', 'particles.json', () => {
  console.log('particles.js loaded - callback');
});
