import Pagination from 'js/models/Pagination';
import ajax from 'js/utils/ajax';
import { runInAction } from 'mobx';

class UserList extends Pagination{
  constructor(){
    super();
    this.path = '/users';
  }

  deleteById(id) {
    this.$assign({ loading: true });
    return ajax.delete({ url: `/users/${id}` })
      .then(()=> {
        runInAction('delete user by id', () => {
          this.loading = false;
          this.list = this.list.filter(user => user.id != id);
        });
      }).catch((err)=> {
        this.$assign({
          loading: false,
          error: err
        });
      })
  }
}

export default UserList;