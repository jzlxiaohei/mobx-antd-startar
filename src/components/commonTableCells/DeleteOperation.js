import React, { PropTypes } from 'react';
import { Popconfirm } from 'antd';

class DeleteOperation extends React.Component {

  static propTypes = {
    onConfirm: PropTypes.func.isRequired
  };

  render() {
    return (
      <Popconfirm placement="top" title={'确认删除?'} onConfirm={this.props.onConfirm}>
        <a className="danger-link">删除</a>
      </Popconfirm>
    )
  }
}

export default DeleteOperation;