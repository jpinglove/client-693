<template>
  <view>
    <!-- 列表组件，传入不同的数据和标题, 传入 showEditButton 并监听 @edit 事件 -->
	<view class="header-bar">
		<text class="page-title">我的发布</text>
		<button class="export-btn" size="mini" @click="exportData">导出CSV</button>
	</view>
    <product-list
      :products="products"
      :showEditButton="true"
      @edit="handleEdit"
    ></product-list>
  </view>
</template>
<script>
  import request from "@/utils/request.js";
  // import productList from '@/components/product-list.vue'; // 引入通用列表组件
	import { downloadFile } from '@/utils/downloader.js'; // 导入下载函数

  export default {
    data() {
      return { products: [] };
    },
    onLoad() {
      // 在页面加载时开始监听
      uni.$on("dataChanged", this.handleDataChange);
    },
    onShow() {
      this.fetchPublications();
    },
    onUnload() {
      // 在页面卸载时移除监听，避免内存泄漏
      uni.$off("dataChanged", this.handleDataChange);
    },
    methods: {
      handleDataChange() {
        console.log("My Publications page received dataChanged event!");
        // 接收到事件后，重新获取数据
        this.fetchPublications();
      },
      async fetchPublications() {
        try {
          this.products = await request({ url: "/user/publications" });
        } catch (e) {
          uni.showToast({ title: "加载失败", icon: "none" });
        }
      },
      // 处理编辑事件，跳转到编辑页
      handleEdit(id) {
        uni.navigateTo({
          url: `/pages/edit/edit?id=${id}`,
        });
      },
	  // 导出方法
		exportData() {
			downloadFile('/user/export/publications', 'my_publications.csv');
		}
    },
  };
</script>

<style>
/* 页面头部样式 */
.header-bar { display: flex; justify-content: space-between; align-items: center; padding: 20rpx; }
.page-title { font-size: 32rpx; font-weight: bold; }
.export-btn { background-color: #19be6b; color: white; }
</style>
