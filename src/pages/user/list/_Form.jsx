import React, { PropTypes } from 'react';
import _ from 'lodash';
import { observer } from 'mobx-react';
import { Modal, Button } from 'antd';
import addValidators from 'js/infra/validator/addValidators';
import defaultValidator from 'js/infra/validator/defaultValidator';
import User from './models/User';
import { InputWithValidator } from 'js/components/ValidatorItems'

@observer
class UserFrom extends React.Component {

  static propTypes = {
    user: PropTypes.object,
    onCancel: PropTypes.func,
    onCreated: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.user = props.user || new User();
    this.addValidatorToUser();
  }

  addValidatorToUser() {
    addValidators(this.user, {
      name: defaultValidator.required,
      avatar: [
        defaultValidator.required,
        function isUrl(value){
          if (!_.startsWith(value, 'http://') && !_.startsWith(value, 'https://')) {
            return ''
          }
        },
        '用户图片是url (一般这里你需要一个七牛组件~)'
      ]
    })
  }

  handleCreate = () => {
    if (!this.user.$isValid()) {
      return this.user.$trackValidState();
    }
    this.user.postUser().then(() => {
      if (this.props.onCreated) {
        this.props.onCreated();
      }
    });
  };

  render() {
    const defaultFormItemProps = {
      labelCol: { span: 5 },
      wrapperCol: { span: 12 },
    };
    return (
      <Modal
        title="Create Group" visible={true}
        onCancel={this.props.onCancel}
        footer={[
          <Button key="back" size="large" onClick={this.props.onCancel}>Cancel</Button>,
          <Button
            key="submit" type="primary"
            loading={this.user.loading}
            onClick={this.handleCreate}>
            Submit
          </Button>,
        ]}>

        <InputWithValidator
          model={this.user} fieldName='name'
          formItemProps={_.assign({ label: 'name' }, defaultFormItemProps)}
        />
        <InputWithValidator
          model={this.user} fieldName='avatar'
          formItemProps={_.assign({ label: 'avatar' }, defaultFormItemProps)}
        />
      </Modal>
    )
  }
}

export default UserFrom;