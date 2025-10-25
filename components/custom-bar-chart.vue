<template>
    <view class="chart-container">
        <!-- Y轴区域 -->
        <view class="y-axis">
            <view class="y-label" v-for="(label, index) in yAxisLabels" :key="index">{{ label }}</view>
        </view>

        <!-- X轴和柱状图主体区域 -->
        <view class="main-chart">
            <!-- 柱状图区域 -->
            <view class="bar-area">
                <view class="bar-item" v-for="(item, index) in seriesData" :key="index">
                    <view 
                        class="bar" 
                        :style="barStyles[index]"
                    ></view>
                </view>
            </view>

            <!-- X轴区域 -->
            <view class="x-axis">
                <view class="x-label" v-for="(label, index) in categories" :key="index">{{ label }}</view>
            </view>
        </view>
    </view>
</template>

<script>
const Y_AXIS_STEPS = 4;
export default {
    name: 'CustomBarChart',
    props: {
        chartData: {
            type: Object,
            default: () => ({ categories: [], series: [{ data: [] }] })
        }
    },
    data() {
        return {
            yAxisMax: 10,
			barStyles: []
        };
    },
    computed: {
        // 从 props 获取数据
        categories() {
            return this.chartData.categories || [];
        },
        seriesData() {
            return this.chartData.series && this.chartData.series[0] ? this.chartData.series[0].data : [];
        },
        yAxisLabels() {
            const maxVal = this.yAxisMax;
            let labels = [];
            for (let i = Y_AXIS_STEPS; i >= 0; i--) {
                const value = (maxVal / Y_AXIS_STEPS) * i;
				labels.push(value % 1 === 0 ? value : value.toFixed(1));
            }
            return labels;
        }
    },
    watch: {
        chartData: {
            handler(newData) {
                const data = newData?.series?.[0]?.data;

                if (data && data.length > 0) {
                    const max = Math.max(...data);
                    
                    // 计算 yAxisMax
                    if (max === 0) {
                        this.yAxisMax = Y_AXIS_STEPS * 2;
                    } else {
                        this.yAxisMax = Math.ceil(max / Y_AXIS_STEPS) * Y_AXIS_STEPS;
                    }
                } else {
                    // 默认值
                    this.yAxisMax = Y_AXIS_STEPS * 2;
                }
				this.calculateYAxis(data);
				this.animateBars(data);
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
		calculateYAxis(data) {
			if (data && data.length > 0) {
				const max = Math.max(...data);
				if (max === 0) {
					this.yAxisMax = 10;
					return;
				}
				this.yAxisMax = Math.ceil(max / 5) * 5;
			} else {
				this.yAxisMax = 10;
			}
		},
		animateBars(data) {
			this.barStyles = data.map(() => ({ height: '0%' }));
			setTimeout(() => {
				const max = this.yAxisMax || 10;
				const newStyles = data.map(value => {
					const percent = (value / max) * 100;
					return { height: `${percent}%` };
				});
				this.barStyles = newStyles;
			}, 50); // 50毫秒的延迟足够了
		}
    }
}
</script>

<style scoped>
/* 确保所有元素盒模型统一 */
* {
    box-sizing: border-box;
}
.chart-container {
    width: 100%;
    height: 500rpx;
    display: flex;
    background-color: #f9f9f9;
    border: 1px solid #eee;
    padding: 20rpx;
}

/* Y轴样式 */
.y-axis {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    font-size: 20rpx;
    color: #666;
    padding-right: 10rpx;
}

/* 主图表区域 */
.main-chart {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-left: 1px solid #ccc;
	width: 0;
}

/* 柱状图区域 */
.bar-area {
    flex: 1;
    display: flex;
    justify-content: space-around;
	align-items: stretch;
    padding: 0 10rpx;
    border-bottom: 1px solid #ccc;
    position: relative;
}

.bar-item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding: 0 10%;
}

.bar {
    width: 100%;
    background-color: #5ea6ff;
    transition: height 0.5s ease-out;
}

/* X轴样式 */
.x-axis {
    display: flex;
    justify-content: space-around;
    font-size: 18rpx;
    color: #666;
    padding-top: 10rpx;
    /* min-height: 30rpx; */
	min-height: 50rpx;
}

.x-label {
    flex: 1;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
	
	transform: rotate(-45deg);
	transform-origin: top center;
	
	/* 限制宽度并处理溢出 */
	max-width: 100%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	
	/* 微调位置 */
	padding-top: 5rpx;
}
.bar-value-debug {
    font-size: 18rpx;
    color: #333;
    margin-bottom: 5rpx;
}
</style>


