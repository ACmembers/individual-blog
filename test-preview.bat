@echo off
REM 本地预览测试脚本 - 用于部署前检测构建结果
REM 使用方法: test-preview.bat

echo ========================================
echo  Blog Butterfly - 本地预览测试
echo ========================================
echo.

set PATH=C:\Program Files\nodejs;%APPDATA%\pnpm;%PATH%

echo [1/4] 检查依赖...
if not exist "node_modules\astro" (
    echo 依赖未安装，正在安装...
    call pnpm install --no-frozen-lockfile || exit /b 1
)

echo [2/4] 构建项目...
call pnpm run build || (
    echo [错误] 构建失败，请检查控制台输出
    exit /b 1
)

echo [3/4] 启动本地预览服务器...
echo 服务器地址: http://localhost:4321/individual-blog/
echo 按 Ctrl+C 停止服务器
echo.

start http://localhost:4321/individual-blog/
call npx -y serve dist -l 4321

echo [4/4] 测试完成
pause
