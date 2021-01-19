$(function () {
    var form = layui.form;
    form.verify({
        // 1.密码
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 1.2 新旧不重复
        samePwd: function (value) {
            if (value == $('[name=oldPwd]').val()) {
                return "原密码和旧密码不能相同!"
            }
        },
        // 1.3 两次新密码必须相同
        rePwd: function (value) {
            // value是再次输入的新密码，新密码需要重新获取
            if (value !== $('[name=newPwd]').val()) {
                return "两次新密码输入不一致!"
            }
        }
    })

    // 2.表单提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg('修改密码成功');
                $('.layui-form')[0].reset();
            }
        })
    })
})