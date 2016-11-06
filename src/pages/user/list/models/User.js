import BaseReq from 'js/models/BaseReq';
import { makeObs } from 'js/infra/makeObservable';

class User extends BaseReq {

  static fields = {
    name:'',
    avatar:'default avatar'
  };

  constructor() {
    super();
    makeObs(this, User.fields)

  }

  postUser() {
    return this.request({
      method: 'post',
      url: '/users',
      data: this.getReqData()
    })
  }
}

export default User;