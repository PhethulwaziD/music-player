const range = document.querySelector('#range');
const musicContainer = document.querySelector('.music-container');
const playBtn = document.querySelector("#play");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");
const audio = document.querySelector("#audio");
const title = document.querySelector("#title");
const img = document.querySelector(".img-container");
const start = document.querySelector('.start');
const end = document.querySelector('.end');
const shuffle = document.querySelector('#shuffle');
const repeat = document.querySelector('#repeat');
const playlist = document.querySelector(".playlist");
const songMenu = document.querySelector(".song-menu");
//Songs
const songs = [{name: "Dj Obza - Todii Ft Mr Brown & Prince Benza", duration: "05:25"},
              {name:"Blaq Diamond - SummerYoMuthi", duration: "04:34"},
              {name: "Mi Casa - Mamela", duration: "05:13"},
              {name: "Vula Mlomo", duration: "07:21"},
              {name: "Weekend", duration:"06:12"},
              {name:"De Mthuda John Wick", duration: "05:25"}];

//Current song
let index = 0;
let playing = 0;

//Append playlist
songs.forEach((item, i) => {
  let song = `./resources/music/${item.name}.mp3`;
  let container = document.createElement("div");
  let playIcon = document.createElement("span");
  let icon = document.createElement("i");
  let songCover = document.createElement("div");
  let details = document.createElement("div");

  songCover.style = `background:url('./resources/avatars/${item.name}.jpg'); background-size: cover; background-position: center; background-size: 80px; background-repeat: no-repeat;`;
  // if (i == index) {
  //     playing = icon;
  //     icon.classList.add("active");
  // }
  container.classList.add("song-container");
  icon.classList.add("fa-play-circle");
  icon.classList.add("fas")
  songCover.classList.add("song-cover");
  details.classList.add("song-details");
  details.innerHTML = ` <div class="song-details">
                          <span>${item.name}</span>
                          <span>${item.duration}</span>
                        </div>`;
  playIcon.appendChild(icon);
  container.appendChild(playIcon);
  container.appendChild(songCover);
  container.appendChild(details);
  playlist.appendChild(container);
});

//Load Songs
loadSong(songs[index]);

// //Event Listeners
range.onchange = updateRange
playBtn.onclick = playPause;
prevBtn.onclick = previousSong;
nextBtn.onclick = nextSong;
audio.ontimeupdate = updateProgress;
audio.onended = playNextSong;
repeat.onclick = setRepeat;
shuffle.onclick = setShuffle;
songMenu.onclick = openMenu;
playlist.onclick = selectSong;
// //Functions

function loadSong(song) {
  title.innerText = song.name;
  audio.src = `./resources/music/${song.name}.mp3`;
  img.style = `
    background:url('./resources/avatars/${song.name}.jpg');
    background-size: cover;
    background-position: center;
    background-size: 304px;
    background-repeat: no-repeat;`;

}

function updateRange(e) {
  let value = (e.target.value - e.target.min)/(e.target.max - e.target.min)*100;
  range.style.background = `linear-gradient(to right, #e91e63 0%, #e91e63 ${value}%, #9e9e9e47 ${value}%, #9e9e9e47 100%)`;
  audio.currentTime = (value/e.target.max) * audio.duration;
}

function playPause() {
  const isPlaying = musicContainer.classList.contains('play');
  updateOnPlaylist()
  if(isPlaying) {
    updateOnPlaylist()
    pauseSong();
  } else {
    updateOnPlaylist()
    playSong();
  }
}

function playSong() {
  musicContainer.classList.add("play");
  playBtn.querySelector('i.fas').classList.remove('fa-play');
  playBtn.querySelector('i.fas').classList.add('fa-pause');
  playBtn.style.paddingRight = '0px';
  playBtn.style.paddingLeft = '1px';
  audio.play();
}

function pauseSong() {
  musicContainer.classList.remove("play");
  playBtn.querySelector('i.fas').classList.remove('fa-pause');
  playBtn.querySelector('i.fas').classList.add('fa-play');
  playBtn.style.paddingLeft = '5px';
  playBtn.style.paddingRight = '0px';
  audio.pause();
}

