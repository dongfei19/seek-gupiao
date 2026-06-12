@echo off
echo ================================
echo 智能选股系统启动脚本
echo ================================

echo.
echo [1/3] 正在安装前端依赖...
cd frontend
call npm install
cd ..

echo.
echo [2/3] 正在安装后端依赖...
cd api
call npm install
cd ..

echo.
echo [3/3] 正在创建数据目录...
if not exist "api\data" mkdir "api\data"

echo.
echo ================================
echo 安装完成！
echo ================================
echo.
echo 启动方式：
echo.
echo 方式一：使用快捷脚本
echo   - 双击运行 dev.bat 启动开发模式
echo.
echo 方式二：手动启动
echo   1. 打开第一个终端，运行: cd api ^&^& npm start
echo   2. 打开第二个终端，运行: cd frontend ^&^& npm run dev
echo.
echo 访问地址：http://localhost:5173
echo.
pause
