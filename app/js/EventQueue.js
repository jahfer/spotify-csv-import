import Q from 'q';

export default class EventQueue {
  constructor(task, delay = 100) {
    this.queue = [];
    this.task = task;
    this.worker = null;
    this.delay = delay
  }

  process() {
    if (this.queue.length > 0) {
      let data = this.queue.splice(0,1)[0];
      console.log("Working off item", data.item);
      this.task(data.item).then(data.callback);
    } else {
      clearInterval(this.worker);
    }
  }

  append(item) {
    let deferred = Q.defer();
    this.queue.push({item, callback: deferred.resolve});
    return deferred.promise;
  }

  begin() {
    this.worker = setInterval(this.process.bind(this), this.delay);
  }
}
