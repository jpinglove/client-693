import { BASE_URL } from './request.js';
import store from '../store';

export function downloadFile(url, fileName) {
    uni.showLoading({ title: '正在生成文件...' });

    uni.downloadFile({
        url: BASE_URL + url,
        header: {
            'Authorization': `Bearer ${store.state.token}`
        },
        success: (res) => {
            if (res.statusCode === 200) {
                // H5平台直接下载，App平台保存到本地
                // #ifdef H5
                const link = document.createElement('a');
                link.href = res.tempFilePath;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                // #endif

                // #ifdef APP-PLUS
                uni.saveFile({
                    tempFilePath: res.tempFilePath,
                    success: function (saveRes) {
                        uni.showToast({
                            title: `文件已保存至：${saveRes.savedFilePath}`,
                            icon: 'none',
                            duration: 3000
                        });
                    }
                });
                // #endif
            } else {
                uni.showToast({ title: '导出失败', icon: 'none' });
            }
        },
        fail: (err) => {
            uni.showToast({ title: '网络错误，导出失败', icon: 'none' });
        },
        complete: () => {
            uni.hideLoading();
        }
    });
}