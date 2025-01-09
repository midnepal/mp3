const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const volumeControl = document.getElementById('volumeControl');
const nowPlaying = document.getElementById('nowPlaying');
const playlistContainer = document.getElementById('playlist').querySelector('ul');

let songs = [];
let currentSongIndex = 0;

// Fetch songs from the server
fetch('/songs')
    .then(response => response.json())
    .then(data => {
        songs = data;
        populatePlaylist();
    })
    .catch(err => console.error('Error fetching songs:', err));

// Populate playlist dynamically
function populatePlaylist() {
    playlistContainer.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = song.title;
        li.addEventListener('click', () => loadSong(index));
        playlistContainer.appendChild(li);
    });
    loadSong(0);
}

// Load and play selected song
function loadSong(index) {
    currentSongIndex = index;
    const selectedSong = songs[currentSongIndex];
    audioPlayer.src = selectedSong.url;
    nowPlaying.textContent = `Now Playing: ${selectedSong.title}`;
    updateActivePlaylistItem();
    playAudio();
}

// Update active playlist item
function updateActivePlaylistItem() {
    const items = playlistContainer.querySelectorAll('li');
    items.forEach((item, idx) => {
        item.classList.toggle('active', idx === currentSongIndex);
    });
}

// Play audio
function playAudio() {
    audioPlayer.play();
    playPauseBtn.textContent = 'Pause';
}

// Pause audio
function pauseAudio() {
    audioPlayer.pause();
    playPauseBtn.textContent = 'Play';
}

// Play/Pause button
playPauseBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        playAudio();
    } else {
        pauseAudio();
    }
});

// Previous button
prevBtn.addEventListener('click', () => {
    if (currentSongIndex > 0) {
        loadSong(currentSongIndex - 1);
    }
});

// Next button
nextBtn.addEventListener('click', () => {
    if (currentSongIndex < songs.length - 1) {
        loadSong(currentSongIndex + 1);
    }
});

// Progress bar update
audioPlayer.addEventListener('timeupdate', () => {
    progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100 || 0;
});

// Change playback position
progressBar.addEventListener('input', () => {
    audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
});

// Volume control
volumeControl.addEventListener('input', () => {
    audioPlayer.volume = volumeControl.value;
});
