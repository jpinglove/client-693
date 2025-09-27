<template>
	<view class="container">
		<view v-if="products.length > 0">
			<view class="product-item" v-for="product in products" :key="product._id" @click="goToDetail(product._id)">
				<image class="product-image" :src="getProductImageUrl(product._id)"></image>
				<view class="product-info">
					<text class="product-title">{{ product.title }}</text>
					<view class="bottom-info">
						<text class="product-price">¥{{ product.price }}</text>
						<text :class="['status-badge', product.status === 'sold' ? 'sold' : 'selling']">
							{{ product.status === 'sold' ? '已售出' : '售卖中' }}
						</text>
					</view>
				</view>
			</view>
		</view>
		<view v-else class="empty-container">
			<image class="empty-image" src="/static/empty.png"></image>
			<text class="empty-text">这里什么都没有哦~</text>
		</view>
	</view>
</template>

<script>
	import { BASE_URL } from '@/utils/request.js';
	export default {
		props: {
			products: {
				type: Array,
				default: () => []
			}
		},
		methods: {
			getProductImageUrl(id) {
				return `${BASE_URL}/products/${id}/image`;
			},
			goToDetail(id) {
				uni.navigateTo({
					url: `/pages/detail/detail?id=${id}`
				});
			}
		}
	}
</script>

<style scoped>
.container { padding: 20rpx; }
.product-item { display: flex; padding: 20rpx; margin-bottom: 20rpx; background: #fff; border-radius: 10rpx; }
.product-image { width: 150rpx; height: 150rpx; margin-right: 20rpx; border-radius: 10rpx; }
.product-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.bottom-info { display: flex; justify-content: space-between; align-items: center; }
.product-price { color: red; font-weight: bold; }
.status-badge { padding: 5rpx 15rpx; border-radius: 20rpx; color: #fff; font-size: 24rpx; }
.selling { background-color: #28a745; }
.sold { background-color: #dc3545; }
.empty-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding-top: 200rpx; color: #999; }
.empty-image { width: 200rpx; height: 200rpx; margin-bottom: 20rpx; }
</style>