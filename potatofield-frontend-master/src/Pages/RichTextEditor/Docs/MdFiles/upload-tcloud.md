# 腾讯云 COS

配置洋芋田富文本编辑器使用腾讯云 COS 存储作为上传图片的目标，主要有以下几个步骤：

- 注册腾讯云账号，并获取访问密钥
- 开通腾讯云 COS 服务，并创建存储桶
- 将访问密钥和存储桶信息填入洋芋田富文本编辑器的图片上传设置

## 注册腾讯云账号并获取访问密钥

访问[腾讯云官网](https://cloud.tencent.com/)以完成注册步骤。

![](https://files.potatofield.cn/Static/RichTextEditor/Docs/tcloud-home.webp)

### 注册账号并实名认证

点击网页右上角进入注册页面。推荐使用微信扫码注册，通过联动“腾讯云助手”微信小程序，可以更高效便捷地完成账号注册和实名认证过程。

### 创建 API 密钥

登录后点击右上角“控制台”进入控制台，鼠标悬浮在右上角的头像上并在出现的菜单中点击“访问管理”以进入访问管理页面。在访问管理页面点击左侧的“访问密钥”选项中的“API密钥”，进入 API 密钥管理页面。也可以登录后直接访问[这里](https://console.cloud.tencent.com/cam/capi)，进入 API 密钥管理页面。

![](https://files.potatofield.cn/Static/RichTextEditor/Docs/tcloud-cam.webp)

点击“新建密钥”按照提示创建 API 密钥，并记住对应的 SecretId 和 SecretKey，留待之后的步骤使用。

## 开通对象存储并创建存储桶

在腾讯云控制台页面将鼠标悬浮在左上角的“云服务”按钮上，并在弹出的菜单中选择“对象存储”以进入 COS 管理。也可以直接访问[这里](https://console.cloud.tencent.com/cos)直接跳转到对象存储管理页面。

![](https://files.potatofield.cn/Static/RichTextEditor/Docs/tcloud-cos-menu.webp)

### 开通对象存储服务

在对象存储管理页面，未开通过对象存储的用户需要先开通对象存储服务。

![](https://files.potatofield.cn/Static/RichTextEditor/Docs/tcloud-cos-new.webp)

按照页面上的提示开通对象存储服务即可。

### 创建存储桶

开通对象存储服务后，点击页面上的“创建存储桶”，出现创建存储桶的选项。

![](https://files.potatofield.cn/Static/RichTextEditor/Docs/tcloud-cos.webp)

按照自己的需求自定义存储桶的名称和区域，**并将“访问权限”设为“公有读私有写”**；其他配置默认即可。

![](https://files.potatofield.cn/Static/RichTextEditor/Docs/tcloud-cos-detail.webp)

记住创建完成的存储桶的名称和所属地域，留待后续使用。**存储桶名称是包含自定义名称和“-”连接的数字后缀的完整名称，所属地域是括号中的英文。**

## 配置腾讯云 COS 上传图片

![](https://files.potatofield.cn/Static/RichTextEditor/Docs/editor-home.webp)

点击洋芋田富文本编辑器左下角的设置按钮，打开设置窗口。

![](https://files.potatofield.cn/Static/RichTextEditor/Docs/editor-settings-upload-tcloud.webp)

设置“上传目标”为“腾讯云”，并将之前步骤获取的数值填入。访问密钥的 SecretId 和 SecretKey 分别填入“SecretId”和“SecretKey”，存储桶名称填入“Bucket”，地域填入“Region”。填写完成后点击下方的“保存配置”按钮，即可将腾讯云对象存储作为洋芋田富文本编辑器的图片上传目标。