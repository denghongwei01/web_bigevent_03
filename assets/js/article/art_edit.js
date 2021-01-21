$(function () {
    // 3.初始化分类
    var form = layui.form;
    var layer = layui.layer;
    // 0.设置表单信息
    // 用等号切割，然后使用后面的值!
    // alert(location.search.split('=')[1]);

    function initForm() {
        var id = location.search.split('=')[1];
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                // 效验
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 渲染到form表单中
                form.val('form-edit', res.data);
                // 重新渲染页面
                form.render();
                // tinymce赋值(百度)
                tinyMCE.activeEditor.setContent(res.data.content)
                // 图片
                if (!res.data.cover_img) {
                    return layer.msg('用户未曾上传头像!')
                }
                var newImgURL = baseURL + res.data.cover_img;
                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域  
                    .attr('src', newImgURL)  // 重新设置图片路径   
                    .cropper(options)        // 重新初始化裁剪区域
            }
        })
    }


    initCate();// 调用函数
    // 封装
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // 效验
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 赋值，渲染form
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 重新渲染页面
                form.render();
                // 文章分类渲染完毕在调用，初始化form的方法
                initForm();
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 4.点击按钮，选择图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 5.设置/更换封面图片
    $('#coverFile').on('change', function (e) {
        // 拿到用户选择的文件
        var file = e.target.files[0]
        // 判断用户是否选择了文件
        // if (file.length === 0) {
        //     return
        // }
        if (file === undefined) {
            return
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
        // 为裁剪区域重重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 6.设置状态
    var state = '已发布';
    // $('#btnSave1').on('click', function () {
    //     state = '已发布';
    // })
    $('#btnSave2').on('click', function () {
        state = '草稿';
    })

    // 7.添加文章
    $('#form-pub').on('submit', function (e) {
        // 阻止默认提交
        e.preventDefault();
        // 创建FormData对象，收集数据
        var fd = new FormData(this)
        // 放入状态
        fd.append('state', state);
        //放入图片
        $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        }).toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            fd.append('cover_img', blob);
            // 发送ajax，要在toBlob（）函数里面
            // console.log(...fd);
            publishArticle(fd);
        })
    })
    // 封装，添加文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                // 失败判断
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('恭喜您，修改文章成功')
                // 跳转
                // location.href = '/article/art_list.html'
                // 定时器跳转
                setTimeout(function () {
                    window.parent.document.getElementById('art_list').click();

                }, 1500)
            }
        })
    }
})