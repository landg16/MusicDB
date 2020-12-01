/* eslint-disable no-console */
/* eslint-disable no-alert */

import Router from './Router.js'

const router = new Router({
    mode: 'hash',
    root: '/'
})

const index = function() {
    fetch("./template/main.html")
        .then(response => {
            return response.text()
        })
        .then(data => {
            document.getElementById("page").innerHTML = data;
            slider('featuredArtists')
            slider('featuredAlbums')
            slider('featuredTracks')
        });
}

const about = function() {
    fetch("./template/about.html")
        .then(response => {
            return response.text()
        })
        .then(data => {
            document.getElementById("page").innerHTML = data;
        });
}

router
    .add(/about/, about)
    .add('', index) // this should always be last

function slider(id) {
    const sliderContainer = document.getElementById(id)
    const slides = sliderContainer.getElementsByClassName('slide')
    let count = (window.innerWidth < 768) ? 1 : 4
    let current = 0

    addHide(slides, current, count)
    
    window.addEventListener("resize", function() {
        count = (window.innerWidth < 768) ? 1 : 4
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