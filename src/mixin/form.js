import wepy from 'wepy';
import { get } from '../utils/http';

const { fuwu } = require('../utils/globalDataService');

export default class Form extends wepy.mixin {
    data = {};
    requestFormidCollect(formId) {
        if (formId) {
            get('http://bossapi.58.com/smallapp/formid/set', {
                data: {
                    code: fuwu.globalData.token || 'cde2a69612ab49101d7009815566f1e5', // 当前用户 ID
                    formid: formId,
                },
            });
        }
    }
}
