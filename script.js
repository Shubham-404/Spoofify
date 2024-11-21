console.log("Yes, this is a Spotify clone cum offline music application.");

// selectors
const songBar = document.querySelector(".song");
const songPlay = document.getElementById("song-play");
const seekBar = document.querySelector(".seek-bar");
const library = document.body.querySelector(".song-list");
const recommends = document.querySelector('.recommendation');
const songElementsList = document.body.querySelectorAll(".song-list");
const playerSong = document.body.querySelector(".left-part");

const playBtn = document.getElementById("play");
const pauseBtn = document.getElementById("pause");
const startTime = document.getElementById('start-time');
const totalTime = document.getElementById('total-time');
const indicator = document.querySelector('.indicator');

const shuffleBtn = document.getElementById("shuffle");
const unshuffleBtn = document.getElementById("unshuffle");

const repeatBtn = document.getElementById("repeat");
const unrepeatBtn = document.getElementById("unrepeat");

const muteBtn = document.getElementById("mute");
const unmuteBtn = document.getElementById("unmute");

const volBar = document.querySelector(".volume-bar");
const volInd = document.querySelector(".vol-indicator");

let currentAudio = null;
let bottom = false;

// Play button animation on hover
songBar.addEventListener("mouseover", () => {
    if (!bottom) {
        songPlay.style.bottom = "0";
        bottom = true;
    }
});
songBar.addEventListener("mouseout", () => {
    if (bottom) {
        songPlay.style.bottom = "-3rem";
        bottom = false;
    }
});

// Function to format time properly
function timeFormat(s) {
    if (!s) return `00:00`;

    let m = 0;
    if (s >= 60) {
        m = parseInt(s / 60);
        s -= 60 * m;
    }

    if (s < 10 && m < 10) return `0${m}:0${s}`;
    if (s < 10) return `${m}:0${s}`;
    if (m < 10) return `0${m}:${s}`;
    return `${m}:${s}`;
}

// Function to load music
async function loadMusic() {
    let songs = [];
    let response1 = await fetch("http://127.0.0.1:3000/Trending🔥/");
    let response2 = await fetch("http://127.0.0.1:3000/Favourites/");
    let textResponse1 = await response1.text();
    let div = document.createElement("div");
    div.innerHTML = textResponse1;
    let anchorTags = div.getElementsByTagName("a");
    let count = 0;

    for (const file of anchorTags) {
        if (file.href.endsWith(".mp3")) {
            count += 1;
            songs.push(file);
            let trackName = file.href.split("songs/")[0].split("/")[4].replaceAll("%20", " ").slice(0, -4);
            // .replaceAll("%20", " ").slice(0, -4);
            let songElement = createSongElement(count, trackName, file.href);
            library.innerHTML += songElement;
        }
    }

    // Play song on click
    playSongFromList(songs);
}

// Function to create song element dynamically
function createSongElement(count, trackName, fileHref) {
    return `
        <div id="song-${count}" class="side-song text-flow hover-bg p-5 rounded-2 pointer text-flow flex-box align-i-c gap">
            <a class="hidden" href="${fileHref}"></a>
            <img height="25" width="25" src="assets/music.svg" alt="heart">
            <div class="info text-flow border-">
                <h5 class="playlist-name text-flow">${trackName}</h5>
                </div>
                </div>`;
    // <h6 class="creator col-g">Spoofify</h6>
}

// Function to play song from the song list
function playSongFromList(songs) {
    console.log(songs);
    
    for (let i = 0; i < library.children.length; i++) {
        const song = library.children[i];
        song.addEventListener("click", () => {
            let songLink = song.getElementsByTagName("a")[0].href;

            // If this song is already playing, toggle play/pause
            if (currentAudio && currentAudio.src === songLink) {
                if (currentAudio.paused) {
                    currentAudio.play();
                    updatePlayPauseButtons();
                } else {
                    currentAudio.pause();
                    currentAudio = new Audio(songLink);
                    currentAudio.play();
                    updatePlayPauseButtons();
                }
            } else {
                // Stop current playing audio if any
                if (currentAudio) {
                    currentAudio.pause();
                    updatePlayPauseButtons();
                }
                // Create a new audio object and play the new song
                currentAudio = new Audio(songLink);
                currentAudio.play();
                updatePlayPauseButtons();
            }

            playerSong.innerHTML = song.innerHTML;
            updateTimeDisplay();
            handleVolumeControl();
        });
    }
}


