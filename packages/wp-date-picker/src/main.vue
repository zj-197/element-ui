<template>
  <el-date-picker :value="realValue"
                  :type="type"
                  :size="size"
                  :format="realFormat"
                  :value-format="realValueFormat"
                  :readonly="readonly"
                  :placeholder="placeholder || /range/.test(type) ? undefined : t('el.select.placeholder')"
                  :start-placeholder="typeof startPlaceholder === 'undefined' ? (Array.isArray(DATE_PLACEHOLDER_BY_TYPE[type]) ? DATE_PLACEHOLDER_BY_TYPE[type][0] : undefined) : startPlaceholder"
                  :end-placeholder="typeof endPlaceholder === 'undefined' ? (Array.isArray(DATE_PLACEHOLDER_BY_TYPE[type]) ? DATE_PLACEHOLDER_BY_TYPE[type][1] : undefined) : endPlaceholder"
                  :prefix-icon="prefixIcon"
                  :clear-icon="clearIcon"
                  :name="name"
                  :disabled="typeof disabled === 'boolean' ? disabled : false"
                  :clearable="clearable"
                  :id="id"
                  :editable="editable"
                  :align="align"
                  :default-value="defaultValue"
                  :default-time="defaultTime"
                  :range-separator="rangeSeparator"
                  :picker-options="getPickerOptions"
                  :unlink-panels="unlinkPanels"
                  :validate-event="validateEvent"
                  ref="datePicker"
                  @input="onInput"
                  @change="onChange"
                  @blur="(val) => $emit('blur', val)"
                  @focus="onFocus">
  </el-date-picker>
</template>

