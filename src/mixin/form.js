import wepy from 'wepy';
import { get } from '../utils/http';

const { fuwu } = require('../utils/globalDataService');

export default class Form extends wepy.mixin {
    data = {};
    requestFormidCollect(formId) {
        if (formId) {
            get('https://yaofa.58.com/formidcollect/collect', {
                data: {
                    consumerId: fuwu.globalData.token || '', // 当前用户 ID
                    formId,
                },
            });
        }
    }
}
