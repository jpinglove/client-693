<template>
	<view class="container">
		
		<view class="chart-card">
			<text class="card-title">热门分类销售统计</text>
			<view style="width: 100%; height: 500rpx;">
				<echarts-for-uniapp
				      :echarts="echarts"
				      :option="option"
				      style="width: 100%; height: 300px;"
				    />
				<!-- <canvas canvas-id="hotCategoriesChartCanvas" id="hotCategoriesChartCanvas" class="charts"></canvas> -->
			</view>
		</view>
		
		<view class="chart-card">
			<text class="card-title">每日发布量趋势</text>
			<view style="width: 100%; height: 500rpx;">
				<ucharts type="line" :chartData="dailyPostsData" v-if="dailyPostsData.categories" />
			</view>
		</view>
		 
		<view class="chart-card">
			<text class="card-title">每日交易量趋势</text>
			<custom-bar-chart :chartData="dailyTransactionsData" v-if="dailyTransactionsData.categories" />
		</view>

			
		<view class="admin-section">
			<text class="section-title">数据导出</text>
			<view class="button-grid">
				<button @click="exportData('/admin/export/users', 'all_users.csv')">导出用户</button>
				<button @click="exportData('/admin/export/products', 'all_products.csv')">导出商品</button>
				<button @click="exportData('/admin/export/orders', 'all_orders.csv')">导出订单</button>
			</view>
		</view>				
	</view>
</template>
<script>
	import request from '@/utils/request.js';
	import { downloadFile } from '@/utils/downloader.js';
	import { BASE_URL } from '@/utils/request.js';
	import * as echarts from 'echarts';
	import EchartsForUniapp from 'echarts-for-uniapp/dist/echarts.self';
	let hotCategoriesChartInstance = null;

	export default {
		components: {
		    EchartsForUniapp
		  },
		data() {
			return { 
				dailyPostsData: {},
				dailyTransactionsData: {},
				
				// 5. 将 echarts 核心库实例挂载到 data 上，以便传递给组件
				  echarts: echarts,
				  
				  // 6. 准备 ECharts 的配置 (option)
				  option: {
					title: {
					  text: 'ECharts 示例'
					},
					tooltip: {},
					xAxis: {
					  data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
					},
					yAxis: {},
					series: [
					  {
						name: '销量',
						type: 'bar',
						data: [5, 20, 36, 10, 10, 20]
					  }
					]
				}
			}
		},
		onLoad() {
			this.fetchDailyPostsStats();
			this.fetchDailyTransactionsStats();
			this.fetchHotCategoriesStats();
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
			async fetchDailyTransactionsStats() {
				try {
					const stats = await request({ url: '/admin/stats/daily-transactions' });
					// 格式化为图表需要的格式
					let chartData = {
						categories: stats.map(item => item._id), // X轴：日期
						series: [{
							name: "交易量",
							data: stats.map(item => item.count) // Y轴：数量
						}]
					};					
					this.dailyTransactionsData = chartData;
				} catch (error) {
					console.error("Failed to fetch daily transactions stats:", error);
				}
			},
			// 获取热门分类销售统计数据的方法
			async fetchHotCategoriesStats() {
				try {
					const stats = await request({ url: '/admin/stats/hot-categories-by-sales' });
					
					// 将后端数据格式化为 wx-charts 需要的格式
					// 饼图的数据格式非常简单，就是一个对象数组
					const chartData = stats.map(item => ({
						name: item._id, // 分类名
						data: item.count, // 数量
						// color: getRandomColor() 
					}));
					


				} catch (error) {
					console.error("Failed to fetch hot categories stats:", error);
				}
			},

			exportData(url, fileName) {
				downloadFile(url, fileName);
			},
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
.charts-box {
  width: 100%;
  height: 300px;
}
</style>


