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
        });
}

const about = function() {
    console.log("gsgs")
}

router
    .add(/about/, about)
    .add('', index) // this should always be last