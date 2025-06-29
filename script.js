console.log("Hello World")
let current_songs = new Audio();
let songs;
async function songs_fetch() {

    let a = await fetch('https://github.com/Abhishekhash101/spotifyclone/tree/main/assets/songs/')
    let response = await a.text()
    // console.log(response)

    let div = document.createElement('div')
    div.innerHTML = response;

    let a_tag = div.getElementsByTagName('a')
    // console.log(a_tag)
    let songs = []
    for (let index = 0; index < a_tag.length; index++) {
        const element = a_tag[index];

        if (element.href.endsWith('mp3')) {
            songs.push(element.href.split("assets/songs/")[1].replaceAll('%20', ' '))
        }

    }

    return songs


}

function formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);

    // Add leading zero if seconds are less than 10
    if (sec < 10) {
        sec = `0${sec}`;
    }

    return `${min}:${sec}`;
}

// Timing function with seekbar update
current_songs.addEventListener('timeupdate', () => {
    if (!isNaN(current_songs.duration)) {
        document.querySelector('.song_time').innerHTML =
            formatTime(current_songs.currentTime) + " / " + formatTime(current_songs.duration);
    } else {
        document.querySelector('.song_time').innerHTML = "0:00 / 0:00";
    }

    // Move the circle according to current time
    document.querySelector('.circle').style.left =
        (current_songs.currentTime / current_songs.duration) * 100 + '%';
});

// Seekbar click to jump to time
document.querySelector('.seekbar').addEventListener('click', e => {
    let seekbar = e.currentTarget;
    let percent = e.offsetX / seekbar.clientWidth;
    current_songs.currentTime = percent * current_songs.duration;
});


let PlayMusic = (song_name, pause = false) => {
    // let audio = new Audio('assets/songs/'+song_name)
    // audio.play()
    current_songs.src = 'assets/songs/' + song_name
    document.querySelector('.song_info').innerHTML = song_name;

    if (!pause) {

        current_songs.play()
        play_song.src = 'assets/pause.svg'
    }


}

async function main() {


    songs = await songs_fetch()
    console.log(songs)
    console.log('the song', songs[0])
    PlayMusic(songs[0], true)

    let songUL = document.querySelector('.song_list').getElementsByTagName('ul')[0];
    console.log(songUL.innerHTML)

    for (const song of songs) {
        console.log(song)
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" width="34" src="assets/music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <div>Abhishek</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="assets/play.svg" alt="">
                            </div> </li>`;

    }

    Array.from(document.querySelector('.song_list').getElementsByTagName('li')).forEach((e) => {
        e.addEventListener('click', element => {
            console.log(e.querySelector('.info').firstElementChild.innerHTML)
            PlayMusic(e.querySelector('.info').firstElementChild.innerHTML.trim())
        })
    })

    let previous_song = document.getElementById('previous_song')
    let play_song = document.getElementById('play_song')
    let next_song = document.getElementById('next_song')
    console.log(play_song)

    play_song.addEventListener('click', () => {
        if (current_songs.paused) {
            current_songs.play()
            play_song.src = 'assets/pause.svg'
        }
        else {
            play_song.src = 'assets/play.svg'
            current_songs.pause()
        }
    })

    document.querySelector('.hamberger').addEventListener('click', () => {
        document.querySelector('.left').style.left = '0';
        document.querySelector('.left').style.width = 95 + 'vw';
    });

    document.querySelector('.cross').addEventListener('click', () => {
        document.querySelector('.left').style.left = '-200%';
    });

    previous_song.addEventListener('click', () => {
        let currentIndex = songs.indexOf(current_songs.src.split("assets/songs/")[1].replaceAll('%20', ' '));
        let prevIndex = (currentIndex - 1 + songs.length) % songs.length;  // loops back if at start
        console.log('Previous song:', songs[prevIndex]);
        PlayMusic(songs[prevIndex]);
    });

    next_song.addEventListener('click', () => {
        let currentIndex = songs.indexOf(current_songs.src.split("assets/songs/")[1].replaceAll('%20', ' '));
        let nextIndex = (currentIndex + 1) % songs.length;  // loops back if at end
        console.log('Next song:', songs[nextIndex]);
        PlayMusic(songs[nextIndex]);
    });


    document.querySelector('.range').addEventListener('change', (e) => {
        let volume = parseFloat(e.target.value) / 100;  // Convert 0-100 to 0.0-1.0
        current_songs.volume = volume;
        console.log('Volume set to:', volume);
    });



}

main()


