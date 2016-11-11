import ajax from 'js/utils/ajax';
import { action, observable } from 'mobx';
import { wrapModelWithAssignMethods } from 'js/infra/makeObservable';
import _ from 'lodash';

class BaseWithReq {
  @observable loading = false;
  @observable error = null;

  constructor() {
    wrapModelWithAssignMethods(this);
  }

  request(options, needAssignData = true) {
    this.$assign({
      loading: true
    });
    return ajax(options)
      .then((res)=> {
        this.reqSuccess(res.data, needAssignData);
        return res.data;
      }).catch((err)=> {
        this.reqError(err);
        throw err;
      });
  }

  @action reqSuccess(data, needAssignData) {
    this.$assign({ loading: false });
    if (needAssignData) {
      this.$assign(data);
    }
  }

  @action reqError(error) {
    this.$assign({
      loading: false,
      error
    });
  }

  getReqData() {
    const reqData = {};
    _.forOwn(_.omit(this, ['loading', 'error']), (value, key)=> {
      if (!_.isFunction(value)) {
        reqData[key] = value;
      }
    });
    return reqData;
  }

}

export default BaseWithReq;
