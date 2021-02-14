const mix = require('laravel-mix');

mix.styles([
    'css/style.css'
], 'css/style.min.css');

mix.scripts([
    'js/modules/About.js',
    'js/modules/Albums.js',
    'js/modules/Artists.js',
    'js/modules/Helper.js',
    'js/modules/Index.js',
    'js/modules/Router.js',
    'js/modules/Tracks.js',
    'js/main.js',
], 'js/main.min.js');