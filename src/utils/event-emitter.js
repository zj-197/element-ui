import { isPromise } from 'wp-element-ui/src/utils/types';
function toArray(list, start) {
  start = start || 0;
  let i = list.length - start;
  const ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret;
}
function invokeWithErrorHandling(handler, context, args, info) {
  let res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && isPromise(res) && !res._handled) {
      res.catch(e => {
        console.error(info + ' (Promise/async)');
        console.error(e);
      });
      res._handled = true;
    }
  } catch (e) {
    console.error(info);
    console.error(e);
  }
  return res;
}

export default class EventEmitter {
  constructor() {
    this._events = Object.create(null);
  }

  $on(event, fn) {
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        this.$on(event[i], fn);
      }
    } else {
      (this._events[event] || (this._events[event] = [])).push(fn);
    }
  }

  $once(event, fn) {
    const instance = this;

    function on() {
      instance.$off(event, on);
      fn.apply(instance, arguments);
    }
    on.fn = fn;
    this.$on(event, on);
  }
  $off(event, fn) {
    const instance = this;
    // 不传任何清除所有监听事件
    if (!arguments.length) {
      instance._events = Object.create(null);
      return;
    }
    // array of events
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        instance.$off(event[i], fn);
      }
      return;
    }
    // specific event
    const cbs = instance._events[event];
    if (!cbs) {
      return;
    }
    if (!fn) {
      instance._events[event] = null;
      return;
    }
    // specific handler
    let cb;
    let i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break;
      }
    }
  }
  $emit(event) {
    const instance = this;
    if (process.env.NODE_ENV !== 'production') {
      const lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && instance._events[lowerCaseEvent]) {
        console.error(`${event} has been emitted`);
      }
    }
    let cbs = instance._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      const args = toArray(arguments, 1);
      const info = `event handler for "${event}"`;
      for (let i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], instance, args, info);
      }
    }
  }
}
