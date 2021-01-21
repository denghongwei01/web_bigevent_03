$(function () {
    // 1.文章类别列表展示
    initArtCateList();
    // 封装函数
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                var str = template('tpl-art-cate', res)
                $('tbody').html(str);
            }
        })
    }

    // 2.显示添加文章分类列表 弹出层的显示
    var layer = layui.layer;
    $('#btnAdd').on('click', function () {
        // 利用框架代码，显示提示添加文章类别区域
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-add').html() //这里content是一个普通的String
        });
    })

    // 3.弹出层内部提交（事件委托）
    var indexAdd = null;
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 因为我们添加成功了，所以要重新渲染页面中的数据
                initArtCateList();
                layer.msg('恭喜您，文章类别添加成功')
                layer.close(indexAdd);
            }
        })
    })

    // 4.修改-展示表单
    var indexEdit = null;
    var form = layui.form;
    $('tbody').on('click', '.btn-edit', function () {
        // 利用框架代码，显示提示添加文章类别区域
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-edit').html(),
        })
        // 4.2 获取 Id ，发送ajax获取数据，渲染页面
        var Id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function (res) {
                console.log(res)
                form.val('form-edit', res.data);
            }
        })
    })

    // 5.修改 - 事件代理
    // 4.1修改-提交
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 因为我们添加成功了，所以要重新渲染页面中的数据
                initArtCateList()
                layer.msg('恭喜您，文章类别更新成功')
                layer.close(indexEdit)
            }
        })
    })

    // 6.删除
    $('tbody').on('click', '.btn-delete', function () {
        var Id = $(this).attr('data-id');
        // 弹出询问框
        //eg1
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    initArtCateList();
                    layer.msg('恭喜您，文章类别添加成功')
                    layer.close(index);
                }
            })

        });
    })
})