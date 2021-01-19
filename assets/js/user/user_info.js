$(function () {
    // 1.自定义校验
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度为1-6之间！"
            }
        }
    })

    // 2.用户渲染
    initUserInfo();

    // 导出layui
    var layer = layui.layer
    // 封装函数
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 3.表单重置
    $('#btnReset').on('click', function (e) {
        // 阻止重置
        e.preventDefault();
        // 从新用户渲染
        initUserInfo();
    })

    // 4.修改用户信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();

        $.ajax({
            method: "POST",
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('用户信息修改失败！')
                }
                layer.msg('用户信息修改成功！')

                window.parent.getUserInof();
            }
        })
    })
})