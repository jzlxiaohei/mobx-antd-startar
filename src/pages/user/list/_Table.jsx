import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';
import UserList from './models/UserList';
import { Table, message } from 'antd';
import DeleteOperation from 'js/components/commonTableCells/DeleteOperation';


@observer
class UserTable extends React.Component {

  static propTypes = {
    users: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.users = props.users || new UserList();
    this.initData();
  }

  initData() {
    this.users.request();
  }

  render() {
    return <Table
      dataSource={this.users.list.toJS()}
      loading={this.users.loading}
      columns={this.columns}
      pagination={this.users.antdPaginationConfig}
    />
  }

  handleDeleteUser(id) {
    this.users.deleteById(id).then(()=> {
      message.success('删除成功');
    });
  }

  columns = [
    {
      title: 'id',
      dataIndex: 'id'
    },
    {
      title: 'name',
      dataIndex: 'name'
    },
    {
      title: 'avatar',
      render(t, r) {
        return <img src={r.avatar}/>
      }
    },
    {
      title: 'operation',
      render: (t, r)=> {
        // method write like this, can use this
        return <DeleteOperation onConfirm={()=>this.handleDeleteUser(r.id)}/>
      }
    },
  ]
}

export default UserTable;