function openMenu() {
  songMenu.querySelector("i.fas").classList.toggle("fa-angle-down");
  songMenu.querySelector("i.fas").classList.toggle("fa-angle-up");
  playlist.classList.toggle("active-menu")
}


function selectSong(e) {
  let song = e.target;
  if (song.classList.contains("song-container")) {
    let songContainer = song.children
    let currentIcon = songContainer[0].firstElementChild
    let paused = songState(currentIcon, 'fa-play-circle');
    let state = songState(currentIcon, "active");
    let name = getSongName(songContainer);
    let currentIndex = songs.findIndex((object => object.name == name));

    if (state && !paused  && index == currentIndex) {
      updateToPause(currentIcon);
      pauseSong();
    } else if(state && paused && index == currentIndex) {
      updateToPlay(currentIcon);
        playSong()
    } else if(playing != currentIcon){
      loadSong(songs[currentIndex]);
      if (playing != 0) {
        updateToPause(playing);
        playing.classList.remove("active");
      }
      updateToPlay(currentIcon);
      playSong()
      currentIcon.classList.add("active");
      playing = currentIcon;
      index = currentIndex;
    }
  }

}

function updateToPause(currentIcon) {

  currentIcon.classList.remove("fa-pause-circle");
  currentIcon.classList.add("fa-play-circle");
}

function updateToPlay(currentIcon) {
  currentIcon.classList.remove("fa-play-circle");
  currentIcon.classList.add("fa-pause-circle");


}

function getSongName(songContainer) {
  let name = songContainer[2].firstElementChild.firstElementChild.innerText;
  return name;
}

function songState(element, search) {
  return element.classList.contains(search);
}


///////////////////////////////////////////////////////////////////////////////////////
function updateOnPlaylist() {
  // const isPlaying = musicContainer.classList.contains('play');
  // let elements = playlist.children
  // let currentIcon = elements[index].firstElementChild.firstElementChild;
  // let paused = songState(currentIcon, 'fa-play-circle');
  // let state = songState(currentIcon, "active");
  // updateToPlay(currentIcon);
  // // console.log("cool")
  // // if ((state || !state) && !paused) {
  // //   updateToPlay(currentIcon)
  // // } else if (state && paused) {
  // //   updateToPause(currentIcon);
  // // }
}

////////////////////////////////////////////////////////////////////////////////////////
//ChangeSong
function nextSong() {
  if (repeat.classList.contains("active")) {
    index = index;
  }
  else if (shuffle.classList.contains("active")) {
    let min = Math.ceil(0);
    let max = Math.floor(songs.length - 1);
    index = Math.floor(Math.random() * (max - min + 1) + min);
    console.log(index);
  }
  else if (index == songs.length - 1) {
    index = 0;
  } else {
    index++;
  }
  loadSong(songs[index]);
  playSong();
}

function previousSong() {
  if (index == 0) {
    index = songs.length - 1
  } else {
    index--;
  }
  loadSong(songs[index]);
  playSong();
}

function updateProgress(e) {
  const {duration, currentTime} = e.srcElement;
  let progressPercent = ((currentTime - 0.5)/ duration) * 100;
  if(!progressPercent)
    progressPercent = 0;
  range.value = progressPercent;
  range.style.background = `linear-gradient(to right, #e91e63 0%, #e91e63 ${progressPercent}%, #9e9e9e47 ${progressPercent}%, #9e9e9e47 100%)`;
  if (duration && currentTime > 0) {
    //end.innerText = duration
    start.innerText = calculateTime(currentTime);
    end.innerText = calculateTime(duration);
  }
}

function calculateTime(time) {
  let s = parseInt(time % 60);
  let m = parseInt((time / 60) % 60);
  if (m < 10)
    m = "0" + m;
  if (s < 10)
    s = "0" + s;
  return (m + ':' + s);
}

function playNextSong() {
  nextSong();
}

function setShuffle() {
  shuffle.classList.toggle("active");
}

function setRepeat() {
  repeat.classList.toggle("active");
}
