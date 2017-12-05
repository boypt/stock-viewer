# 股票小助手 Chrome 插件

[从Chrome商店安装](https://chrome.google.com/webstore/detail/股票小助手/fgapjjkffggllllignindphnioliplok)

此插件采用腾讯股票数据源。

## Features

* 无后台行为
* 插件使用最小权限(仅访问数据接口gtimg.cn) 
* 添加导出导入自选股功能

stock360的版本没有导出功能，用户要保留自选股数据，可在原插件的图标右键选择`检查弹出内容`，在出现的调试窗口的`>`中运行`localStorage.getItem("stock_list")`，把输出的代码复制，粘贴到本插件的`导出导入`功能当中。
