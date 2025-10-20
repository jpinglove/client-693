<template>
	<view>
		<product-list :products="products" title="浏览记录"></product-list>
	</view>
</template>
< script > import request from '@/utils/request.js';
export
default {
        data() {
            <!-- return { products:[] }; -->
            return { products:[] };
             <!-- products:[] -->
        },
        onShow() {
            this.fetchHistory();
        },
        methods: {
            async fetchHistory() {
                try {
                    this.products = await request({
                        url: '/user/view-history'
                    });
                } catch(e) {
                    uni.showToast({
                        title: '加载失败',
                        icon: 'none'
                    });
                }
            }
        }
    } 
	
	< /script>