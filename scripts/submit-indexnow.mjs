import { readFileSync } from 'fs';
import { join } from 'path';

function getIndexNowConfig() {
  const key = process.env.INDEXNOW_KEY;
  const host = process.env.INDEXNOW_HOST;
  const keyLocation = process.env.INDEXNOW_KEY_LOCATION || (host && key ? `https://${host}/${key}.txt` : undefined);

  if (!key || !host) {
    console.error('❌ 缺少 IndexNow 配置，请设置环境变量 INDEXNOW_KEY 与 INDEXNOW_HOST');
    process.exit(1);
  }

  return { key, host, keyLocation };
}

async function submitToIndexNow() {
  try {
    // 读取构建后的 sitemap
    const sitemapPath = join(process.cwd(), 'dist', 'sitemap-0.xml');
    const sitemapContent = readFileSync(sitemapPath, 'utf-8');

    // 从 sitemap 中提取 URL
    const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);
    const urls = urlMatches ? urlMatches.map(match => match.replace(/<\/?loc>/g, '')) : [];

    if (urls.length === 0) {
      console.error('❌ 未找到要提交的 URL');
      process.exit(1);
    }

    console.log(`📋 准备提交 ${urls.length} 个 URL 到 IndexNow`);

    // IndexNow 官方配置（通过环境变量提供）
    const { key, host, keyLocation } = getIndexNowConfig();

    const payload = {
      host,
      key,
      keyLocation,
      urlList: urls
    };

    // 提交到 IndexNow 官方 API
    try {
      console.log('🔄 提交到 api.indexnow.org');

      const response = await fetch('https://api.indexnow.org/IndexNow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'User-Agent': 'Micostar-Blog-IndexNow/1.0'
        },
        body: JSON.stringify(payload)
      });

      // IndexNow API 通常返回空响应体
      let responseBody = '';
      try {
        responseBody = await response.text();
      } catch (e) {
        // 忽略读取响应体的错误，这是正常的
      }

      if (response.ok) {
        console.log(`✅ IndexNow 提交成功: HTTP ${response.status} ${response.statusText}`);
        console.log(`📄 共提交了 ${urls.length} 个 URL`);

        if (responseBody) {
          console.log(`📋 响应内容: ${responseBody}`);
        } else {
          console.log('📋 无响应内容 (这是正常的)');
        }
      } else {
        console.error(`❌ IndexNow 提交失败: HTTP ${response.status} ${response.statusText}`);
        if (responseBody) {
          console.error(`错误详情: ${responseBody}`);
        }
        process.exit(1);
      }

    } catch (error) {
      console.error(`❌ IndexNow 提交出错: ${error.message}`);
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ 脚本执行失败:', error.message);
    process.exit(1);
  }
}

submitToIndexNow();