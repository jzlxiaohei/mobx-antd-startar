import React from 'react';
import { observer } from 'mobx-react';
import { Button, Modal } from 'antd'
import UserTable from './_Table';
import Form from './_Form';

@observer
class UserList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showNewUserModal: false
    }
  }

  handleShowNewUserModal = () => {
    this.setState({
      showNewUserModal: true
    });
  };

  hideNewUserModal = () => {
    this.setState({
      showNewUserModal: false
    });
  };

  handleUserCreated = ()=> {
    Modal.success({
      title: '创建成功',
      content: '正式环境中，你可以从新拉取list的数据..'
    });
    this.hideNewUserModal();
  };

  render() {
    return (
      <div className="user-page">
        <Button
          style={{margin:'20px'}}
          type="primary"
          onClick={this.handleShowNewUserModal}>New User</Button>
        {this.renderNewForm()}
        {this.renderTable()}
      </div>
    )
  }

  renderTable() {
    return <UserTable/>
  }

  renderNewForm() {
    if (!this.state.showNewUserModal) {
      return null;
    }
    return <Form onCancel={this.hideNewUserModal} onCreated={this.handleUserCreated}/>
  }
}

export default UserList