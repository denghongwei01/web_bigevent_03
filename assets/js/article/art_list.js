$(function () {
    // 为 定义时间过滤器
    template.defaults.imports.dataFormat = function (dtStr) {
        var dt = new Date(dtStr)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;

    }
    // 在个位数的左侧填充 0
    function padZero(n) {
        return n > 9 ? n : "0" + n
    }
    //1.定义提交参数
    var q = {
        pagenum: 1,       //页码值
        pagesize: 2,	   //每页显示多少条数据
        cate_id: "",	//文章分类的 Id
        state: "",	//文章的状态，可选值有：已发布、草稿
    };

    // 2.初始化文章列表
    var layer = layui.layer;
    initTable();
    // 封装初始化文章列表函数
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // 获取成功，渲染数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr)
                // 调用分页
                renderPage(res.total);
            }
        })
    }

    // 3.初始化分类 筛选区域里的所有分类获取内容
    var form = layui.form;
    initCate();
    // 封装
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // 校验
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 赋值，渲染form
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render();
            }
        })
    }

    // 4.筛选区域里的所有分类筛选内容
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取
        var state = $('[name=state]').val();
        var cate_id = $('[name=cate_id]').val();
        // 赋值
        q.state = state;
        q.cate_id = cate_id;
        // 初始化文章列表
        initTable();
    })

    // 分页
    var laypage = layui.laypage;
    function renderPage(total) {
        // alert(total);
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
            , count: total,  //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,// 默认就是第一页

            // 分页模块设置，那些子功能
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],// 每页显示多少条数据的选择器

            // 这样可以切换分页的内容了 
            // jump - 切换分页的回调
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    //do something
                    initTable();
                }
            }
        });
    }

    // 删除功能
    var layer = layui.layer;
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        // 弹出层
        //eg1
        layer.confirm('确认是否删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('恭喜您，文章删除成功！')
                    // 页面删除最后一个到前面哪一个
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) {
                        q.pagenum--;
                    }
                    initTable();
                }
            })
            layer.close(index);
        });
    })
})