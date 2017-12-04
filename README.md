# 股票小助手 Chrome 插件

源程序属于Chrome上架插件[股票小助手](https://chrome.google.com/webstore/detail/%E8%82%A1%E7%A5%A8%E5%B0%8F%E5%8A%A9%E6%89%8B/pbhnnkmgakdodiillkoacilnkgonfkpe?hl=zh-CN)，因其随机对任意网站随机插入广告、而且没有预先提醒的行为有流氓的嫌疑，故删除其广告行为代码后自用。

此插件的数据API采用的是腾讯的股票数据源。

## Features

* 移除对任意地址随机弹广告的后台行为
* 移除跟踪用户输入股票的行为
* 移除页面访问追踪
* 插件使用最小权限(仅访问数据接口gtimg.cn) 
* 添加导出导入自选股功能

从应用商店安装的版本没有导出功能，用户要保留自选股数据，可在源插件的窗体右键-检查（Inspect），在出现的调试窗口的`Console`中运行`localStorage.getItem("stock_list")`，把输出的代码复制，粘贴到修改版的导出导入框中。
