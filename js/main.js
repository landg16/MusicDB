/* eslint-disable no-console */
/* eslint-disable no-alert */

import Router from './Router.js'

const router = new Router({
    mode: 'hash',
    root: '/'
})

const index = function() {
    fetchPage("./template/main.html", function(data) {
        document.getElementById("page").innerHTML = data

        // Add data to featured artists
        let slideTemplate = document.querySelector('#slide');
        getData("./data/artists.json", function(data) {
            data = data.data
            shuffleArray(data)
            for (let i = 0; i < data.length / 2; i++) {
                let clone = slideTemplate.content.cloneNode(true)
                clone.querySelector('.img').style.backgroundImage = "url('img/artists/" + data[i].img + "')"
                clone.querySelector('h4').style.marginBottom = "10px"
                clone.querySelector('h4').textContent = data[i].name
                clone.querySelector('p').style.display = "none"
                document.getElementById('featuredArtists').getElementsByClassName('carousel-row')[0].appendChild(clone)
            }
        })

        slider('featuredArtists')

        getData("./data/albums.json", function(data) {
            data = data.data
            shuffleArray(data)
            for (let i = 0; i < data.length / 2; i++) {
                let clone = slideTemplate.content.cloneNode(true)
                clone.querySelector('.img').style.backgroundImage = "url('img/albums/" + data[i].img + "')"
                clone.querySelector('h4').textContent = data[i].album_name
                clone.querySelector('p').textContent = data[i].artist_name
                document.getElementById('featuredAlbums').getElementsByClassName('carousel-row')[0].appendChild(clone)
            }
        })

        slider('featuredAlbums')

        getData("./data/tracks.json", function(data) {
            data = data.data
            shuffleArray(data)
            for (let i = 0; i < data.length / 2; i++) {
                let clone = slideTemplate.content.cloneNode(true)
                clone.querySelector('.img').style.backgroundImage = "url('img/albums/" + data[i].img + "')"
                clone.querySelector('h4').textContent = data[i].track_name
                clone.querySelector('p').textContent = data[i].artist_name + " - " + data[i].album_name
                document.getElementById('featuredTracks').getElementsByClassName('carousel-row')[0].appendChild(clone)
            }
        })
        slider('featuredTracks')

        // Kanye REST!!!
        getData('https://api.kanye.rest/', function(data) {
            document.getElementsByClassName('subtitle')[0].textContent = data.quote + " - Kanye West"
        })
    });
}

const about = function() {
    fetchPage("./template/about.html", function(data) {
        document.getElementById("page").innerHTML = data;
    });
}

router
    .add(/about/, about)
    .add('', index) // this should always be last

window.onload = function() {
    const navigation = document.getElementsByClassName('nav-link')
    for(let i = 0; i < navigation.length; i++) {
        navigation[i].onclick = function() {
            document.getElementById('nav-check').checked = false
        }
    }
}

function getWidth() {
    return parseFloat(getComputedStyle(document.body, null).width.replace("px", "")) // for accurate width
}

function slider(id) {
    const sliderContainer = document.getElementById(id)
    const slides = sliderContainer.getElementsByClassName('slide')
    let count = (getWidth() < 768) ? 1 : 4
    let current = 0

    addHide(slides, current, count)

    window.addEventListener("resize", function() {
        count = (getWidth() < 768) ? 1 : 4
        addHide(slides, current, count)
    })

    const nextBtn = sliderContainer.getElementsByClassName('next')[0]
    const prevBtn = sliderContainer.getElementsByClassName('prev')[0]
    nextBtn.onclick = function() {
        if (current + count == slides.length) return
        current++
        addHide(slides, current, count)
    }

    prevBtn.onclick = function() {
        if (current - 1 < 0) return
        current--
        addHide(slides, current, count)
    }
}

function addHide(slides, current, count) {
    for(let i = 0; i < slides.length; i++) {
        if (i < current || i >= current + count) {
            slides[i].classList.add('hide')
        } else {
            slides[i].classList.remove('hide')
        }
    }
}

function fetchPage(path, callback) {
    fetch(path)
        .then(response => {
            return response.text()
        })
        .then(data => {
            callback(data)
        });
}

function getData(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var data = JSON.parse(httpRequest.responseText);
                if (callback) callback(data);
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send(); 
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}