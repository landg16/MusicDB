/* eslint-disable no-console */
/* eslint-disable no-alert */

import Router from './Router.js';

const router = new Router({
    mode: 'hash',
    root: '/',
});

function sortByName(a, b) {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    if (nameA < nameB) {
        return -1;
    }

    if (nameA > nameB) {
        return 1;
    }

    return 0;
}

function sortByYear(a, b) {
    return b.year - a.year;
}

const index = function () {
    fetchPage('./template/main.html', function (page) {
        document.getElementById('page').innerHTML = page;

        let slideTemplate = document.querySelector('#slide');
        getData('./data/artists.json', function (data) {
            data = data.data;
            shuffleArray(data);
            for (let i = 0; i < data.length / 2; i++) {
                createCard('featuredArtists', 'img/artists/' + data[i].img, data[i].name, data[i].year, '#/artists/' + data[i].id);
            }
        }).then(() => {
            lazyLoadImages();
        });

        slider('featuredArtists');

        getData('./data/albums.json', function (data) {
            data = data.data;
            shuffleArray(data);
            for (let i = 0; i < data.length / 2; i++) {
                createCard('featuredAlbums', 'img/albums/' + data[i].img, data[i].album_name, data[i].artist_name, '#');
            }
        }).then(() => {
            lazyLoadImages();
        });

        slider('featuredAlbums');

        getData('./data/tracks.json', function (data) {
            data = data.data;
            shuffleArray(data);
            for (let i = 0; i < data.length / 2; i++) {
                createCard('featuredTracks', 'img/albums/' + data[i].img, data[i].track_name, data[i].artist_name + ' - ' + data[i].album_name, '#');
            }
        }).then(() => {
            lazyLoadImages();
        });
        slider('featuredTracks');

        // Kanye REST!!!
        getData('https://api.kanye.rest/', function (data) {
            document.getElementsByClassName('subtitle')[0].textContent = data.quote + ' - Kanye West';
        });

        function createCard(elementId, img, title, desc, url) {
            let slideTemplate = document.querySelector('#slide');
            let clone = slideTemplate.content.cloneNode(true);
            clone.querySelector('a').href = url
            clone.querySelector('.img').dataset.src = img;
            clone.querySelector('h4').textContent = title;
            clone.querySelector('p').textContent = desc;
            document.getElementById(elementId).getElementsByClassName('carousel-row')[0].appendChild(clone);
        }
    });
};

const about = function () {
    fetchPage('./template/about.html', function (data) {
        document.getElementById('page').innerHTML = data;
    });
};

const artists = function () {
    fetchPage('./template/artists.html', function (data) {
        document.getElementById('page').innerHTML = data;

        loadArtists();

        document.getElementById('sortArtists').onchange = function () {
            loadArtists(this.value);
        };

        search();
    });

    function loadArtists(value = null, keyword = null) {
        let loading = document.getElementById('blur')
        let slideTemplate = document.querySelector('#item')
        let list = document.getElementById('list');
        loading.classList.add('show');
        getData('./data/artists.json', function (data) {
            data = data.data;
            if (!value) {
                shuffleArray(data);
            } else {
                if (value == 'name') {
                    data.sort(sortByName);
                } else {
                    data.sort(sortByYear);
                }
            }

            if (keyword) {
                data = data.filter((item) => {
                    return String(item.name).toLowerCase().includes(keyword) || String(item.year).toLowerCase().includes(keyword);
                });
                console.log(data)
            }
            console.log(data)

            
            let toCreate = document.createElement('div');
            for (let i = 0; i < data.length; i++) {
                toCreate.appendChild(createCard(slideTemplate, data[i]));
            }

            list.innerHTML = '';
            if(data.length == 0) {
                list.innerHTML = "<div class='col-12 not-found'>Sorry, we could not find your desired artist :(</div>"
            } else {
                list.innerHTML = toCreate.innerHTML;
            }
            
            loading.classList.remove('show');
        })
        .then(() => {
            lazyLoadImages();
        });
    }

    function createCard(template, data) {
        let clone = template.content.cloneNode(true);
        clone.querySelector('.item-parent').href = '#/artists/' + data.id
        clone.querySelector('.lazy').dataset.src = 'img/artists/' + data.img;
        clone.querySelector('h4').style.marginBottom = '10px';
        clone.querySelector('h4').textContent = data.name;
        clone.querySelector('p').textContent = data.year;
        return clone;
    }

    function search() {
        const input = document.getElementById('searchInput');
        const button = document.getElementById('searchBtn');
        button.addEventListener('click', function () {
            const searchVal = input.value;
            loadArtists(null, searchVal);
        });
    }
};

