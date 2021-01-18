let lazyLoadImages = () => {
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

let loadSprite = (imageObject) => {
    var sprite = new Image();
    sprite.onload = function () {
        imageObject.style.cssText = "background-image: url('" + imageObject.dataset.src + "');";
        imageObject.classList.remove('lazy');
    };
    sprite.src = imageObject.dataset.src;
}

let getWidth = () => {
    return parseFloat(getComputedStyle(document.body, null).width.replace('px', '')); // for accurate width
}

let slider = (id) => {
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

let addHide = (slides, current, count) => {
    for (let i = 0; i < slides.length; i++) {
        if (i < current || i >= current + count) {
            slides[i].classList.add('hide');
        } else {
            slides[i].classList.remove('hide');
        }
    }
}

let fetchPage = (path, callback) => {
    fetch(path)
        .then((response) => {
            return response.text();
        })
        .then((data) => {
            callback(data);
        });
}

let getData = (path, callback) => {
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

let shuffleArray = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

let sortByName = (a, b) => {
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

let sortByYear = (a, b) => {
    return b.year - a.year;
}

export {lazyLoadImages, slider, fetchPage, getData, shuffleArray, sortByName, sortByYear}