// 获取DOM元素
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const previewContainer = document.querySelector('.preview-container');
const originalImage = document.getElementById('originalImage');
const compressedImage = document.getElementById('compressedImage');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const downloadBtn = document.getElementById('downloadBtn');

// 点击上传区域触发文件选择
dropZone.addEventListener('click', () => fileInput.click());

// 处理文件拖放
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#007AFF';
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#DEDEDE';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#DEDEDE';
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

// 处理文件选择
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

// 处理文件
function handleFile(file) {
    if (!file.type.match('image.*')) {
        alert('请选择图片文件！');
        return;
    }

    // 显示原始文件大小
    originalSize.textContent = formatFileSize(file.size);

    // 创建文件预览
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage.src = e.target.result;
        compressImage(e.target.result);
    };
    reader.readAsDataURL(file);

    // 显示预览区域
    previewContainer.style.display = 'block';
}

// 压缩图片
function compressImage(src) {
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 保持原始尺寸
        canvas.width = img.width;
        canvas.height = img.height;

        // 绘制图片
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 压缩并更新预览
        updateCompressedImage();
    };
}

// 更新压缩后的图片
function updateCompressedImage() {
    const quality = qualitySlider.value / 100;
    qualityValue.textContent = qualitySlider.value + '%';

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = originalImage.naturalWidth;
    canvas.height = originalImage.naturalHeight;
    
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    
    // 获取压缩后的图片
    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
    compressedImage.src = compressedDataUrl;

    // 计算压缩后的大小
    const compressedSizeInBytes = Math.round((compressedDataUrl.length - 22) * 3 / 4);
    compressedSize.textContent = formatFileSize(compressedSizeInBytes);
}

// 质量滑块改变时重新压缩
qualitySlider.addEventListener('input', updateCompressedImage);

// 下载压缩后的图片
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'compressed-image.jpg';
    link.href = compressedImage.src;
    link.click();
});

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 