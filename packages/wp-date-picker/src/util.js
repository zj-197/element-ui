/**
 * @Author: 左建
 * @Date: 2022/8/1 20:42
 * @LastEditTime: 2022/8/1 20:42
 * @Description: datePicker的一些配置项
*/
import { clearTime, formatDate, parseDate, toDate, nextMonth, prevMonth, getWeekNumber } from 'element-ui/src/utils/date-util';
import { t } from 'element-ui/src/locale';
// 默认一周的第一天1到7
export const DEFAULT_FIRST_WEEK_DAY = 1;

function fillEndDayTime(date) {
  if (date instanceof Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
  }
}
export const DATE_FORMAT_BY_TYPE = Object.freeze({
  year: 'yyyy',
  years: 'yyyy',
  month: 'yyyy-MM',
  months: 'yyyy-MM',
  date: 'yyyy-MM-dd',
  dates: 'yyyy-MM-dd',
  week: 'yyyy 第 WW 周',
  weeks: 'yyyy 第 WW 周',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  datetimes: 'yyyy-MM-dd HH:mm:ss',
  datetimerange: 'yyyy-MM-dd HH:mm:ss',
  daterange: 'yyyy-MM-dd',
  monthrange: 'yyyy-MM'
});

export const DATE_PLACEHOLDER_BY_TYPE = Object.freeze({
  datetimerange: [t('el.datepicker.startTime'), t('el.datepicker.endTime')],
  daterange: [t('el.datepicker.startDate'), t('el.datepicker.endDate')],
  monthrange: ['开始年月', '结束年月']
});

function getRangePickerOptions(picker, day, type = 'before', isRange, currentDateAddMinutes) {
  const ms = currentDateAddMinutes * 60 * 1000;
  const currentTime = new Date().getTime();
  const calcTime = type === 'after' ? toDate(currentTime - ms) : toDate(currentTime + ms);
  const currentDate = type === 'after' ? toDate(currentTime - ms) : toDate(currentTime + ms);
  // 计算时间
  if (type === 'after') {
    calcTime.setTime((isRange ? calcTime.getTime() : currentTime) - 3600 * 1000 * 24 * day);
    picker.$emit('pick', isRange ? [calcTime, currentDate] : calcTime);
  } else {
    calcTime.setTime((isRange ? calcTime.getTime() : currentTime) + 3600 * 1000 * 24 * day);
    picker.$emit('pick', isRange ? [currentDate, calcTime] : calcTime);
  }
}
/**
 * @description - 获取日期或者日期时间的pickerOptions
 * @param {Boolean} isRange - 请求的地址
 * @param {String} disabled - 禁用之前(before)or之后(after)的时间
 * @return {Object}
 */
