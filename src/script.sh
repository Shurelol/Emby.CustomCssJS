#!/bin/bash

read -p "请输入 Emby 容器名称:" name

echo "Emby-css安装中..."

# 使用 docker exec 检查文件是否存在  
if docker exec "$name" test -f "/config/plugins/Emby.CustomCssJS.dll"; then  
    echo "插件已安装过，无需重复安装！"  
else  
    # 安装插件
    wget -q --no-check-certificate https://raw.githubusercontent.com/Shurelol/Emby.CustomCssJS/main/src/Emby.CustomCssJS.dll -O Emby.CustomCssJS.dll
    docker cp ./Emby.CustomCssJS.dll $name:/config/plugins/
    docker exec -it $name chmod 755 /config/plugins/Emby.CustomCssJS.dll
    echo "插件首次安装！"  
fi

# 下载所需文件到系统
wget -q --no-check-certificate https://raw.githubusercontent.com/Shurelol/Emby.CustomCssJS/main/src/CustomCssJS.js -O CustomCssJS.js  

# 从系统复制文件到容器内
docker cp ./CustomCssJS.js $name:/system/dashboard-ui/modules/

# 主安装程序
function Installing() {  
	# 读取文件内容    
	content=$(cat app.js)    
	# 定义要插入的代码，注意去掉逗号    
	code1='list.push("./modules/CustomCssJS.js")'    
	code2='Promise.all(list.map(loadPlugin))'      
	# 在Promise.all(list.map(loadPlugin))之前插入代码    
	new_content=$(echo -e "${content//$code2/$code1,$code2}")  
	# 将新内容写入app.js文件    
	echo -e "$new_content" > app.js
	# 读取文件内容    
	content=$(cat app.js)  
	# 使用tr命令删除换行符  
	no_newline_content=$(echo "$content" | tr -d '\n')  
	# 将处理后的内容写回app.js文件  
	echo -e "$no_newline_content" > app.js
	# 覆盖容器内取index.html文件
	docker cp ./app.js $name:/system/dashboard-ui/
}

# 先复制容器内的app.js到系统内
docker cp $name:/system/dashboard-ui/app.js ./

# 如果不包含替换内容
if ! grep -c "CustomCssJS.js" app.js; then  
    docker cp $name:/system/dashboard-ui/app.js ./
    # 备份
    docker exec -it  $name mkdir -p /system/dashboard-ui/bak/
    docker cp ./app.js $name:/system/dashboard-ui/bak/
    Installing
    echo "成功！Index.html 首次安装！"
else
    docker cp $name:/system/dashboard-ui/bak/app.js ./
    Installing
    echo "成功！Index.html 已重新修改！"
fi 
