import is from 'is_js';

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
// 所有valid function 只接受单参数
const Validators = {
  required: function (value) {
    if (value === undefined || value === null || value === '') {
      return `value is required`
    }
  },
  isIntString: function (value) {
    if (!isNumeric(value) || is.not.integer(+value)) {
      return `need integer`
    }
  },
  isNumeric(n) {
    if (!isNumeric(n)) {
      return 'need number';
    }
  }
};

export default Validators;
