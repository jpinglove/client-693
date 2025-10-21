<template>
	<view class="container">
		<view class="chart-card">
			<text class="card-title">每日发布量趋势</text>
			<view style="width: 100%; height: 500rpx;">
				<ucharts type="line" :chartData="dailyPostsData" v-if="dailyPostsData.categories" />
			</view>
		</view>
		<view class="admin-section">
			<text class="section-title">数据导出</text>
			<view class="button-grid">
				<button @click="exportData('/admin/export/users', 'all_users.csv')">导出用户</button>
				<button @click="exportData('/admin/export/products', 'all_products.csv')">导出商品</button>
				<button @click="exportData('/admin/export/orders', 'all_orders.csv')">导出订单</button>
			</view>
		</view>
		
		<view class="admin-section">
			<text class="section-title">数据导入</text>
			<button @click="importProducts">导入商品 (CSV)</button>
		</view>
				
	</view>
</template>
<script>
	// 假设你已按之前的指导安装和配置了 qiun-data-charts
	import request from '@/utils/request.js';
	import { downloadFile } from '@/utils/downloader.js';
	import { BASE_URL } from '@/utils/request.js';
		
	export default {
		data() {
			return { 
				dailyPostsData: {},
				
			 }
		},
		onLoad() {
			this.fetchDailyPostsStats();
			
		},
		onReady() {

		},
		methods: {
			async fetchDailyPostsStats() {
				try {
					const stats = await request({ url: '/admin/stats/daily-posts' });
					// 按照 uCharts 的格式组织数据
					let chartData = {
						categories: stats.map(item => item._id),
						series: [{
							name: "发布量",
							data: stats.map(item => item.count)
						}]
					};
					this.dailyPostsData = chartData;
				} catch (error) {
					console.error("Failed to fetch daily posts stats:", error);
				}
			},
			exportData(url, fileName) {
				downloadFile(url, fileName);
			},
			importProducts() {
				uni.chooseFile({
					count: 1,
					extension: ['.csv'], // 仅允许选择 csv 文件
					success: (res) => {
						uni.showLoading({ title: '正在上传并导入...' });
						uni.uploadFile({
							url: BASE_URL + '/admin/import/products',
							filePath: res.tempFilePaths[0],
							name: 'file',
							header: { 'Authorization': `Bearer ${this.$store.state.token}` },
							success: (uploadRes) => {
								const data = JSON.parse(uploadRes.data);
								uni.showModal({ title: '导入结果', content: data.message, showCancel: false });
							},
							fail: () => {
								uni.showToast({ title: '导入失败', icon: 'none' });
							},
							complete: () => {
								uni.hideLoading();
							}
						});
					}
				});
			}
		}
	}
</script>

<style>
/* 管理员页面样式 */
.admin-section { margin-top: 40rpx; background: #fff; padding: 20rpx; border-radius: 10rpx; }
.section-title { /* ... */ }
.button-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20rpx; margin-top: 20rpx; }

.container { padding: 20rpx; }
.chart-card { background-color: #fff; border-radius: 10rpx; padding: 20rpx; margin-bottom: 30rpx; }
.card-title { font-size: 32rpx; font-weight: bold; display: block; margin-bottom: 20rpx; }

</style>


