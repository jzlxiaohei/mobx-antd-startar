/**
 * icon from http://ant.design/components/icon/
 *
 * each item should have unique key, default each item key
 *
 */
import ruleUtils from 'js/utils/rule'
const RuleTypes = ruleUtils.RuleTypes;

// link 必须写全路径
// rules 为[]时，表示谁都不能看
const NavConfig = {
  'Home': {
    icon: 'home',
    className: 'hide-title-fold',
    children: [
      { 'xx管理': { link: 'users' } },
      {
        'yy管理': { link: 'self_service_group',
          rules: [
            RuleTypes.super_admin, RuleTypes.sa_trainer,
            RuleTypes.sa
          ]
        },
      }
    ]
  },
};

export default NavConfig