export function getDateOrTimePickerOptions(isRange, disabled) {
  const vm = this;
  const textMap = {
    before: isRange ? '往后' : '后',
    after: isRange ? '最近' : '前'
  };
  const getText = (text) => isRange ? textMap[disabled] + text : text + textMap[disabled];
  const shortCuts = [
    {
      text: '今天',
      onClick(picker) {
        const ms = vm.currentDateAddMinutes * 60 * 1000;
        const currentDate = new Date();
        const afterDate = toDate(currentDate.getTime() - ms);
        const beforeDate = toDate(currentDate.getTime() + ms);
        if (isRange) {
          if (disabled === 'after') {
            picker.$emit('pick', [clearTime(currentDate), afterDate]);
          } else if (disabled === 'before') {
            picker.$emit('pick', [beforeDate, fillEndDayTime(currentDate)]);
          }
        } else {
          if (disabled === 'after') {
            picker.$emit('pick', afterDate);
          } else if (disabled === 'before') {
            picker.$emit('pick', beforeDate);
          }
        }
      }
    },
    {
      text: isRange ? textMap[disabled] + '一天' : disabled === 'before' ? '明天' : '昨天',
      onClick(picker) {
        getRangePickerOptions(picker, 1, disabled, isRange, vm.currentDateAddMinutes);
      }
    },
    {
      text: isRange ? textMap[disabled] + '两天' : disabled === 'before' ? '后天' : '前天',
      onClick(picker) {
        getRangePickerOptions(picker, 2, disabled, isRange, vm.currentDateAddMinutes);
      }
    },
    {
      text: getText('三天'),
      onClick(picker) {
        getRangePickerOptions(picker, 3, disabled, isRange, vm.currentDateAddMinutes);
      }
    },
    {
      text: getText('一周'),
      onClick(picker) {
        getRangePickerOptions(picker, 7, disabled, isRange, vm.currentDateAddMinutes);
      }
    },
    {
      text: getText('一个月'),
      onClick(picker) {
        getRangePickerOptions(picker, 30, disabled, isRange, vm.currentDateAddMinutes);
      }
    },
    {
      text: getText('两个月'),
      onClick(picker) {
        getRangePickerOptions(picker, 60, disabled, isRange, vm.currentDateAddMinutes);
      }
    },
    {
      text: getText('三个月'),
      onClick(picker) {
        getRangePickerOptions(picker, 90, disabled, isRange, vm.currentDateAddMinutes);
      }
    },
    {
      text: getText('半年'),
      onClick(picker) {
        getRangePickerOptions(picker, 180, disabled, isRange, vm.currentDateAddMinutes);
      }
    },
    {
      text: getText('一年'),
      onClick(picker) {
        getRangePickerOptions(picker, 365, disabled, isRange, vm.currentDateAddMinutes);
      }
    }
  ];
  return {
    shortcuts: shortCuts,
    disabledDate(t) {
      return disabledDateByCurrentDate(t, disabled);
    },
    onPick({ maxDate, minDate }) {
      if (/timerange/.test(vm.type) && ['before', 'after'].indexOf(disabled) > -1) {
        if (disabled === 'after') {
          setTimeout(() => {
            const currentDate = new Date();
            if (maxDate && formatDate(currentDate) === formatDate(maxDate)) {
              if (vm.currentDateAddMinutes) {
                const ms = vm.currentDateAddMinutes * 60 * 1000;
                if (minDate) {
                  const minDateTime = clearTime(this.minDate);
                  const flag = Math.abs(currentDate.getTime() - minDateTime.getTime()) - ms < 0;
                  if (flag) {
                    this.minDate = toDate(minDateTime.getTime() - ms);
                  } else {
                    if (formatDate(currentDate) === formatDate(minDate)) {
                      if (Array.isArray(vm.defaultTime) && vm.defaultTime[0] !== '00:00:00') {
                        this.minDate = minDateTime;
                      }
                    }
                  }
                }
                this.maxDate = toDate(currentDate.getTime() - ms);
              } else {
                if (maxDate) {
                  this.maxDate = currentDate;
                }
              }
            }
          }, 50);
        } else {
          setTimeout(() => {
            const currentDate = new Date();
            if (minDate && formatDate(currentDate) === formatDate(minDate)) {
              if (vm.currentDateAddMinutes) {
                const ms = vm.currentDateAddMinutes * 60 * 1000;
                if (maxDate) {
                  const maxDateTime = fillEndDayTime(this.maxDate);
                  const flag = Math.abs(currentDate.getTime() - maxDateTime.getTime()) - ms < 0;
                  if (flag) {
                    this.maxDate = toDate(maxDateTime.getTime() + ms);
                  } else {
                    if (formatDate(currentDate) === formatDate(maxDate)) {
                      if (Array.isArray(vm.defaultTime) && vm.defaultTime[1] !== '23:59:59') {
                        this.maxDate = fillEndDayTime(currentDate);
                      }
                    }
                  }
                }
                this.minDate = toDate(currentDate.getTime() + ms);
              } else {
                if (minDate) {
                  this.minDate = currentDate;
                }
                if (maxDate && formatDate(currentDate) === formatDate(maxDate)) {
                  if (Array.isArray(vm.defaultTime) && vm.defaultTime[1] !== '23:59:59') {
                    this.maxDate = fillEndDayTime(currentDate);
                  }
                }
              }
            }
          }, 50);
        }
      }
    }
  };
}

// 获取禁用的时间段
export function getDisabledTime(disabled, data) {
  const fillZero = (val) => String(val).padStart(2, '0');
  const format = 'HH:mm:ss';
  const str = `${fillZero(data.getHours())}:${fillZero(data.getMinutes())}:${fillZero(data.getSeconds())}`;
  if (disabled === 'after') {
    return [[parseDate('00:00:00', format), parseDate(str, format)]];
  } else {
    return [[parseDate(str, format), parseDate('23:59:59', format)]];
  }
}

export function setDisabledTimeSelect(currentDate, disabled) {
  const picker = this;
  const format = 'HH:mm:ss';
  if (disabled === 'after') {
    picker.$refs.maxTimePicker.selectableRange = [
      [
        parseDate('00:00:00', format),
        parseDate(formatDate(currentDate, format), format)
      ]
    ];
    picker.$refs.minTimePicker.selectableRange = [
      [
        parseDate('00:00:00', format),
        parseDate(formatDate(currentDate, format), format)
      ]
    ];
  } else if (disabled === 'before') {
    picker.$refs.minTimePicker.selectableRange = [
      [
        parseDate(formatDate(currentDate, format), format),
        parseDate('23:59:59', format)
      ]
    ];
    picker.$refs.maxTimePicker.selectableRange = [
      [
        parseDate(formatDate(currentDate, format), format),
        parseDate('23:59:59', format)
      ]
    ];
  }
}

