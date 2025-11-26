<!--
 * @Author: CNOliverZhang cnoliverzhang@gmail.com
 * @Date: 2024-01-22 20:18:47
 * @LastEditors: CNOliverZhang cnoliverzhang@gmail.com
 * @LastEditTime: 2024-01-22 20:32:08
 * @FilePath: /potatofield-frontend/src/Pages/ImageNotebook/Docs/MdFiles/upload-tucang.md
 * @Description: 
-->
# 图仓

配置洋芋田图笔记本使用图仓作为上传图片的目标，主要有以下几个步骤：

- 注册图仓账号，并获取 Token
- 将 Token 填入洋芋田图笔记本的图片上传设置

## 注册图仓账号并获取 Token

访问[图仓首页](https://tucang.cc/)，点击右上角“登录”，在登录页完成注册并登录。

![](https://files.potatofield.cn/Static/ImageNotebook/Docs/tucang-home.webp)

之后点击“免费使用”进入后台，点击“我的”进入用户中心，获取 Token 留待后续步骤使用。

![](https://files.potatofield.cn/Static/ImageNotebook/Docs/tucang-dashboard.webp)

## 配置图仓上传图片

![](https://files.potatofield.cn/Static/ImageNotebook/Docs/settings-entry.webp)

点击洋芋田图笔记本左下角的设置按钮，打开设置窗口。

![](https://files.potatofield.cn/Static/RichTextEditor/Docs/settings-tucang.webp)

设置“上传目标”为“图仓”，并将之前步骤获取的 Token 填入。填写完成后点击下方的“保存配置”按钮，即可将腾讯云对象存储作为洋芋田图笔记本的图片上传目标。