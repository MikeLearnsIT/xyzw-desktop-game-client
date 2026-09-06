# XYZW 独立游戏客户端

这是一个可独立发布的 Electron 桌面游戏客户端。它不依赖任何上层 Vue、Token 管理或自动化项目；完整游戏网页和资源已包含在本仓库的 `game/` 目录中。

## 本地运行

```powershell
npm install
npm start
```

## 打包

```powershell
# Windows：NSIS 安装包和免安装版 EXE
npm run dist:win

# macOS：DMG 和 ZIP
npm run dist:mac
```

产物写入 `release/`。

## 上传到 GitHub

当前目录就是完整项目根目录，可直接单独初始化并推送：

```powershell
git init
git add .
git commit -m "Initial standalone game client"
git branch -M main
git remote add origin <你的 GitHub 仓库地址>
git push -u origin main
```

在 GitHub Actions 页面手动运行工作流会生成 Windows/macOS 构建产物供下载。推送版本标签会额外自动创建 GitHub Release 并上传全部安装文件：

```powershell
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions 需要仓库的 **Settings → Actions → General → Workflow permissions** 设置为 **Read and write permissions**，以便工作流创建 Release。

## 分发说明

- 游戏仍须联网访问其官方接口和远程资源。
- Windows 产物可在 Windows 上构建；macOS 正式发布应在 macOS CI/机器上构建、签名并公证，否则用户会看到系统安全提示。
- 如需品牌图标，可在 `build` 配置中增加 `icon`，并提供 Windows `.ico` 与 macOS `.icns`。
