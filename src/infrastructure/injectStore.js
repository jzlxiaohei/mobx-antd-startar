/* eslint-disable  no-underscore-dangle */

// mainly for server render (WIP). be careful for usage

import React, { PropTypes } from 'react';
import hoistNonStatics from 'hoist-non-react-statics';
import { observer } from 'mobx-react';
import assign from 'lodash/assign';
import isFunction from 'lodash/isFunction';
import { extendObservable, observable, action } from 'mobx';
import isNode from './helper/isNode';

const isBrowser = !isNode;
if (isBrowser) {
  window.__mobxInjectedStore = window.__mobxInjectedStore || {};
}

function createStoreProps(storeMap, props) {
  const storeProps = {};
  for (const i in storeMap) {
    const Ctor = storeMap[i];
    if (isFunction(Ctor)) {
      storeProps[i] = new Ctor();
      if (props && props[i]) {
        assign(storeProps[i], props[i]);
      }
    } else {
      storeProps[i] = Ctor.useInstance;
    }
  }
  return storeProps;
}

function assignByPlainData(data) {
  const storeProps = {};
  extendObservable(storeProps, data);
  return storeProps;
}

function getInitStore(pageName, props, context) {
  if (isBrowser && window.__mobxInjectedStore[pageName]) {
    return window.__mobxInjectedStore[pageName];
  }

  // see Provider from 'mobx-react'
  if (context.mobxStores && context.mobxStores[pageName]) {
    return context.mobxStores[pageName];
  }

  if (props.storeProps) {
    return props.storeProps;
  }

  return null;
}


/**
 *
 * @param options
 *  fetchInitData:function.
 *    input: options.storeProps.
 *    output: a promise to
 *
 *  pageName:string. unique key to detect storeProps.
 *    duplicated pageName or lack of pageName will lead error.
 *
 *  storeMap:object. {key:Constructor} or {key:{useInstance: instance}}.
 *    your component can use this.props[key] to access the instance.
 *
 */


function injectStore(options) {
  const { storeMap, fetchInitData, pageName } = options;


  const loadingElement = options.loadingElement ? React.cloneElement(options.loadingElement) : null;

  if (process.env.NODE_ENV !== 'production') {
    if (!pageName) {
      throw new Error('you should provide pageName in injectStore');
    }
    if (isBrowser) {
      window.__storeNameMap = window.__storeNameMap || {};
      if (pageName in window.__storeNameMap) {
        throw new Error(`duplicated pageName:${pageName}.`);
      }
      window.__storeNameMap[pageName] = '';
    }
  }
  return (component) => {
    @observer
    class ComponentWithStoreInjector extends React.Component {

      // see Provider from 'mobx-react'
      static contextTypes = {
        mobxStores: PropTypes.object,
      };

      constructor(props, context) {
        super(props, context);
        this.initProps(props, context);
      }

      componentDidMount() {
        const props = this.props;
        if (!this.initDataWasFetched && fetchInitData) {
          const promiseObj = fetchInitData({
            stores: this.storeProps,
            params: props.params,
            location: props.location,
          });

          if (process.env.NODE_ENV !== 'production') {
            if (!promiseObj || !(typeof promiseObj.then === 'function')) {
              throw new Error('fetchInitData should return Promise');
            }
          }

          promiseObj.then(() => {
            this.wasFetched();
          });
        }
      }

      @action
      wasFetched = () => {
        this.initDataWasFetched = true;
      };

      initProps(props, context) {
        if (process.env.NODE_ENV !== 'production') {
          const AutoInjectFields = ['$mountStorePropsToWindow', '$unMountStorePropsToWindow'];
          AutoInjectFields.forEach((field) => {
            if (field in props) {
              throw new Error(`${field} is reserved fieldName of injectStore. you should change a name for the props`);
            }
          });
        }

        const initStore = getInitStore(pageName, props, context);
        if (initStore) {
          this.wasFetched();
          this.storeProps = assignByPlainData(initStore);
        } else {
          this.storeProps = createStoreProps(storeMap, props);
        }

        this.storeProps.$mountStorePropsToWindow = function $mountStorePropsToWindow(force) {
          if (!isBrowser) { return null; }
          if (force || !window.__mobxInjectedStore[pageName]) {
            window.__mobxInjectedStore[pageName] = this.storeProps;
          }
          return window.__mobxInjectedStore[pageName];
        };
        this.storeProps.$unMountStorePropsToWindow = function $unMountStorePropsToWindow() {
          if (!isBrowser) { return; }
          window.__mobxInjectedStore[pageName] = undefined;
        };
      }

      @observable initDataWasFetched = false;

      render() {
        if (process.env.NODE_ENV !== 'production') {
          for (const i in this.props) {
            if (i in this.storeProps) {
              throw new Error(`${i} from props, conflict with generated storeProps`);
            }
          }
        }
        return this.initDataWasFetched ?
          React.createElement(component, assign({}, this.storeProps, this.props)) :
          loadingElement;
      }
    }

    ComponentWithStoreInjector.wrappedComponent = component;
    ComponentWithStoreInjector.fetchInitData = fetchInitData;
    ComponentWithStoreInjector.storeMap = storeMap;
    ComponentWithStoreInjector.getInitStoreProps = () => createStoreProps(storeMap);
    ComponentWithStoreInjector.pageName = pageName;
    hoistNonStatics(ComponentWithStoreInjector, component);
    return ComponentWithStoreInjector;
  };
}

export default injectStore;