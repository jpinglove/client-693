<template>
	<view class="container">
		<view class="chart-card">
			<text class="card-title">每日发布量趋势</text>
			<qiun-data-charts type="line" :chartData="dailyPostsData" />
		</view>
		<!-- ... 其他图表和导入导出按钮 ... -->
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
	export default {
		data() {
			return { dailyPostsData: {} }
		},
		onLoad() {
			this.fetchDailyPostsStats();
		},
		methods: {
			async fetchDailyPostsStats() {
				const stats = await request({ url: '/admin/stats/daily-posts' });
				// 将数据格式化为图表需要的格式
				this.dailyPostsData = {
					categories: stats.map(item => item._id),
					series: [{ name: "发布量", data: stats.map(item => item.count) }]
				};
			},
			// ... 统计和导入导出方法
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
</style>


