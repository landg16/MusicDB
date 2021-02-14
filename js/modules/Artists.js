import { fetchPage, getData, shuffleArray, lazyLoadImages, sortByName, sortByYear } from './Helper.js'

class Artists {
    static page() {
        fetchPage('./template/list.html', function (data) {
            document.getElementById('page').innerHTML = data
            document.getElementById('listTitle').innerHTML = 'All Artists'
            document.getElementById('loadMore').style.display = "none"
            loadArtists()

            document.getElementById('sortArtists').onchange = function () {
                loadArtists(this.value)
            }

            search()
        })

        function loadArtists(value, keyword) {
            let loading = document.getElementById('blur')
            let slideTemplate = document.querySelector('#item')
            let list = document.getElementById('list')
            loading.classList.add('show')
            getData('./data/artists.json', function (data) {
                data = data.data
                if (!value) {
                    shuffleArray(data)
                } else {
                    if (value == 'name') {
                        data.sort(sortByName)
                    } else {
                        data.sort(sortByYear)
                    }
                }

                if (keyword) {
                    data = data.filter((item) => {
                        return (
                            String(item.name).toLowerCase().includes(keyword.toLowerCase()) ||
                            String(item.year).toLowerCase().includes(keyword.toLowerCase())
                        )
                    })
                }

                let toCreate = document.createElement('div')
                for (let i = 0; i < data.length; i++) {
                    toCreate.appendChild(createCard(slideTemplate, data[i]))
                }

                list.innerHTML = ''
                if (data.length == 0) {
                    list.innerHTML =
                        "<div class='col-12 not-found'>Sorry, we could not find your desired artist :(</div>"
                } else {
                    list.innerHTML = toCreate.innerHTML
                }

                loading.classList.remove('show')
            }).then(() => {
                lazyLoadImages()
            })
        }

        function createCard(template, data) {
            let clone = template.content.cloneNode(true)
            clone.querySelector('.item-parent').href = '#/artists/' + data.id
            clone.querySelector('.lazy').dataset.src = 'img/artists/' + data.img
            clone.querySelector('h4').style.marginBottom = '10px'
            clone.querySelector('h4').textContent = data.name
            clone.querySelector('p').textContent = data.year
            return clone
        }

        function search() {
            const input = document.getElementById('searchInput')
            const button = document.getElementById('searchBtn')
            button.addEventListener('click', function () {
                const searchVal = input.value
                loadArtists(null, searchVal)
            })
        }
    }

    static detailed(id) {
        fetchPage('./template/artist.html', function (page) {
            document.getElementById('page').innerHTML = page
            getData('./data/artists.json', function (data) {
                data = data.data.filter((item) => {
                    return item.id == id
                })
                data = data[0]
                document.getElementById('title').innerHTML = data.name
                document.getElementById('name').innerHTML = 'Name: ' + data.name
                document.getElementById('year').innerHTML = 'Year Born: ' + data.year

                document.getElementById('description').innerHTML = data.description
                document.getElementById('image').src = '/img/artists/' + data.img

                getData('./data/tracks.json', function (tracks) {
                    tracks = tracks.data.filter((item) => {
                        return item.artist_id == id
                    })
                    document.getElementById('tracks').innerHTML =
                        'Total Tracks: ' + (tracks.length + 1)

                    shuffleArray(tracks)

                    for (let i = 0; i < tracks.length; i++) {
                        createCard(
                            '#/tracks/' + tracks[i].id,
                            '/img/albums/' + tracks[i].img,
                            tracks[i].track_name,
                            tracks[i].album_name,
                            'list'
                        )
                    }
                }).then(() => {
                    lazyLoadImages()
                })

                getData('./data/albums.json', function (albums) {
                    console.log(albums, data.name)
                    albums = albums.data.filter((item) => {
                        return item.artist_name == data.name
                    })

                    shuffleArray(albums)

                    for (let i = 0; i < albums.length; i++) {
                        createCard(
                            '#/albums/' + albums[i].id,
                            '/img/albums/' + albums[i].img,
                            albums[i].album_name,
                            albums[i].artist_name,
                            'album'
                        )
                    }
                })
            })
        })

        function createCard(redirect, url, title, desc, listId) {
            let slideTemplate = document.querySelector('#track')
            let clone = slideTemplate.content.cloneNode(true)
            clone.querySelector('.img').dataset.src = url
            clone.querySelector('h4').textContent = title
            clone.querySelector('p').textContent = desc
            clone.querySelector('a').href = redirect
            document.getElementsByClassName(listId)[0].appendChild(clone)
        }
    }
}

export default Artists