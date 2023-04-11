/**
 * @Author: 左建
 * @Date: 2022/11/25 12:46
 * @LastEditTime: 2022/11/25 12:46
 * @Description: form-item 相关静态配置
*/
function code(len = 6) {
  return new RegExp(`^(\\d{${len}})?$`);
}
/**
 * 是否为正则对象
 * @return {Boolean}
 * @param o
 */
export function regExp(o) {
  return o && Object.prototype.toString.call(o) === '[object RegExp]';
}
export const PATTERN = Object.freeze({
  number: {
    pattern: /^(\d+)?$/,
    message: '请输入数字'
  }, /* 可以为空， 但是只能输入数字 */
  mobile: {
    pattern: /^((?:(?:\+|00)86)?1[3-9]\d{9})?$/,
    message: '请输入正确的手机号'
  }, /* 可以为空单只能输入正确的手机号 */
  email: {
    pattern: /^(\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+)?$/,
    message: '请输入正确的邮箱'
  },
  // 密码强度校验，长度6-12位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
  strongPasswd: {
    pattern: /^(\S*(?=\S{6,12})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*)?$/,
    message: '长度6-12位，同时包含大小写字母，数字和特殊字符'
  },
  // 密码强度校验，长度6-12位，同时包含大小写字母及数字
  middlePasswd: {
    pattern: /^(\S*(?=\S{6,12})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])\S*)?$/,
    message: '长度6-12位，同时包含大小写字母及数字'
  },
  // 密码长度要6-12位，由数字或字母组成 可以为空
  weakPasswd: {
    pattern: /^((?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12})?$/,
    message: '长度6-12位，包含数字或字母'
  },
  // 验证十进制数字, 可以为空
  number10: {
    pattern: /^((?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?)?$/,
    message: '请输入整数或者小数'
  },
  // 固定电话
  landline: {
    pattern: /^(\d{3,4}-\d{7,8}(-\d{3,4})?)?$/,
    message: '请输入正确的固定电话'
  },
  // 6位验证码
  code: {
    pattern: code(6),
    message: '请输入正确的验证码'
  },
  // 4位验证码
  code4: {
    pattern: code(4),
    message: '请输入正确的验证码'
  },
  // 中文
  chinese: {
    pattern: /^([\u4e00-\u9fa5]+)?$/gi,
    message: '请输入中文'
  },
  // 字母
  letter: {
    pattern: /^([a-zA-Z]*)?$/,
    message: '请输入英文字母'
  },
  // 金钱
  money: {
    pattern: /^([1-9]\d*(,\d{3})*(\.\d{1,2})?$|^0\.\d{1,2})?$/,
    message: '请输入正确的金额'
  },
  // 身份证
  card: {
    pattern: /^([1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X))?$/,
    message: '请输入正确的身份证'
  },
  // 只能是字母或者数字
  enOrNum: {
    pattern: /^([0-9a-zA-Z]*)?$/g,
    message: '请输入字母或者数字'
  }
});
