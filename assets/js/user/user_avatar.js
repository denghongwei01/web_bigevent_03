$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 2.选择文件 相当于点击了选择文件按钮
    $('#btnChooseImage').on('click', function () {
        $('#file').click();
    })

    // 3.修改裁剪图片
    var layer = layui.layer;
    $('#file').on('change', function (e) {
        // 3.1 拿到用户选择的文件
        var file = e.target.files[0]
        // 来一个非空校验
        if (file == undefined) {
            return layer.msg('请选择图片')
        }
        // 3.2 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
        // 3.3 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 4.上传头像
    $('#btnUpload').on('click', function () {
        // 输出为 base64 格式的字符串
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // console.log(dataURL);
        // console.log(typeof dataURL);

        // 发送ajax
        $.ajax({
            method: 'post',
            url: '/my/update/avatar',
            data: {
                avatar:dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('恭喜您，更换头像成功！')
                window.parent.getUserInof();
            }
            })
    })
})