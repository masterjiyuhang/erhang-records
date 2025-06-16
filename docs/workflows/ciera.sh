#!/bin/bash

# 基础路径
base_path="https://gitlab.jctrans.net.cn/jctrans/tech/front/dashboard/serverside"
default_project="server-era-h5-front"
sub_path="/-/pipelines/new" # 修正赋值符号

# 检查是否有参数输入
if [ -n "$1" ]; then
  # 有参数时，使用指定项目名
  project_name="$1"
  url="$base_path/$project_name$sub_path"
else
  # 无参数时，使用默认项目名
  project_name="$default_project"
  url="$base_path/$project_name$sub_path"
  # 修正：无参数时不应显示错误通知
  # osascript -e "display notification \"未知项目: $project_name h5\" with title \"CIERA\""
fi

# 调试输出（可选）
echo "即将打开URL: $url"

# 检查Chrome是否安装
if [ -d "/Applications/Google Chrome.app" ]; then
  open -a "Google Chrome" "$url"
else
  # 若未安装Chrome，使用默认浏览器打开
  open "$url"
  osascript -e 'display alert "未找到Chrome浏览器，已使用默认浏览器打开"'
fi
