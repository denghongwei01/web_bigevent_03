// 入口函数
$(function () {
    $('#left_reg').on('click', function () {
        $('.deng-box').hide()
        $('.zhu-box').show()

    })
    $('#right_login').on('click', function () {
        $('.deng-box').show()
        $('.zhu-box').hide()

    })

    // 3. 自定义验证规则
    var form = layui.form;
    form.verify({
        // 自定义了一个叫做 pwd 校验规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            var pwd = $('.zhu-box [name=password]').val()
            // alert(pwd)
            // alert(value)
            if (pwd !== value) {
                return "两次密码不一致"
            }
        }
    })

    // 4.注册功能
    // 监听注册表单的提交事件
    // 引用 layui 中的 弹出层功能
    var layer = layui.layer;
    $('#form_reg').on('submit', function (e) {
        // 1.阻止默认的提交行为
        e.preventDefault()
        // 2.发起ajax的POST请求
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.zhu-box [name=username]').val(),
                password: $('.zhu-box [name=password]').val(),
            },
            success: function (res) {
                // 返回状态判断
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 提交成功后处理代码
                layer.msg('注册成功，请登录！');
                // 手动切换到登录表单
                $('#right_login').click();
                // 重置form表单 reset 清零的清空
                $('#form_reg')[0].reset();
            }
        })
    })

    // 5.登录功能(给form标签绑定事件，button按钮触发提交事件)
    $('#form_login').submit(function (e) {
        // 阻止表单提交
        e.preventDefault();
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: "/api/login",
            data: $(this).serialize(),
            success: function (res) {
                // 校验返回状态
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 提示信息，保存token，跳转页面
                layer.msg('恭喜您，登录成功');
                // token 用来标识用户是否登录的令牌，后台的页面需要用户登录之后才能查阅，那么权限校验的机制也就出来了，需要检验权限的页面后台先判断请求头里面是否有token，以此来判断是否是登录状态
                localStorage.setItem('token', res.token);
                // 跳转 location就是位置地点的意思
                location.href = '/index.html';
            }
        })
    })
})