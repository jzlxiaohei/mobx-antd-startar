import './scss/reset.css';
import './scss/common.scss';
import './scss/layout.scss';
import './scss/antd.scss';

import { Breadcrumb, Icon, message, Popover } from 'antd';
import classNames from 'classnames';
import React, { PropTypes } from 'react';
import LayoutNav from './Nav';
import { observer } from 'mobx-react';
import DevTool from 'mobx-react-devtools';
import { Link } from 'react-router';
import { SessionState, UiState } from '../models/globals'

function itemRender(route, params, routes, paths) {
  if (route.breadcrumbName) {
    if (route.noBreadcrumbLink) {
      return <span>{route.breadcrumbName}</span>
    }
    return ( <Link to={paths.join('/')}>{route.breadcrumbName}</Link> )
  } else {
    return null;
  }
}

@observer
class GlobalAjaxLoading extends React.Component {
  render() {
    const coverClass = classNames({
      'ajax-loading': true,
      hide: !UiState.isAjaxLoading
    });
    return (
      <div className={coverClass}>
        <Icon type="loading"/>
      </div>
    );
  }
}

@observer
class Layout extends React.Component {
  
  static propTypes = {
    location: PropTypes.object
  };
  
  renderLoading() {
    const coverClass = classNames({
      'loading-cover': true,
      hide: !UiState.isLockScreen
    });
    return (
      <div className={coverClass}>
        <div className="spinner">
          <div className="bounce1"></div>
          <div className="bounce2"></div>
          <div className="bounce3"></div>
        </div>
      </div>
    );
  }

  renderAjaxLoading = ()=> {
    return <GlobalAjaxLoading/>
  };

  handleFoldNav = ()=> {
    UiState.triggerNavFold();
  };

  renderGlobalErrMsg() {
    if (UiState.errMsg) {
      // render的时候,message 最好异步执行。不然报warning: render should be pure function...
      setTimeout(function () {
        message.error(UiState.errMsg, 10);
      }, 0)
    }
    return null
  }

  renderDevTool() {
    return process.env.NODE_ENV == 'production' ? null : <DevTool/>;
  }

  handleSignOut() {
    SessionState.signOut();
  }

  userPopupOver() {
    return (
      <div>
        <a onClick={this.handleSignOut}>sign-out</a>
      </div>
    )
  }

  renderContent() {
    const currentUser = SessionState.currentUser;
    return (
      <div className="layout-content">
        <div className="layout-header">
          <div className="layout-folder" onClick={this.handleFoldNav}>
            <Icon type="bars"/>
          </div>
          <div className="layout-user">
              <span className="avatar">
                <img src={currentUser.avatar}/>
              </span>
            <span className="nick">{currentUser.nick}</span>
            <Popover content={this.userPopupOver()} placement='bottom'>
              <Icon type="down"/>
            </Popover>
          </div>
          <div className="layout-breadcrumb">
            <Breadcrumb
              {...this.props}
              itemRender={itemRender}
            />
          </div>
        </div>
        <div className="pages">
          {this.props.children}
        </div>
      </div>
    )
  }

  renderLeftNav() {
    return <LayoutNav
      className="layout-nav"
      mode={UiState.navFolded ? 'vertical' : 'inline'}
      location={this.props.location}
    />
  }

  render() {
    const mainWrapperClass = classNames('main-wrapper', {
      folded: UiState.navFolded
    });
    return (
      <div className={mainWrapperClass}>
        {this.renderGlobalErrMsg()}
        {this.renderLoading()}
        {this.renderAjaxLoading()}
        {this.renderLeftNav()}
        {this.renderContent()}
        {UiState.showDevTools ? this.renderDevTool() : null}
      </div>
    );
  }
}

Layout.propTypes = {
  children: React.PropTypes.object
};

export default Layout;
