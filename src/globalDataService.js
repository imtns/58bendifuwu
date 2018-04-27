import { globalData } from './app';

module.exports = {
    set(prop, value) {
        let obj = globalData;
        const keys = Array.isArray(prop) ? prop : prop.split('.');
        let index = 0;
        for (index = 0; index < keys.length - 1; index++) {
            const key = keys[index];
            if (!Object.prototype.hasOwnProperty.call(obj, key)) obj[key] = {};
            obj = obj[key];
        }
        obj[keys[index]] = value;
    },
};
