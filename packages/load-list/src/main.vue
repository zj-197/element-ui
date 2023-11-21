<template>
  <div class="el-load-list"
       :element-loading-text="loadingText"
       element-loading-background="rgba(255, 255, 255, 0.7)"
       v-loading="isLoading">
    <slot :list="list" :isError="isError"></slot>
    <div v-if="list.length === 0" class="el-load-list-empty-container"
         :class="{ 'el-load-list-empty-is-loading': isLoading }">
      <slot name="empty" :isError="isError">
        <el-empty class="el-load-list-empty"
                  :description="isError ? errorText : emptyText"
                  :image="isError ? realErrorImage: realEmptyImage">
        </el-empty>
        <div class="el-empty-btn-container">
          <slot name="empty-btn" :isError="isError">
            <el-button type="primary" size="small" @click.stop="refresh(false)">
              {{ isError ? errorBtnText : emptyBtnText }}
            </el-button>
          </slot>
        </div>
      </slot>
    </div>
    <el-pagination v-bind="realPaginationProps"
                   v-if="!realHiddenPagination"
                   class="el-load-list-pagination"
                   @size-change="onPaginationSizeChange"
                   @current-change="onPaginationPageChange"/>
  </div>
</template>

<script>
import {assign} from 'element-ui/src/utils/lodash';
import {isObject} from 'element-ui/src/utils/types';
import ElPagination from 'element-ui/packages/pagination';
import ElEmpty from 'element-ui/packages/empty';
import ElButton from 'element-ui/packages/button';
import {t} from 'element-ui/src/locale';
import {scrollIntoView} from 'element-ui/src/utils/scroll-into-view-or-body';

