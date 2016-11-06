import { observable, action } from 'mobx';
import preference, { PreferenceKeys } from '../../utils/preference'

const UiState = {
  @observable isLockScreen: false, // 全屏loading
  @observable isAjaxLoading: false, //头部右上角的loading
  @observable navFolded: preference.get(PreferenceKeys.navFolded) == '1', // 侧边栏loading
  @observable errMsg: '',
  @observable showDevTools: false,

  @action setErrMsg(msg, time){
    this.errMsg = msg;
    setTimeout(this.clearErrMsg, time || 10 * 1000)
  },

  @action clearErrMsg(){
    UiState.errMsg = '';
  },

  @action
  lockScreen(){
    this.isLockScreen = true;
  },

  @action
  unLockScreen(){
    this.isLockScreen = false;
  },

  @action
  showAjaxLoading(){
    this.isAjaxLoading = true;
  },

  @action
  hideAjaxLoading(){
    this.isAjaxLoading = false;
  },

  @action
  triggerNavFold(){
    this.navFolded = !this.navFolded;
    preference.set(PreferenceKeys.navFolded, this.navFolded ? '1' : '0');
  },

  @action triggerDevTools(){
    this.showDevTools = !this.showDevTools
  }

};

export default UiState;
