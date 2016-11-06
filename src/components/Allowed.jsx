import React, { PropTypes } from 'react';
import { SessionState } from 'js/models/globals'
import ruleUtils from 'js/utils/rule';


class Allowed extends React.Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
    rules: PropTypes.array.isRequired,
    placeholder: PropTypes.any,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const rules = this.props.rules;
    const placeholder = <span>{this.props.placeholder}</span> || null;
    return (
      ruleUtils.havePermission(rules) ? this.props.children : placeholder
    )
  }
}

export default Allowed;