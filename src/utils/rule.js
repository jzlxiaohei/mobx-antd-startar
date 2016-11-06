import _ from 'lodash';
import keymirror from 'keymirror';
import { SessionState } from 'js/models/globals'

const RuleTypes = {
  admin: null,
  user: null,
};


function havePermission(rules) {
  if (!SessionState.currentUser) {
    return false;
  }
  return _.intersection(SessionState.currentUser.rules, rules).length > 0
}

const ruleObj = {
  RuleTypes: keymirror(RuleTypes),
  havePermission
};

export default ruleObj

