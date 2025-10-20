<template>
	<view>
		<product-list :products="orderProducts" title="我的订单"></product-list>
	</view>
</template>
<script>
	import request from '@/utils/request.js';
	export default {
		data() {
			return { orderProducts: [] };
		},
		onShow() { this.fetchOrders(); },
		methods: {
			async fetchOrders() {
				try {
					const orders = await request({ url: '/user/orders' });
					// API返回的是订单列表，需要提取其中的商品信息
					this.orderProducts = orders.map(order => order.product);
				} catch (e) { uni.showToast({ title: '加载失败', icon: 'none' }); }
			}
		}
	}
</script>

