<template>
	<view>
		<!-- 列表组件，传入不同的数据和标题 -->
		<view class="header-bar">
			<text class="page-title">我的收藏</text>
			<button class="export-btn" size="mini" @click="exportData">导出CSV</button>
		</view>
		<product-list :products="products" title="我的收藏"></product-list>
	</view>
</template>
<script>
	import request from '@/utils/request.js';
	// import productList from '@/components/product-list.vue'; // 引入通用列表组件
	import { downloadFile } from '@/utils/downloader.js';
	
	export default {
		// components: { productList },
		data() {
			return { products: [] };
		},
		onShow() { this.fetchFavorites(); },
		methods: {
			async fetchFavorites() {
				try {
					this.products = await request({ url: '/user/favorites' });
				} catch (e) { uni.showToast({ title: '加载失败', icon: 'none' }); }
			},
			// 导出方法
			exportData() {
				downloadFile('/user/export/favorites', 'my_favorites.csv');
			}
		}
	}
</script>

<style>
/* 页面头部样式 */
.header-bar { display: flex; justify-content: space-between; align-items: center; padding: 20rpx; }
.page-title { font-size: 32rpx; font-weight: bold; }
.export-btn { background-color: #19be6b; color: white; }
</style>

