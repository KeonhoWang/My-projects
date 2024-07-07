document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("audio");
  const playPauseButton = document.getElementById("playPause");
  const seekSlider = document.getElementById("seek");
  const currentTimeSpan = document.getElementById("currentTime");
  const durationSpan = document.getElementById("duration");
  const playlist = document.getElementById("playlist");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");
  const albumArt = document.getElementById("albumArt");

  const songs = [
    {
      title: "Joost Klein - Europapa",
      src: "song/Joost Klein - Europapa.mp3",
      art: "songimg/Europapa.png",
    },
    {
      title: "Psy -Gangnam Style",
      src: "song/PSY - GANGNAM STYLE.mp3",
      art: "songimg/GANGNAMSTYLE.png",
    },
    {
      title: "NME - German",
      src: "song/NME - German.mp3",
      art: "songimg/German.png",
    },
    {
      title: "Offset - Don't you lie",
      src: "song/Offset - DON'T YOU LIE.mp3",
      art: "songimg/dontyoulie.png",
    },
    {
      title: "EUNG Freestyle",
      src: "song/EUNG FREESTYLE.mp3",
      art: "songimg/eung.png",
    },
  ];

  let currentSongIndex = 0;
  let isPlaying = false;

  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = song.title;
    li.dataset.index = index;
    playlist.appendChild(li);
  });

  loadSong(currentSongIndex);

  playPauseButton.addEventListener("click", () => {
    if (isPlaying) {
      audio.pause();
      playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
    } else {
      audio.play();
      playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
  });

  audio.addEventListener("timeupdate", () => {
    seekSlider.value = (audio.currentTime / audio.duration) * 100;
    currentTimeSpan.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener("loadedmetadata", () => {
    durationSpan.textContent = formatTime(audio.duration);
    seekSlider.max = audio.duration;
  });

  seekSlider.addEventListener("input", () => {
    audio.currentTime = (seekSlider.value / 100) * audio.duration;
  });

  audio.addEventListener("ended", () => {
    nextSong();
  });

  playlist.addEventListener("click", (e) => {
    if (e.target && e.target.nodeName === "LI") {
      currentSongIndex = parseInt(e.target.dataset.index);
      loadSong(currentSongIndex);
      audio.play();
      isPlaying = true;
      playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
    }
  });

  prevButton.addEventListener("click", () => {
    prevSong();
  });

  nextButton.addEventListener("click", () => {
    nextSong();
  });

  function loadSong(index) {
    audio.src = songs[index].src;
    albumArt.src = songs[index].art;
    audio.load();
    updatePlaylistUI(index);
  }

  function updatePlaylistUI(index) {
    const items = playlist.querySelectorAll("li");
    items.forEach((item) => {
      item.classList.remove("active");
    });
    items[index].classList.add("active");
  }

  function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    if (isPlaying) audio.play();
  }

  function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    if (isPlaying) audio.play();
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }
});
