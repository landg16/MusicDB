class Router {
    routeHistory = []
    root = '/'

    constructor(settings) {
        if (settings.root) this.root = settings.root
        this.listener();
    }

    add = (path, cb) => {
        this.routeHistory.push({path, cb})
        return this
    }

    remove = (path) => {
        for(var i = 0; i < this.routeHistory.length; i++) {
            if(this.routeHistory[i].path == path) {
                this.routeHistory.slice(i, 1)
                return this
            }
        }
        return this
    }

    reset = () => {
        this.routeHistory = []
        return this
    }

    removeSlashes = (path) => {
        return path.toString().replace(/\/$/, '').replace(/^\//, '')
    }

    getView = () => {
        var view = ''
        const match = window.location.href.match(/#(.*)$/)
        view = match ? match[1] : ''

        return this.removeSlashes(view)
    }

    navigate = () => {
        window.location.href = `${window.location.href.replace(/#(.*)$/, '')}`
        return this
    }

    listener = () => {
        clearInterval(this.interval)
        this.interval = setInterval(this.interval, 50)
    }

    interval = () => {
        if (this.current == this.getView()) return
        this.current = this.getView()
        
        this.routeHistory.some(route => {
            const match = this.current.match(route.path)

            if (match) {
                match.shift()
                route.cb.apply({}, match)
                return match
            }

            return false
        })
    }
}

export default Router