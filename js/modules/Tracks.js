// import { fetchPage, getData, shuffleArray, lazyLoadImages } from './Helper.js';

class Tracks {
    static page() {
        fetchPage('./template/list.html', function (page) {
            document.getElementById('page').innerHTML = page;
            document.getElementById('listTitle').innerHTML = 'All Tracks';
            document.getElementById('sort').style.display = 'none';
            loadTracks();
            search();
        });

        function loadTracks(keyword) {
            let loading = document.getElementById('blur');
            let slideTemplate = document.querySelector('#item');
            let list = document.getElementById('list');
            loading.classList.add('show');
            getData('./data/tracks.json', function (data) {
                data = data.data;
                shuffleArray(data);
                if (keyword) {
                    data = data.filter((item) => {
                        return (
                            String(item.artist_name)
                                .toLowerCase()
                                .includes(keyword.toLowerCase()) ||
                            String(item.track_name).toLowerCase().includes(keyword.toLowerCase())
                        );
                    });
                }

                let dataLength = data.length;
                let toCreate = document.createElement('div');
                const loadSize = 16;
                let pagination = loadSize;
                if (dataLength < loadSize) {
                    pagination = dataLength;
                }

                for (let i = 0; i < pagination; i++) {
                    toCreate.appendChild(createCard(slideTemplate, data[i]));
                }

                const btn = document.getElementById('loadMore');
                btn.removeEventListener('clicl', function () {});
                btn.addEventListener('click', function () {
                    toCreate = document.createElement('div');
                    let toAdd = 0;
                    if (dataLength - pagination - loadSize > 0) {
                        toAdd = loadSize;
                    } else {
                        toAdd = dataLength - pagination;
                    }
                    console.log(data);
                    for (let i = pagination; i < pagination + toAdd; i++) {
                        toCreate.appendChild(createCard(slideTemplate, data[i]));
                    }
                    pagination += toAdd;
                    list.innerHTML += toCreate.innerHTML;
                    lazyLoadImages();
                    if (dataLength - pagination == 0) {
                        this.style.display = 'none';
                    }
                });
                console.log('pagination', pagination);
                console.log('dataLength', dataLength);
                if (pagination >= dataLength) {
                    btn.style.display = 'none';
                }

                list.innerHTML = '';
                if (data.length == 0) {
                    list.innerHTML =
                        "<div class='col-12 not-found'>Sorry, we could not find your desired artist :(</div>";
                } else {
                    list.innerHTML = toCreate.innerHTML;
                }

                loading.classList.remove('show');
            }).then(() => {
                lazyLoadImages();
            });
        }

        function createCard(template, data) {
            let clone = template.content.cloneNode(true);
            clone.querySelector('.item-parent').href = '#/tracks/' + data.id;
            clone.querySelector('.lazy').dataset.src = 'img/albums/' + data.img;
            clone.querySelector('h4').style.marginBottom = '10px';
            clone.querySelector('h4').textContent = data.track_name;
            clone.querySelector('p').textContent = data.artist_name;
            return clone;
        }

        function search() {
            const input = document.getElementById('searchInput');
            const button = document.getElementById('searchBtn');
            button.addEventListener('click', function () {
                const searchVal = input.value;
                loadTracks(searchVal);
            });
        }
    }

    static detailed(id) {
        fetchPage('./template/track.html', function (page) {
            document.getElementById('page').innerHTML = page;

            getData('./data/tracks.json', function (data) {
                let track = data.data.filter((item) => {
                    return item.id == id;
                });
                track = track[0];

                let albumTracks = data.data.filter((item) => {
                    return item.album_id == track.album_id && item.id != track.id;
                });

                shuffleArray(albumTracks);

                for (let i = 0; i < albumTracks.length; i++) {
                    createCard(
                        '#/tracks/' + albumTracks[i].id,
                        '/img/albums/' + albumTracks[i].img,
                        albumTracks[i].track_name,
                        albumTracks[i].artist_name,
                        'list'
                    );
                }

                track.lyrics = track.lyrics.replaceAll('\n', '<br />').replace('...', '');
                document.getElementById('title').innerHTML =
                    track.track_name + ' by ' + track.artist_name;
                document.getElementById('album').innerHTML = track.album_name;
                document.getElementById('image').src = '/img/albums/' + track.img;
                document.getElementById('lyrics').innerHTML = track.lyrics;
            }).then(() => {
                lazyLoadImages();
            });
        });

        function createCard(redirect, url, title, desc, listId) {
            let slideTemplate = document.querySelector('#track');
            let clone = slideTemplate.content.cloneNode(true);
            clone.querySelector('.img').dataset.src = url;
            clone.querySelector('h4').textContent = title;
            clone.querySelector('p').textContent = desc;
            clone.querySelector('a').href = redirect;
            document.getElementsByClassName(listId)[0].appendChild(clone);
        }
    }
}

// export default Tracks;