const artistPage = function (id) {
    fetchPage('./template/artist-details.html', function (page) {
        document.getElementById('page').innerHTML = page;
        getData('./data/artists.json', function (data) {
            console.log(data)
            data = data.data.filter((item) => {
                return item.id == id;
            })
            data = data[0]
            document.getElementById('title').innerHTML = data.name
            document.getElementById('description').innerHTML = data.description
            document.getElementById('image').src = '/img/artists/' + data.img

            getData('./data/tracks.json', function(tracks) {
                console.log(tracks)
                tracks = tracks.data.filter((item) => {
                    return item.artist_id == id;
                })

                for(let i = 0; i < tracks.length; i++) {
                    createCard('/img/albums/' + tracks[i].img, tracks[i].track_name, tracks[i].album_name)
                }

                console.log(tracks)
            })
            .then(() => {
                lazyLoadImages();
            });
        });
    });

    function createCard(url, title, desc) {
        let slideTemplate = document.querySelector('#track');
        let clone = slideTemplate.content.cloneNode(true);
        clone.querySelector('.img').dataset.src = url;
        clone.querySelector('h4').textContent = title;
        clone.querySelector('p').textContent = desc;
        document.getElementsByClassName('list')[0].appendChild(clone);
    }
}

router
    .add(/artists\/(.*)/, artistPage)
    .add(/artists/, artists)
    .add(/about/, about)
    .add('', index); // this should always be last

window.onload = function () {
    const navigation = document.getElementsByClassName('nav-link');
    for (let i = 0; i < navigation.length; i++) {
        navigation[i].onclick = function () {
            document.getElementById('nav-check').checked = false;
        };
    }
};

function lazyLoadImages() {
    var lazyImages = [].slice.call(document.querySelectorAll('.lazy'));

    if ('IntersectionObserver' in window) {
        let lazyImageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    loadSprite(lazyImage);
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(function (lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        console.log('Your browser does not suppor Intersection Observer :(');
    }
}

function loadSprite(imageObject) {
    var sprite = new Image();
    sprite.onload = function () {
        imageObject.style.cssText = "background-image: url('" + imageObject.dataset.src + "');";
        imageObject.classList.remove('lazy');
    };
    sprite.src = imageObject.dataset.src;
}

function getWidth() {
    return parseFloat(getComputedStyle(document.body, null).width.replace('px', '')); // for accurate width
}

function slider(id) {
    const sliderContainer = document.getElementById(id);
    const slides = sliderContainer.getElementsByClassName('slide');
    let count = getWidth() < 768 ? 1 : 4;
    let current = 0;

    addHide(slides, current, count);

    window.addEventListener('resize', function () {
        count = getWidth() < 768 ? 1 : 4;
        addHide(slides, current, count);
    });

    const nextBtn = sliderContainer.getElementsByClassName('next')[0];
    const prevBtn = sliderContainer.getElementsByClassName('prev')[0];
    nextBtn.onclick = function () {
        if (current + count == slides.length) return;
        current++;
        addHide(slides, current, count);
    };

    prevBtn.onclick = function () {
        if (current - 1 < 0) return;
        current--;
        addHide(slides, current, count);
    };
}

function addHide(slides, current, count) {
    for (let i = 0; i < slides.length; i++) {
        if (i < current || i >= current + count) {
            slides[i].classList.add('hide');
        } else {
            slides[i].classList.remove('hide');
        }
    }
}

function fetchPage(path, callback) {
    fetch(path)
        .then((response) => {
            return response.text();
        })
        .then((data) => {
            callback(data);
        });
}

function getData(path, callback) {
    return new Promise((resolve, reject) => {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    var data = JSON.parse(httpRequest.responseText);
                    if (callback) {
                        callback(data);
                        return resolve();
                    } else {
                        return reject();
                    }
                }
            }
        };
        httpRequest.open('GET', path);
        httpRequest.send();
    });
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