<script>
import { parseDate, formatDate, isDateObject, modifyWithTimeString, toDate, getWeekNumber } from 'element-ui/src/utils/date-util';
import ElDatePicker from 'element-ui/packages/date-picker';
import {
  DATE_FORMAT_BY_TYPE,
  DATE_PLACEHOLDER_BY_TYPE,
  DEFAULT_FIRST_WEEK_DAY,
  getDisabledTime,
  getMonthPickerOptions,
  getDateOrTimePickerOptions,
  setDisabledTimeSelect, getWeekPickerOptions,
  getWeekFirstDay
} from './util';
import { isObject } from 'element-ui/src/utils/types';
import { assign } from 'element-ui/src/utils/lodash';
import Locale from 'element-ui/src/mixins/locale';
export default {
  name: 'ElWpDatePicker',
  props: {
    type: {
      type: String,
      default: 'date'
    },
    // 当前时间往后或者往前延长多少取决于disabled
    currentDateAddMinutes: {
      type: Number,
      default: 0
    },
    size: String,
    // 这点将element-ui的format和valueFormat统一成format
    format: String,
    // 选择周时的value绑定值的格式化
    weekValueFormat: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    placeholder: String,
    startPlaceholder: String,
    endPlaceholder: String,
    prefixIcon: String,
    clearIcon: {
      type: String,
      default: 'el-icon-circle-close'
    },
    name: {
      default: '',
      type: String
    },
    disabled: {
      type: [Boolean, String],
      validator(val) {
        return [true, false, undefined, 'before', 'after', ''].indexOf(val) > -1;
      },
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    id: {
      default: ''
    },
    editable: {
      type: Boolean,
      default: false
    },
    align: {
      type: String,
      default: 'left'
    },
    value: {},
    defaultValue: {},
    defaultTime: {
      type: [Array, String]
    },
    rangeSeparator: String,
    pickerOptions: {},
    unlinkPanels: {
      type: Boolean
    },
    validateEvent: {
      type: Boolean,
      default: true
    }
  },
  mixins: [Locale],
  components: {
    ElDatePicker
  },
  data() {
    return {
      dynamicDefaultTime: [],
      DATE_PLACEHOLDER_BY_TYPE,
      DATE_FORMAT_BY_TYPE,
      weekValue: null
    };
  },
  computed: {
    realValueFormat({ format, type }) {
      // format传object代表不需要进行格式化, 返回选择的Date对象
      return format === 'object' ? undefined : (['week'].indexOf(type) > -1 ? undefined : format || DATE_FORMAT_BY_TYPE[type]);
    },
    realFormat({ type, format }) {
      return format === 'object' ? undefined : format || DATE_FORMAT_BY_TYPE[type];
    },
    // 获取时间快捷键
    getPickerOptions() {
      const { disabled, type, pickerOptions = Object.create(null) } = this;
      if (disabled === true) return undefined;
      const isRange = /range/.test(type);
      if ((/^(month)|(week)/.test(type))) {
        if (/month/.test(type)) {
          if (!disabled) {
            return assign({
              shortcuts: type === 'month' ? (getMonthPickerOptions('after', isRange)
                .shortcuts.concat(getMonthPickerOptions('before', isRange).shortcuts.slice(1))) : undefined
            }, pickerOptions);
          }
          const monthsOptions = getMonthPickerOptions(disabled, isRange);
          if (type === 'months') {
            delete monthsOptions.shortcuts;
          }
          return assign(monthsOptions, pickerOptions);
        }
        if (!disabled) {
          return assign({
            shortcuts: getWeekPickerOptions('after', this.offsetDay)
              .shortcuts.concat(getWeekPickerOptions('before', this.offsetDay).shortcuts),
            firstDayOfWeek: DEFAULT_FIRST_WEEK_DAY
          }, pickerOptions);
        }
        return assign(getWeekPickerOptions(disabled, this.offsetDay), pickerOptions);
      }
      const pickOptions = getDateOrTimePickerOptions.bind(this);
      if (!disabled) {
        const getShortcuts = (disabled, startIndex = 0, endIndex = -4) => pickOptions(isRange, disabled).shortcuts.slice(startIndex, endIndex);
        const shortcuts = [...getShortcuts('after'), ...getShortcuts('before', 1)];
        return assign({ shortcuts }, pickerOptions);
      }
      const o = pickOptions(isRange, disabled);
      if (/s$/.test(type)) {
        delete o.shortcuts;
      }
      return assign(o, pickerOptions);
    },
    // 真实绑定的值
    realValue({ type, value }) {
      if (type === 'week') {
        if (this.weekValue) return this.weekValue;
        const getDate = (val) => val ? (isDateObject(val) ? val : parseDate(val, this.weekValueFormat)) : val;
        const weekValue = Array.isArray(value) ? getDate(value[0]) : getDate(value);
        return weekValue ? toDate(getWeekFirstDay(weekValue).getTime() + (this.offsetDay * 86400000)) : undefined;
      }
      return value;
    },
    offsetDay() {
      const firstDayOfWeek = (isObject(this.pickerOptions) ? this.pickerOptions : Object.create(null)).firstDayOfWeek;
      return firstDayOfWeek === 7 ? 0 : firstDayOfWeek || DEFAULT_FIRST_WEEK_DAY;
    }
  },
  methods: {
    onInput(val) {
      if (isDateObject(val) && this.type === 'week') {
        this.weekValue = val;
      }
      if (this.realFormat) {
        if (isDateObject(val) && this.type === 'week') {
          val = [formatDate(toDate(val.getTime() - 86400000), this.weekValueFormat), formatDate(toDate(val.getTime() + (86400000 * 5)), this.weekValueFormat), val.getFullYear(), getWeekNumber(val)];
        }
      }
      this.$emit('input', val);
    },
    onFocus(e) {
      if (/time/.test(this.type) && ['before', 'after'].indexOf(this.disabled) > -1) {
        const datePicker = this.getDatePickerInstance();
        datePicker.$nextTick().then(() => {
          const picker = datePicker.picker;
          if (this.type === 'datetimerange') {
            this.formatDateTimeRange(picker);
          } else {
            this.formatDateTime(picker);
          }
        });
      }
      this.$emit('focus', e);
    },
    onChange(val) {
      this.$emit('change', val);
    },
    // 获取datepicker实例
    getDatePickerInstance() {
      return this.$refs.datePicker;
    },
    formatDateTimeRange(picker) {
      let isUpdate = true;
      const callback = (val) => {
        if (picker.maxVisibleDate || picker.minVisibleDate) {
          const currentDate = new Date();
          if (formatDate(currentDate) === formatDate(val)) {
            if (isUpdate) {
              setDisabledTimeSelect.call(picker, currentDate, this.disabled);
              isUpdate = false;
            }
          } else {
            const maxTimeSelectableRange = picker.$refs.maxTimePicker.selectableRange;
            const minTimeSelectableRange = picker.$refs.minTimePicker.selectableRange;
            if (Array.isArray(maxTimeSelectableRange) && maxTimeSelectableRange.length !== 0) {
              picker.$refs.maxTimePicker.selectableRange = [];
              isUpdate = true;
            }
            if (Array.isArray(minTimeSelectableRange) && minTimeSelectableRange.length !== 0) {
              picker.$refs.minTimePicker.selectableRange = [];
              isUpdate = true;
            }
          }
        }
      };
      if (typeof this.minDateUnwatch === 'function') {
        this.minDateUnwatch();
      }
      if (typeof this.maxDateUnwatch === 'function') {
        this.maxDateUnwatch();
      }
      this.minDateUnwatch = picker.$watch('minDate', callback);
      this.maxDateUnwatch = picker.$watch('maxDate', callback);
    },
    formatDateTime(picker) {
      const dateTable = this.getDateTableVm(picker.$children);
      typeof this.dateTimeCallBack === 'function' && this.$off('input', this.dateTimeCallBack);
      typeof this.onDateTimePick === 'function' && dateTable && dateTable.$off('pick', this.onDateTimePick);
      let isUpdate = true;
      this.dateTimeCallBack = (val) => {
        if (!val) return;
        if (this.getIsCurrentDay(val)) {
          if (isUpdate) {
            picker.$refs.timepicker.selectableRange = getDisabledTime(this.disabled, new Date());
            isUpdate = false;
          }
        } else {
          if (Array.isArray(picker.$refs.timepicker.selectableRange) && picker.$refs.timepicker.selectableRange.length !== 0) {
            picker.$refs.timepicker.selectableRange = [];
            isUpdate = true;
          }
        }
      };
      this.onDateTimePick = (val) => {
        setTimeout(() => {
          if (!val) return;
          if (this.disabled === 'before') {
            if (this.getIsCurrentDay(val)) {
              this.getDatePickerInstance().emitInput(new Date());
            } else {
              this.getDatePickerInstance().emitInput(modifyWithTimeString(val, typeof this.defaultTime === 'string' ? this.defaultTime : '00:00:00'));
            }
          } else {
            this.getDatePickerInstance().emitInput(modifyWithTimeString(val, typeof this.defaultTime === 'string' ? this.defaultTime : '00:00:00'));
          }
        }, 50);
      };
      dateTable && dateTable.$on('pick', this.onDateTimePick);
      this.dateTimeCallBack(this.value);
      this.$on('input', this.dateTimeCallBack);
    },
    getIsCurrentDay(val) {
      if (isDateObject(val)) return formatDate(val) === formatDate(new Date());
      return formatDate(parseDate(val, this.realValueFormat)) === formatDate(new Date());
    },
    getDateTableVm(children) {
      const allChildren = children || this.$children;
      let ch = null;
      if (allChildren.length) {
        for (const child of allChildren) {
          if (child.$options._componentTag === 'date-table') {
            ch = child;
            break;
          } else {
            ch = this.getDateTableVm(child.$children);
            if (ch) break;
          }
        }
      }
      return ch;
    }
  },
  beforeDestroy() {
    typeof this.minDateUnwatch === 'function' && this.minDateUnwatch();
    typeof this.maxDateUnwatch === 'function' && this.maxDateUnwatch();
    typeof this.dateTimeCallBack === 'function' && this.$off('input', this.dateTimeCallBack);
  }
};
</script>