//to pause and play song on click
playBtn.addEventListener("click", () => {
    if (currentAudio.paused) {
        currentAudio.play();
    } else if (!currentAudio.paused) {
        currentAudio.pause();
    } else {
        console.log("Select a song or playlist to play.");
    }
    updatePlayPauseButtons();
})
//to pause and play song on click
pauseBtn.addEventListener("click", () => {
    if (currentAudio.paused) {
        currentAudio.play();
    } else if (!currentAudio.paused) {
        currentAudio.pause();
    } else {
        console.log("Select a song or playlist to play.");
    }
    updatePlayPauseButtons();
})


// Function to update play/pause buttons
function updatePlayPauseButtons() {
    if (currentAudio.paused) {
        pauseBtn.style.display = "none";
        playBtn.style.display = "block";
    } else {
        pauseBtn.style.display = "block";
        playBtn.style.display = "none";
    }
}

// Function to update current and total time
function updateTimeDisplay() {
    currentAudio.addEventListener("timeupdate", () => {
        const currentTime = currentAudio.currentTime;
        startTime.innerHTML = timeFormat(parseInt(currentTime));
        indicator.style.width = `${(currentTime / currentAudio.duration) * 100}%`;

        const totalTimeDuration = currentAudio.duration;
        totalTime.innerHTML = timeFormat(parseInt(totalTimeDuration));
    });

    seekBar.addEventListener("click", (e2) => {
        if (e2.offsetX != 0){
            currentAudio.currentTime = currentAudio.duration * ((e2.offsetX / seekBar.offsetWidth));
            currentTime = currentAudio.currentTime;
        indicator.style.width = `${(currentTime / currentAudio.duration) * 100}%`;
    }
})

}

// Function to handle volume control
function handleVolumeControl() {
    volInd.style.width = `${currentAudio.volume * 100}%`;

    volBar.addEventListener("click", (e) => {
        if (e.offsetX != 0) {
            const newVolume = e.offsetX / volBar.offsetWidth;
            currentAudio.volume = newVolume;
            volInd.style.width = `${newVolume * 100}%`;
        }
    });

    muteBtn.addEventListener("click", () => {
        currentAudio.volume = 0.3;
        volInd.style.width = "30%";
        muteBtn.style.display = "none";
        unmuteBtn.style.display = "block";
    });

    unmuteBtn.addEventListener("click", () => {
        currentAudio.volume = 0;
        volInd.style.width = "0%";
        muteBtn.style.display = "block";
        unmuteBtn.style.display = "none";
    });
}

// Function to toggle shuffle
function toggleShuffle() {
    shuffleBtn.addEventListener("click", () => {
        unshuffleBtn.style.display = "block";
        shuffleBtn.style.display = "none";
    });
    unshuffleBtn.addEventListener("click", () => {
        unshuffleBtn.style.display = "none";
        shuffleBtn.style.display = "block";
    });
}

// Function to toggle repeat
function toggleRepeat() {
    repeatBtn.addEventListener("click", () => {
        unrepeatBtn.style.display = "block";
        repeatBtn.style.display = "none";
    });
    unrepeatBtn.addEventListener("click", () => {
        unrepeatBtn.style.display = "none";
        repeatBtn.style.display = "block";
    });
}

// Function to show sidebar on click
function showSideBar() {
    let libHam = document.getElementById("lib-ham");
    let sideBar = document.querySelector('.left');

    libHam.addEventListener("click", () => {
        sideBar.style.left = "0";
        sideBar.style.opacity = "1";
    });
}

// Initialize the music app
function init() {
    loadMusic();
    toggleShuffle();
    toggleRepeat();
    showSideBar();
}

init();
