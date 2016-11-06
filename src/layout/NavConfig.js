/**
 * icon from http://ant.design/components/icon/
 *
 * each item should have unique key, default each item key
 *
 */

// import ruleUtils from 'js/utils/rule'
// const RuleTypes = ruleUtils.RuleTypes;

// 不支持link嵌套，所有的都要写全
// rules 为[]时，表示谁都不能看
const NavConfig = {
  '用户管理': {
    icon: 'home',
    className: 'hide-title-fold',
    children: [
      {
        '用户列表': { link: '/users',
          // rules: [
          //   RuleTypes.admin
          // ]
        },
      }
    ]
  },
};

export default NavConfig
