#!/bin/bash

# 基础路径
base_path="/Users/erhang/Documents/workspace/github"
default_project="erhang-records"
note_dir="docs/note"

# 处理参数
if [ -n "$1" ]; then
  # 有参数时，直接打开指定项目
  project_name="$1"
  directory="$base_path/$project_name"

  # 仅打开目录，不创建笔记
  if [ -d "$directory" ]; then
    open -a "Visual Studio Code" "$directory"
  else
    osascript -e 'display alert "目标目录不存在！" message "请检查路径是否正确：'$directory'" as critical'
  fi
else
  # 无参数时，打开默认项目并创建/打开笔记
  project_name="$default_project"
  directory="$base_path/$project_name"

  # 打开项目目录
  if [ -d "$directory" ]; then
    open -a "Visual Studio Code" "$directory"

    # 准备笔记文件
    note_path="$directory/$note_dir"
    date_format=$(date +%Y-%m-%d)
    filename="$date_format.md"
    file_path="$note_path/$filename"

    # 确保笔记目录存在
    mkdir -p "$note_path"

    # 检查文件是否存在
    if [ -f "$file_path" ]; then
      # 文件已存在，直接打开
      open -a "Visual Studio Code" "$file_path"
      osascript -e "display notification \"已打开现有笔记\" with title \"$filename\""
    else
      # 文件不存在，创建新笔记
      cat >"$file_path" <<EOF
# $(date +%Y年%m月%d日)

## 今日笔记

EOF
      open -a "Visual Studio Code" "$file_path"
      osascript -e "display notification \"已创建新笔记\" with title \"$filename\""
    fi
  else
    osascript -e 'display alert "默认项目目录不存在！" message "请检查路径是否正确：'$directory'" as critical'
  fi
fi
