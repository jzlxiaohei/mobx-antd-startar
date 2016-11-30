import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import { extendObservable, action } from 'mobx';
import forOwn from 'lodash/forOwn';
// import { Validators } from './validatorRules'

/**
 *
 * @param model
 * @param rules: { filedName(string): fn(function) }
 * @param lazy: boolean. if lazy true, there is no @computed function
 * @returns {*}
 */

/**
 *
 * @param checkFn : function or array of function.
 *      whne array: if last item of array is string, the string will be return if any check failed
 * @param modelValue
 * @returns {*}
 */
function checkInternal(checkFn, modelValue, model) {
  if (isArray(checkFn)) {
    let fnLength = checkFn.length;
    let resultString = '';
    const lastItem = checkFn[fnLength - 1];
    if (isString(lastItem)) {
      fnLength -= 1;
      resultString = lastItem;
    }

    for (let i = 0; i < fnLength; i++) {
      const fn = checkFn[i];
      const tempResult = fn(modelValue, model);
      if (isString(tempResult)) {
        return (resultString || tempResult);
      }
    }
    return true;
  } else {
    return checkFn(modelValue, model);
  }
}

function addValidators(model, rules, lazy = false) {

  if (process.env.NODE_ENV !== 'production') {
    const reservedFields = [
      '$validState',
      '$needTrackValidState'
    ];
    reservedFields.forEach(field => {
      if (field in model) {
        throw new Error(`${field} already in model. you might have added rules for this model or others use the same field.`);
      }
    });
    forOwn(rules, (value, key) => {
      if (!(key in model)) {
        console.warn(`${key} in rules but not in model`)
      }
    });
  }


  model.$validState = model.$validState || {};

  extendObservable(model, {
    $validState: {},
    $needTrackValidState: false,
  });

  model.$trackValidState = action('change trackValidState', (state = true) => {
    if (model.$needTrackValidState !== state) {
      model.$needTrackValidState = state;
    }
  });

  model.$validCheck = () => {
    let isStateValid = true;
    const info = {};
    forOwn(rules, (value, key) => {
      const modelValue = model[key];
      const checkFn = rules[key];

      const checkResult = checkInternal(checkFn, modelValue, model);
      if (isString(checkResult)) {
        isStateValid = false;
        info[key] = checkResult;
      }
    });
    return {
      isStateValid,
      info
    };
  };

  model.$isValid = () => {
    for (const key in rules) {
      const modelValue = model[key];
      const checkFn = rules[key];
      const checkResult = checkInternal(checkFn, modelValue, model);
      if (isString(checkResult)) {
        return false;
      }
    }
    return true;
  };

  if (!lazy) {
    const computedFns = {};

    // if mobx(3.0) report error(waring), see https://github.com/mobxjs/mobx/issues/532
    forOwn(rules, (value, key) => {
      computedFns[key] = () => {
        const modelValue = model[key];
        const checkFn = rules[key];
        return model.$needTrackValidState && checkInternal(checkFn, modelValue, model);
      };
    });

    extendObservable(model.$validState, computedFns);
  }

  return model;
}

export default addValidators;