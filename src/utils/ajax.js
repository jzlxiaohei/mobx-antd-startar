import axios from 'axios';
import _ from 'lodash';
import config from 'js/config';
// import { UiState, SessionState } from '../models/globals'
import { UiState } from '../models/globals'

var axiosInstance = axios.create({
  baseURL: config.apiBase
});

let autoHeaders = {};
// if (SessionState.currentUser) {
//   autoHeaders = { 'Authorization': 'Bearer ' + SessionState.currentUser.token };
// }

const methods = [
  'get', 'post', 'put', 'delete'
];

const ajax = function (options) {
  const method = options.method.toLowerCase();
  return ajax[method](_.omit(options, [options.method]));
};


methods.forEach(method=> {
  ajax[method] = options=> {
    options.method = method;
    if (method == 'get') {
      options.params = options.data;
    }
    options.url = _.template(options.url)(options.pathParams || {});

    options.headers = _.assign({}, autoHeaders, options.headers);

    setTimeout(function () {
      UiState.showAjaxLoading();
    }, 0);
    return axiosInstance.request(options)
      .then(res=> {
        setTimeout(()=>{
          UiState.hideAjaxLoading();
        },10);
        return res;
      }).catch(err=> {
        setTimeout(()=>{
          UiState.hideAjaxLoading();
        },10);
        if (err.status == 401) {
          UiState.setErrMsg(`权限问题，如果你确认自己有权限,请刷新重试或重新登录`)
        } else if (err.statusText) {
          UiState.setErrMsg(err.statusText)
        } else {
          UiState.setErrMsg(`${options.method} ${options.path} : request error.`);
        }
        throw err;
      })

  }
});


export default ajax;
