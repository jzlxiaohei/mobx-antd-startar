import { makeObs, wrapModelWithAssignMethods } from '../infrastructure/makeObservable';
import ajax from '../utils/ajax';
import _ from 'lodash';
import { action, computed } from 'mobx';
import Preference, { PreferenceKeys } from 'js/utils/preference';


/**
 * Process Data by default data structure as below. If server response data don't fit it, pk backend...
 *
 * {
   *    `ListFieldName`:[],
   *    total: 999,
   *    currentPage //optional
   * }
 *
 *
 * can be override in subClass
 *
 * set total ; set list ; set curPage
 *
 */

//TODO test

const fields = {
  list: [],
  total: 0,
  pageSize: 20,
  page: 1,
  loading: false,
  error: ''
};

class Pagination {
  payload = {};
  path: '';
  noPagination: false;

  constructor() {
    wrapModelWithAssignMethods(this);
    makeObs(this, fields);
  }

  assignPayload(payload) {
    const nPayload = _.assign({}, this.payload, payload);
    this.$assign({
      payload: nPayload
    });
  }

  processPageData(pageObj) {
    this.total = pageObj.total;
    this.page = parseInt(pageObj.currentPage) || this.page;
    for (var i in pageObj) {
      if (i !== 'total' && i !== 'currentPage') {
        this.$assign({ list: pageObj[i] });
        break;
      }
    }
  }

  @action reqSuccess(pageObj) {
    this.$assign({ loading: false });
    this.processPageData(pageObj)
  }

  @action reqError(error) {
    this.$assign({
      loading: false,
      error
    });

  }

  request(path) {
    path = path || this.path;
    this.$assign({
      loading: true,
      page: this.payload.page || this.page,
      pageSize: this.payload.pageSize || this.pageSize
    });
    return ajax.get({
      url: path,
      data: _.assign({
        page: this.page,
        pageSize: this.pageSize
      }, this.payload)
    }).then((res)=> {
      this.reqSuccess(res.data);
      return res.data;
    }).catch((err)=> {
      this.reqError(err);
      throw err;
    })
  }


  // default : request firse page; you can overwrite it.
  onPageSizeChange(page, pageSize) {
    Preference.set(PreferenceKeys.pageSize, pageSize)
    this.$assign({
      page: 1,
      pageSize
    });
    this.request();
  }

  @computed get itemInfo() {
    return {
      total: this.total,
      begin: (this.page - 1) * this.pageSize + 1,
      end: this.page * this.pageSize
    }
  }

  @computed get antdPaginationConfig() {
    if (this.noPagination) {
      return false;
    }
    return {
      current: this.page,
      pageSize: this.pageSize,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: this.pageSizeOptions || [
        '10',
        '20',
        '50',
        '100',
        '200'
      ],
      total: this.total,
      onChange: (page)=> {
        this.$assign({ page });
        this.request();
      },
      onShowSizeChange: (currentPage, pageSize)=> {
        this.onPageSizeChange(currentPage, pageSize);
      },
      showTotal: (total) => {
        return `共 ${total} 条`;
      }
    }
  }

}

export default Pagination
