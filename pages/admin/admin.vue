<template>
	<view class="container">
		<view class="chart-card">
			<text class="card-title">每日发布量趋势</text>
			<qiun-data-charts type="line" :chartData="dailyPostsData" />
		</view>
		<!-- ... 其他图表和导入导出按钮 ... -->
	</view>
</template>
<script>
	// 假设你已按之前的指导安装和配置了 qiun-data-charts
	import request from '@/utils/request.js';
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
			// ... 其他统计和导入导出方法
		}
	}
</script>