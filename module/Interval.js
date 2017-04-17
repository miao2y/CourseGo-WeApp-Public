/**
 * Created by ares5 on 2017-01-21.
 */
const Promise = require('../libs/promise.js').Promise;
class Interval {
    constructor(time,interval) {
        this.time = time;
        this.interval = interval;
        this.count = 0;
    };
    get getCount() {
        return this.count;
    };
    get timeLeft() {
        return this.time - this.count * this.interval;
    };


    destroy () {
        clearInterval(this.intervalor);
        return new Promise(function (resolve,reject) {
            resolve();
        })
    };
    start (method,end) {
        this.intervalor = setInterval( () => {
            this.count++;
            method();
            if(this.timeLeft <= 0){
                this.destroy().then(function () {
                    end();
                });
            }
        },this.interval)
    }
}
module.exports = Interval;