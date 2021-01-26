import { fetchPage, getData, shuffleArray, lazyLoadImages } from './Helper.js';

class Albums {
    static page() {
        fetchPage('./template/list.html', function (page) {
            document.getElementById('page').innerHTML = page;
            document.getElementById('listTitle').innerHTML = 'All Albums';
            document.getElementById('sort').style.display = 'none';
            loadAlbums();
            search();
        });

        function loadAlbums(keyword = null) {
            let loading = document.getElementById('blur');
            let slideTemplate = document.querySelector('#item');
            let list = document.getElementById('list');
            loading.classList.add('show');
            getData('./data/albums.json', function (data) {
                data = data.data;
                shuffleArray(data);
                if (keyword) {
                    data = data.filter((item) => {
                        return (
                            String(item.artist_name)
                                .toLowerCase()
                                .includes(keyword.toLowerCase()) ||
                            String(item.album_name).toLowerCase().includes(keyword.toLowerCase())
                        );
                    });
                }

                let toCreate = document.createElement('div');
                for (let i = 0; i < data.length; i++) {
                    toCreate.appendChild(createCard(slideTemplate, data[i]));
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
            clone.querySelector('.item-parent').href = '#/albums/' + data.id;
            clone.querySelector('.lazy').dataset.src = 'img/albums/' + data.img;
            clone.querySelector('h4').style.marginBottom = '10px';
            clone.querySelector('h4').textContent = data.album_name;
            clone.querySelector('p').textContent = data.artist_name;
            return clone;
        }

        function search() {
            const input = document.getElementById('searchInput');
            const button = document.getElementById('searchBtn');
            button.addEventListener('click', function () {
                const searchVal = input.value;
                loadAlbums(searchVal);
            });
        }
    }

    static detailed = function (id) {
        fetchPage('./template/album.html', function (page) {
            document.getElementById('page').innerHTML = page;

            getData('./data/albums.json', function (data) {
                data = data.data.filter((item) => {
                    return item.id == id;
                });
                data = data[0];
                document.getElementById('title').innerHTML =
                    data.album_name + ' by ' + data.artist_name;
                document.getElementById('image').src = '/img/albums/' + data.img;

                getData('./data/tracks.json', function (tracks) {
                    tracks = tracks.data.filter((item) => {
                        return item.album_id == id;
                    });

                    shuffleArray(tracks);

                    for (let i = 0; i < tracks.length; i++) {
                        createCard(
                            tracks[i].id,
                            tracks[i].track_name,
                            tracks[i].album_name,
                            tracks[i].artist_name,
                            'list'
                        );
                    }
                });
            });
        });

        function createCard(id, track_name, album_name, artist_name, listId) {
            let slideTemplate = document.querySelector('#track');
            let clone = slideTemplate.content.cloneNode(true);
            clone.getElementById('id').textContent = id;
            clone.getElementById('track_name').textContent = track_name;
            clone.getElementById('album_name').textContent = album_name;
            clone.getElementById('artist_name').textContent = artist_name;
            clone.querySelector('tr').onclick = function() {
                window.location = '#/tracks/' + id
            }
            document.getElementById(listId).appendChild(clone);
        }
    };
}

export default Albums;
