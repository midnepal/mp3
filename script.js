const songsFolder = "https://sydneyhelps.com/mp3/upload/files/ai/";
const playlistEl = document.getElementById("playlist");
const audioPlayer = document.getElementById("audio-player");
const playBtn = document.getElementById("play-btn");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const progressBar = document.getElementById("progress-bar");
const volumeSlider = document.getElementById("volume-slider");
const songTitle = document.getElementById("song-title");
const thumbnail = document.getElementById("thumbnail");
const downloadBtn = document.getElementById("download-btn");

let songs = [];
let currentIndex = 0;

// Fetch songs from the server
async function fetchSongs() {
    try {
        const response = await fetch(songsFolder);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const links = Array.from(doc.querySelectorAll("a[href$='.mp3']"));
        songs = links.map(link => ({
            title: decodeURIComponent(link.textContent),
            url: `${songsFolder}${link.getAttribute("href")}`,
        }));
        renderPlaylist();
    } catch (error) {
        console.error("Error fetching songs:", error);
    }
}

// Render the playlist
function renderPlaylist() {
    playlistEl.innerHTML = songs.map((song, index) => `
        <li class="list-group-item">
            <span>${song.title}</span>
            <button class="btn btn-sm btn-success" onclick="playSong(${index})">Play</button>
        </li>
    `).join("");
}

// Play a song
function playSong(index) {
    currentIndex = index;
    audioPlayer.src = songs[index].url;
    songTitle.textContent = songs[index].title;
    thumbnail.src = "thumbnail.jpg"; // Set a relevant thumbnail for each song
    audioPlayer.play();
    updateDownloadButton();
}

// Update the download button
function updateDownloadButton() {
    downloadBtn.href = songs[currentIndex].url;
    downloadBtn.download = songs[currentIndex].title;
}

// Handle play/pause
playBtn.addEventListener("click", () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playBtn.textContent = "⏸️";
    } else {
        audioPlayer.pause();
        playBtn.textContent = "▶️";
    }
});

// Handle next/prev
nextBtn.addEventListener("click", () => playSong((currentIndex + 1) % songs.length));
prevBtn.addEventListener("click", () => playSong((currentIndex - 1 + songs.length) % songs.length));

// Update progress bar
audioPlayer.addEventListener("timeupdate", () => {
    progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100 || 0;
});

// Seek using progress bar
progressBar.addEventListener("input", () => {
    audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
});

// Adjust volume
volumeSlider.addEventListener("input", () => {
    audioPlayer.volume = volumeSlider.value;
});

// Fetch songs on page load
fetchSongs();
