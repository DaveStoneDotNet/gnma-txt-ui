
class NotificationTimer {

    constructor(callback, delay) {

        this.timerId   = 0

        this.callback  = callback
        this.startTime = null
        this.delay     = delay
        this.remaining = delay

        this.start()
    }

    start = () => {
        this.startTime = new Date()
        clearTimeout(this.timerId)
        this.timerId = setTimeout(this.callback, this.remaining)
    }

    pause = () => {
        clearTimeout(this.timerId)
        this.remaining -= (new Date() - this.startTime)
    }

    resume = () => {
        this.startTime = new Date()
        clearTimeout(this.timerId)
        this.timerId = setTimeout(this.callback, this.remaining)
    }

    clear = () => {
        clearTimeout(this.timerId)
    }
}

export default NotificationTimer