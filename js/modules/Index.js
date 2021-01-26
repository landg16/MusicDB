import { fetchPage, getData, shuffleArray, lazyLoadImages, slider } from './Helper.js'

class Index {
    static page = function () {
        fetchPage('./template/index.html', function (page) {
            document.getElementById('page').innerHTML = page;

            let slideTemplate = document.querySelector('#slide');
            getData('./data/artists.json', function (data) {
                data = data.data;
                shuffleArray(data);
                for (let i = 0; i < 10; i++) {
                    createCard(
                        'featuredArtists',
                        'img/artists/' + data[i].img,
                        data[i].name,
                        data[i].year,
                        '#/artists/' + data[i].id
                    );
                }
            }).then(() => {
                lazyLoadImages();
            });

            slider('featuredArtists');

            getData('./data/albums.json', function (data) {
                data = data.data;
                shuffleArray(data);
                for (let i = 0; i < 10; i++) {
                    createCard(
                        'featuredAlbums',
                        'img/albums/' + data[i].img,
                        data[i].album_name,
                        data[i].artist_name,
                        '#/albums/' + data[i].id
                    );
                }
            }).then(() => {
                lazyLoadImages();
            });

            slider('featuredAlbums');

            getData('./data/tracks.json', function (data) {
                data = data.data;
                shuffleArray(data);
                for (let i = 0; i < 10; i++) {
                    createCard(
                        'featuredTracks',
                        'img/albums/' + data[i].img,
                        data[i].track_name,
                        data[i].artist_name + ' - ' + data[i].album_name,
                        '#/tracks/' + data[i].id
                    );
                }
            }).then(() => {
                lazyLoadImages();
            });
            slider('featuredTracks');

            // Kanye REST!!!
            getData('https://api.kanye.rest/', function (data) {
                document.getElementsByClassName('subtitle')[0].textContent =
                    data.quote + ' - Kanye West';
            });

            function createCard(elementId, img, title, desc, url) {
                let slideTemplate = document.querySelector('#slide');
                let clone = slideTemplate.content.cloneNode(true);
                clone.querySelector('a').href = url;
                clone.querySelector('.img').dataset.src = img;
                clone.querySelector('h4').textContent = title;
                clone.querySelector('p').textContent = desc;
                document
                    .getElementById(elementId)
                    .getElementsByClassName('carousel-row')[0]
                    .appendChild(clone);
            }
        });
    };
}

export default Index