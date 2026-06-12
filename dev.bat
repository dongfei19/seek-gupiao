@echo off
echo ================================
echo 智能选股系统 - 开发模式
echo ================================

echo.
echo 启动后端服务 (端口 3001)...
start "API服务" cmd /k "cd %~dp0api && npm start"

echo.
echo 启动前端服务 (端口 5173)...
start "前端服务" cmd /k "cd %~dp0frontend && npm run dev"

echo.
echo ================================
echo 服务已启动！
echo 后端API: http://localhost:3001
echo 前端界面: http://localhost:5173
echo ================================
echo.
pause