/**
 * @description - 禁用当前时间之前或者之后的时间
 * @param {Date} t - 请求的地址
 * @param {String} disabled - before or after 之前或者之后
 * @return {Boolean}
 */
export function disabledDateByCurrentDate(t, disabled) {
  if (disabled === 'after') return t.getTime() > new Date().getTime();
  return t.getTime() < new Date().getTime() - 3600 * 24 * 1000;
}

/**
 * @description - 获取选择月的pickerOptions
 * @param {String} disabled - 禁用之前还是之后的
 * @param {Boolean} isRange - 是否是范围选择
 * @return {Object}
 */
export function getMonthPickerOptions(disabled, isRange) {
  const textMap = {
    before: isRange ? '往后' : '后',
    after: isRange ? '最近' : '前'
  };
  const getText = (text) => isRange ? textMap[disabled] + text : text + textMap[disabled];
  const pickerClick = (picker, monthNum) => {
    const currentDate = new Date();
    const realMonth = Array.from({ length: monthNum }, (_, index) => index + 1).reduce((preVal, curVal) => {
      preVal = disabled === 'before' ? nextMonth(preVal) : prevMonth(preVal);
      return preVal;
    }, currentDate);
    picker.$emit('pick', isRange ? (disabled === 'before' ? [currentDate, realMonth] : [realMonth, currentDate]) : realMonth);
  };
  return {
    disabledDate(t) {
      return disabledDateByCurrentDate(t, disabled);
    },
    shortcuts: [
      {
        text: '当前月',
        onClick(picker) {
          picker.$emit('pick', isRange ? [new Date(), new Date()] : new Date());
        }
      },
      {
        text: getText('一个月'),
        onClick(picker) {
          pickerClick(picker, 1);
        }
      },
      {
        text: getText('两个月'),
        onClick(picker) {
          pickerClick(picker, 2);
        }
      },
      {
        text: getText('三个月'),
        onClick(picker) {
          pickerClick(picker, 3);
        }
      },
      {
        text: getText('半年'),
        onClick(picker) {
          pickerClick(picker, 6);
        }
      },
      {
        text: getText('一年'),
        onClick(picker) {
          pickerClick(picker, 12);
        }
      }
    ]
  };
}

/**
 * @description - 获取一周的第一天
 * @param {Date} [date] - date日期对象
 * @return {Date}
 */
export function getWeekFirstDay(date = new Date()) {
  return toDate(date.getTime() - (((date.getDay() || 7) - 1) * 86400000));
}
/**
 * @description - 获取选择周的pickerOptions
 * @param {String} disabled - 禁用之前还是之后的
 * @param {Number} offsetDay - 天数偏移量
 * @return {Object}
 */
export function getWeekPickerOptions(disabled, offsetDay) {
  const textMap = {
    before: '后',
    after: '前'
  };
  const getText = (text) => text + textMap[disabled];
  const currentDate = new Date();
  const firstDateOfWeek = toDate((getWeekFirstDay(currentDate).getTime()) + (86400000 * offsetDay));
  const pickerHandler = (picker, count) => {
    const dayNumMs = 7 * 86400000 * count;
    const day = disabled === 'after' ? toDate(firstDateOfWeek.getTime() - dayNumMs) : toDate(firstDateOfWeek.getTime() + dayNumMs);
    picker.$emit('pick', day);
  };
  return {
    disabledDate(t) {
      const currentDate = new Date();
      const isSameWeek = t.getFullYear() === currentDate.getFullYear() && getWeekNumber(currentDate) === getWeekNumber(t);
      if (disabled === 'after') return (t.getTime() > currentDate.getTime()) || isSameWeek;
      return (t.getTime() < currentDate.getTime() - 3600 * 24 * 1000) || isSameWeek;
    },
    firstDayOfWeek: DEFAULT_FIRST_WEEK_DAY,
    shortcuts: [
      {
        text: '当前周',
        onClick(picker) {
          picker.$emit('pick', firstDateOfWeek);
        }
      },
      {
        text: getText('一周'),
        onClick(picker) {
          pickerHandler(picker, 1);
        }
      },
      {
        text: getText('两周'),
        onClick(picker) {
          pickerHandler(picker, 2);
        }
      },
      {
        text: getText('三周'),
        onClick(picker) {
          pickerHandler(picker, 3);
        }
      },
      {
        text: getText('四周'),
        onClick(picker) {
          pickerHandler(picker, 4);
        }
      }
    ]
  };
}
