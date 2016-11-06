import { Form, DatePicker, Input } from 'antd';
import _ from 'lodash';
import React, { PropTypes } from 'react';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
const FormItem = Form.Item;
import moment from 'moment';

function idFn(e) {
  return e;
}

function timestamp2moment(timestamp) {
  return moment(new Date(timestamp * 1000))
}

function moment2timestamp(momentObj) {
  return momentObj.unix();
}

@observer
class InputWithValidator extends React.Component {

  static propTypes = {
    model: PropTypes.object.isRequired,
    fieldName: PropTypes.string.isRequired,
    formItemProps: PropTypes.object,
    inputProps: PropTypes.object
  };

  render() {
    const props = this.props;
    const { model, fieldName, formItemProps = {}, inputProps = {} } = props;

    const valueModelToControl = props.valueModelToControl || idFn;
    const valueControlToModel = props.valueControlToModel || idFn;

    const validMsg = model.$validState[fieldName];

    return <FormItem
      validateStatus={_.isString(validMsg) ? 'error' : ''}
      help={ validMsg }
      { ...formItemProps }
    >
      <Input
        value={ valueModelToControl(model[fieldName]) }
        onChange={(e)=> {
          runInAction('validator input change', () => {
            model[fieldName] = valueControlToModel(e.target.value);
          })
        }}
        { ...inputProps }
      />
    </FormItem>
  }
}

@observer
class DateWithValidator extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    fieldName: PropTypes.string.isRequired,
    formItemProps: PropTypes.object,
    inputProps: PropTypes.object
  };

  render() {
    const props = this.props;
    const { model, fieldName, formItemProps = {}, inputProps = {} } = props;

    const valueModelToControl = props.valueModelToControl || timestamp2moment;
    const valueControlToModel = props.valueControlToModel || moment2timestamp;
    const validMsg = model.$validState[fieldName];


    return <FormItem
      validateStatus={_.isString(validMsg) ? 'error' : ''}
      help={ validMsg }
      { ...formItemProps }
    >
      <DatePicker
        value={valueModelToControl(model[fieldName])}
        onChange={(date)=> {
          runInAction('validator input change', () => {
            model[fieldName] = valueControlToModel(date);
          })
        }}
        { ...inputProps }
      />
    </FormItem>
  }
}

@observer
class CustomWithValidator extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    fieldName: PropTypes.string.isRequired,
    formItemProps: PropTypes.object,
  };

  render() {
    const props = this.props;
    const { model, fieldName, formItemProps = {} } = props;
    const validMsg = model.$validState[fieldName];
    return <FormItem
      validateStatus={_.isString(validMsg) ? 'error' : ''}
      help={ validMsg }
      { ...formItemProps }
    >
      {props.children}
    </FormItem>
  }
}


export {
  DateWithValidator,
  InputWithValidator,
  CustomWithValidator
};