const PAGINATION_KEY = Object.freeze({
  page: 'page',
  pageSize: 'pageSize',
  total: 'total',
  list: 'list' // 列表记录字段key
});
export default {
  name: 'ElLoadList',
  props: {
    initValue: Array, // 初始化值，之所以设置这个，是为了兼容nuxt的seo
    total: Number, // 传入initValue时，此属性必传
    loadData: {
      type: Function,
      required: true
    },
    pageSize: {
      type: Number,
      default: 20
    },
    paginationKey: {
      type: Object,
      default() {
        return Object.create(null);
      }
    },
    paginationProps: {
      type: Object,
      default() {
        return Object.create(null);
      }
    }, // 分页组件相关配置
    emptyText: {
      type: String,
      default: t('el.empty.description')
    },
    emptyBtnText: {
      type: String,
      default: t('el.wpCommon.reload')
    },
    emptyImage: String, // base64或者网络地址
    errorText: {
      type: String,
      default: t('el.image.error')
    },
    errorBtnText: {
      type: String,
      default: t('el.wpCommon.reload')
    },
    errorImage: String, // base64或者网络地址
    loadingText: {
      type: String,
      default: t('el.select.loading')
    },
    autoScrollTop: {
      type: Boolean,
      default: true
    }, // 是否点击分页组件时自动回到el-load-list的顶部
    hiddenPagination: Boolean // 是否隐藏分页
  },
  components: {
    ElPagination,
    ElEmpty,
    ElButton
  },
  data(vm) {
    const rootPagination = vm.$ELEMENT ? vm.$ELEMENT.paginationKey || Object.create(null) : Object.create(null);
    const realPaginationKey = assign(Object.create(null), PAGINATION_KEY, rootPagination, vm.paginationKey);
    return {
      list: Array.isArray(vm.initValue) ? vm.initValue : [],
      isLoading: !Array.isArray(vm.initValue), // 是否加载中
      isError: false, // 是否加载错误
      pagination: {
        [realPaginationKey.page]: 1,
        [realPaginationKey.pageSize]: vm.pageSize,
        [realPaginationKey.total]: vm.total || 0
      }
    };
  },
  computed: {
    realPaginationKey() {
      const rootPagination = this.$ELEMENT ? this.$ELEMENT.paginationKey || Object.create(null) : Object.create(null);
      return assign(Object.create(null), PAGINATION_KEY, rootPagination, this.paginationKey);
    },
    loadDataIsFn() {
      return typeof this.loadData === 'function';
    },
    realEmptyImage() {
      return this.emptyImage || (this.$ELEMENT ? this.$ELEMENT.emptyImage : undefined);
    },
    realHiddenPagination() {
      const page = this.pagination[this.realPaginationKey.page];
      const list = this.list;
      const isHidden = page === 1 && (Array.isArray(list) ? list.length === 0 : true);
      return this.$options.propsData.hasOwnProperty('hiddenPagination') ? this.hiddenPagination : !this.isError && isHidden;
    },
    realErrorImage() {
      return this.errorImage || (this.$ELEMENT ? this.$ELEMENT.errorImage : undefined) || this.realEmptyImage;
    },
    realPaginationProps() {
      return assign({
        align: 'center'
      }, this.paginationProps, {
        currentPage: this.pagination[this.realPaginationKey.page],
        total: this.pagination[this.realPaginationKey.total],
        pageSize: this.pagination[this.realPaginationKey.pageSize]
      });
    }
  },
  created() {
    if (!this.$isServer && this.loadDataIsFn && !Array.isArray(this.initValue)) {
      this.getList(this.pagination);
    }
  },
  methods: {
    getList(pagination) {
      const {
        [this.realPaginationKey.page]: page,
        [this.realPaginationKey.pageSize]: pageSize
      } = pagination;
      this.isLoading = true;
      return this.loadData({
        [this.realPaginationKey.page]: page,
        [this.realPaginationKey.pageSize]: pageSize
      }).then(res => {
        if (res && isObject(res) && Object.keys(res).length > 0) {
          const list = res[this.realPaginationKey.list];
          if (Array.isArray(list)) {
            this.list = list;
          } else {
            this.list = [];
          }
          Object.keys(this.pagination).forEach(key => {
            if (Object.prototype.hasOwnProperty.call(res, key)) {
              this.setPagination(key, res[key]);
            }
          });
        } else {
          this.list = [];
        }
        if (this.isError) {
          this.isError = false;
        }
        this.$emit('loaded', this.isError, assign({
          [this.realPaginationKey.list]: this.list
        }, this.pagination));
        this.isLoading = false;
      }).catch(e => {
        this.list = [];
        this.isError = true;
        this.$emit('loaded', this.isError, assign({
          [this.realPaginationKey.list]: this.list
        }, this.pagination));
        this.isLoading = false;
        throw e;
      });
    },
    /**
     * @description - 强制刷新表格数据
     * @param {boolean} [isForce] - 是否强制刷新
     * @return {Promise<unknown>}
     */
    refresh(isForce) {
      const page = this.pagination[this.realPaginationKey.page];
      const pageSize = this.pagination[this.realPaginationKey.pageSize];
      // 是否强制刷新回到第一页
      if (isForce) {
        return this.getList({
          [this.realPaginationKey.page]: 1,
          [this.realPaginationKey.pageSize]: pageSize
        });
      } else {
        return this.getList({
          [this.realPaginationKey.page]: page,
          [this.realPaginationKey.pageSize]: pageSize
        });
      }
    },
    /**
     * @description - 表格删除刷新时的方法, 主要作用为当删除最后一页数据时，删除的个数大于当前的pageSize时，当前页数自动减一
     * @param {number} [delCount] - 删除的个数
     * @return {Promise<unknown>}
     */
    refreshOfDelete(delCount) {
      delCount = delCount || 1;
      const page = this.pagination[this.realPaginationKey.page];
      const pageSize = this.pagination[this.realPaginationKey.pageSize];
      const total = this.pagination[this.realPaginationKey.total];
      const listLength = this.list.length;
      const isLastPage = page * pageSize >= total;
      // 如果是最后一页
      if (isLastPage) {
        if (delCount >= listLength) {
          this.setPagination(this.realPaginationKey.page, Math.max(page - 1, 1));
        }
      }
      return this.refresh(false);
    },
    // 设置pagination数据
    setPagination(key, value) {
      this.$set(this.pagination, key, value);
    },
    onPaginationSizeChange(val) {
      this.setPagination(this.realPaginationKey.pageSize, val);
      this.scrollListTop();
      this.refresh(false);
    },
    onPaginationPageChange(val) {
      this.setPagination(this.realPaginationKey.page, val);
      this.scrollListTop();
      this.refresh(false);
    },
    scrollListTop() {
      if (this.autoScrollTop) {
        scrollIntoView(this.$el, undefined, this.$el);
      }
    }
  }
};
</script>
