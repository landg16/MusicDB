import Router from './modules/Router.js'
import Index from './modules/Index.js'
import About from './modules/About.js'
import Artists from './modules/Artists.js'
import Albums from './modules/Albums.js'

const router = new Router({
    root: '/',
})

router
    .add(/albums\/(.*)/, Albums.detailed)
    .add(/albums/, Albums.page)
    .add(/artists\/(.*)/, Artists.detailed)
    .add(/artists/, Artists.page)
    .add(/about/, About.page)
    .add('', Index.page) // this should always be last

window.onload = function () {
    const navigation = document.getElementsByClassName('nav-link');
    for (let i = 0; i < navigation.length; i++) {
        navigation[i].onclick = function () {
            document.getElementById('nav-check').checked = false;
        }
    }
}
