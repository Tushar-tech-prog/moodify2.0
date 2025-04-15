let currentMood = "normal";
let songs = {
  happy: ["music/happy/song1.mp3", "music/happy/song2.mp3"],
  sad: ["music/sad/song1.mp3", "music/sad/song2.mp3"],
  chill: ["music/chill/song1.mp3", "music/chill/song2.mp3"],
  normal: ["music/normal/song1.mp3", "music/normal/song2.mp3"]
};

let currentSongIndex = 0;
let cameraTimeout;
let cameraStarted = false;

function setMood(mood) {
  currentMood = mood;
  document.getElementById("detected-mood").textContent = `Mood: ${capitalize(mood)}`;
  currentSongIndex = 0;
  playSongForMood(mood);
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function playSongForMood(mood) {
  const player = document.getElementById("audio-player");
  const songList = songs[mood];

  if (songList && songList.length > 0) {
    player.src = songList[currentSongIndex];
    player.play();
    document.getElementById("song-title").textContent = `Now playing a ${capitalize(mood)} mood vibe`;
  } else {
    document.getElementById("song-title").textContent = "No songs available for this mood.";
  }
}

function playNextSong() {
  const songList = songs[currentMood];
  if (songList && songList.length > 0) {
    currentSongIndex = (currentSongIndex + 1) % songList.length;
    const player = document.getElementById("audio-player");
    player.src = songList[currentSongIndex];
    player.play();
  }
}

// Camera Setup
function startCamera() {
  const video = document.getElementById("webcam");

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
        cameraStarted = true;

        setTimeout(() => {
          if (currentMood === "normal") {
            setMood("normal");
          }
        }, 5000);

        clearTimeout(cameraTimeout);
        cameraTimeout = setTimeout(() => {
          stopCamera();
        }, 2 * 60 * 1000); // 2 minutes
      })
      .catch((error) => {
        console.error("Camera error:", error);
        alert("Camera access denied!");
      });
  }
}

function stopCamera() {
  const video = document.getElementById("webcam");
  const stream = video.srcObject;
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    video.srcObject = null;
    cameraStarted = false;
    console.log("Camera stopped automatically after 2 mins.");
  }
}

// YouTube API Search
function searchYouTube() {
  const query = document.getElementById("search-input").value;
  const API_KEY = "AIzaSyD31UNOiH_scqLkKJNQ5oD18EWuI2EKOM8"; // Replace this line with your actual API key
  const maxResults = 1;

  if (!query) return alert("Please enter a search query!");

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}&maxResults=${maxResults}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const videoId = data.items[0].id.videoId;
      const iframe = `<iframe width="100%" height="320" src="https://www.youtube.com/embed/${videoId}?autoplay=1" allow="autoplay" allowfullscreen></iframe>`;
      document.getElementById("video-frame").innerHTML = iframe;
      document.getElementById("song-title").textContent = `Now playing from YouTube`;
    })
    .catch(err => {
      console.error(err);
      alert("Failed to fetch YouTube video.");
    });
}
