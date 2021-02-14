import { fetchPage } from './Helper.js'

class About {
    static page() {
        fetchPage('./template/about.html', function (data) {
            document.getElementById('page').innerHTML = data;
        });
    };
}

export default About