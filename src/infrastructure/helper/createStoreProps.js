import isFunction from 'lodash/isFunction';
import assign from 'lodash/assign';

function createStoreProps(storeMap, props) {
  const storeProps = {};
  for (let i in storeMap) {
    const Ctor = storeMap[i];
    if (isFunction(Ctor)) {
      storeProps[i] = new Ctor();
      if (props && props[i]) {
        assign(storeProps[i], props[i])
      }
    } else {
      storeProps[i] = Ctor.useInstance;
    }
  }
  return storeProps;
}

export default createStoreProps