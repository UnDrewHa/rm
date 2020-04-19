interface IEventsMap {
    [eventName: string]: Function[];
}

class EventEmitterClass {
    constructor() {
        this.events = {};
    }

    /**
     * Мапа с колбэками для соответствующих событий.
     */
    events: IEventsMap = null;

    /**
     * Подписать на событие.
     *
     * @param {string} eventName Название события.
     * @param {Function} fn Колбэк.
     */
    subscribe(eventName: string, fn: Function) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }

        this.events[eventName].push(fn);

        return () => {
            this.events[eventName].splice(
                this.events[eventName].indexOf(fn),
                1,
            );
        };
    }

    /**
     * Вызвать событие.
     *
     * @param {string} eventName Название события.
     * @param {Object} data Данные, передаваемые в колбэк.
     */
    emit(eventName, data: Object) {
        const event = this.events[eventName];
        if (!event) return;

        event.forEach((fn) => fn.call(null, data));
    }
}

/**
 * Синглтон EventEmitter.
 */
export const EventEmiter = new EventEmitterClass();
