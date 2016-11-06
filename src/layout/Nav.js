import React, { PropTypes } from 'react';
import { Menu, Icon } from 'antd';
import { Link, browserHistory } from 'react-router';
import _ from 'lodash';
import NavConfig from './NavConfig';
import ruleUtils from 'js/utils/rule';

const LINK_NAV_KEY_MAP = {};

function buildLink(value) {
  const children = (
    <span>
    {value.icon ? <Icon type={value.icon}/> : null}
      <span className={value.className}>
        {value.title}
      </span>
    </span>
  );

  if (value.link) {
    if (value.external) {
      const extraProps = {};
      if (value.newTab) {
        extraProps['target'] = '_blank';
      }
      return (
        <a href={value.link}
           className="nav-link"
           {...extraProps}
        >
          {children}
        </a>
      )
    } else {
      return (
        <Link to={value.link} className="nav-link">
          {children}
        </Link>
      )
    }
  }
  return children;
}

function renderSingleMenu(value) {
  return (
    <Menu.Item key={value.key}>
      {buildLink(value)}
    </Menu.Item>
  )
}

function permissionCheck(value) {
  if (!value.rules) {
    return true;
  }

  if (!_.isArray(value.rules)) {
    throw new Error('nav rules should be array');
  }

  if (value.rules.length == 0) {
    console.warn('nav rules is [], means no one can see it');
  }

  return ruleUtils.havePermission(value.rules);
}

function buildNav(config) {
  const doms = [];
  for (let key in config) {
    const value = config[key];

    if (!permissionCheck(value)) {
      continue;
    }

    if (!value.title) {
      value.title = key;
    }
    if (!value.key) {
      value.key = key;
    }
    value.className = value.className || '';

    if (value.link && !value.external) {
      const link = value.link[0] == '/' ? value.link : '/' + value.link;
      // careful about this side effect. most case,it will be ok.
      LINK_NAV_KEY_MAP[link] = value.key;
    }

    if (!value.children || value.children.length == 0) {
      doms.push(renderSingleMenu(value));
    } else {
      doms.push(<Menu.SubMenu key={value.key}
                              title={buildLink(value)}>
        {value.children.map(c => buildNav(c))}
      </Menu.SubMenu>)
    }
  }
  return doms;
}

const Nav = buildNav(NavConfig);

function findOpenKeys(pathname) {
  const openKeys = [];
  for (let link in LINK_NAV_KEY_MAP) {
    if (_.startsWith(pathname, link)) {
      openKeys.push(LINK_NAV_KEY_MAP[link])
    }
  }
  return openKeys;
}

class LayoutNav extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    mode: PropTypes.string,
    location: PropTypes.object,
  };

  constructor(props) {
    super(props);
    const pathname = props.location.pathname;
    this.state = {
      currentNavKey: LINK_NAV_KEY_MAP[pathname] || '',
      defaultOpenKeys: findOpenKeys(pathname)
    };
  }

  componentDidMount() {
    this.unlistenHistory = browserHistory.listen(event=> {
      const pathname = event.pathname;
      this.setState({
        currentNavKey: LINK_NAV_KEY_MAP[pathname] || '',
        defaultOpenKeys: findOpenKeys(pathname)
      })
    })
  }

  componentWillUnmount() {
    if (this.unlistenHistory) {
      this.unlistenHistory();
    }
  }


  render() {
    return (
      <Menu className={this.props.className}
            defaultOpenKeys={this.state.defaultOpenKeys}
            selectedKeys={[this.state.currentNavKey]}
            mode={this.props.mode} theme="dark">
        <Menu.Item key='project-name' className="menu-project-name">
          LLS
        </Menu.Item>
        {Nav}
      </Menu>
    )
  }
}


export default LayoutNav;
