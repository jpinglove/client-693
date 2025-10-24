<template>
	<view>
		<product-list :products="products" title="浏览记录"></product-list>
		
		<!-- 分页控制器 -->
		<view class="pagination" v-if="totalPages > 1">
			<button class="page-btn" :disabled="page <= 1" @click="changePage(page - 1)">上一页</button>
			<text class="page-info">{{ page }} / {{ totalPages }}</text>
			<button class="page-btn" :disabled="page >= totalPages" @click="changePage(page + 1)">下一页</button>
		</view>
	</view>
</template>

<script>
import request from '@/utils/request.js';
export default {
    data() {
        return {
            historyProducts: [],
            loading: true,
            page: 1,
            totalPages: 1,
            total: 0
        };
    },
    onShow() {
        this.fetchHistory(1);
    },
    methods: {
			async fetchHistory(newPage) {
				this.loading = true;
				try {
					const data = await request({ 
						url: `/user/view-history?page=${newPage}&limit=10`
					});

					// 返回的是 { history: [...], ... }
					// 提取 history 数组中的 product 对象
					this.historyProducts = data.history.map(item => item.product).filter(p => p); // filter(p => p) 过滤掉可能已删除的商品
					
					this.page = data.page;
					this.totalPages = data.pages;
					this.total = data.total;

				} catch (e) {
					uni.showToast({ title: '加载失败', icon: 'none' });
				} finally {
					this.loading = false;
				}
			},
			changePage(newPage) {
				if (newPage > 0 && newPage <= this.totalPages) {
					this.fetchHistory(newPage);
				}
			}
        }
    } 
</script>

<style>
.container {
	padding-bottom: 120rpx; /* 分页器按钮空间 */
}
.loading-container {
	text-align: center;
	padding-top: 200rpx;
	color: #999;
}
.pagination {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	justify-content: space-around;
	align-items: center;
	background-color: #fff;
	padding: 20rpx;
	border-top: 1px solid #f0f0f0;
}
.page-btn {
	font-size: 28rpx;
}
.page-info {
	color: #666;
}
</style>
