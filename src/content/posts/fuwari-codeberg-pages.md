---
title: 如何将你的Fuwari博客部署到Codeberg Pages
published: 2025-12-28
description: 本文介绍将Fuwari博客部署到Codeberg Pages的方法：先申请CI权限，再配置仓库工作流文件，实现代码推送后自动构建并发布至专属页面。
tags:
category: "'Examples\""
draft: "false"
---
Codeberg Pages 是 Codeberg 官方提供的一个静态网站托管平台，类似于 Github Pages.<br>
今天我们就要将Fuwari博客部署到Codeberg Pages.<br>
首先，在[这里](https://codeberg.org/Codeberg-e.V./requests/issues)提起一个 Issue，标签选择 `ci` ，`Expected Resource Usage` 选 `medium`，`I would also like the following users to be added` 填 `@自己的 Codeberg 用户名`，其他自己看着填，等待审批通过。<br>
审批通过后，打开你在Codeberg上的Fuwari仓库，在仓库根目录新建`.forgejo/workflows`文件夹.<br>
在文件夹中添加 `astro.yml` 文件，内容如下：
```md
name: Deploy Astro site to Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches:
      # If you want to build from a different branch, change it here.
      - main
  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

jobs:
  build:
    # You can find the list of available runners on https://codeberg.org/actions/meta, or run one yourself.
    runs-on: codeberg-medium-lazy
    steps:
      - name: Clone the repository
        uses: https://code.forgejo.org/actions/checkout@v4
        with:
          submodules: recursive
          fetch-depth: 0
      - name: check .domains files
        run: |
          git ls-files public/.domains
          ls -la public/
          ls -la public/.domains || echo ".domains not found"
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10
      - name: Setup Node.js
        uses: https://code.forgejo.org/actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - name: Install dependencies
        run: |
          pnpm install
          pnpm install @astrojs/sitemap
      - name: Build Astro site
        run: pnpm run build

      - name: Upload generated files
        uses: https://code.forgejo.org/actions/upload-artifact@v3
        with:
          name: Generated files
          path: dist/
          include-hidden-files: true
      
  deploy:
    needs: [ build ]
    runs-on: codeberg-tiny-lazy
    steps:
      - name: Clone the repository
        uses: https://code.forgejo.org/actions/checkout@v4
        with:
          submodules: recursive
          fetch-depth: 0

      - name: Checkout the target branch and clean it up
        run: |
          git checkout pages || git switch --orphan pages
          rm -Rfv $(ls -A | egrep -v '^(\.git|LICENSE)$')

      - name: Download generated files
        uses: https://code.forgejo.org/actions/download-artifact@v3
        with:
          name: Generated files

      - name: Publish the website
        run: |
          git config user.email codeberg-ci
          git config user.name "Codeberg CI"
          echo "=== Files being committed ==="
          ls -la
          git add .
          git commit --allow-empty --message "Codeberg build for ${GITHUB_SHA}"
          git push origin pages
```
<br>
然后，就可以愉快的在Codeberg Pages上部署Fuwari博客了！