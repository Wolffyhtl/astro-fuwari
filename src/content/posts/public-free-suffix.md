---
title: PublicFreeSuffix域名申请教程
published: 2025-10-01
description: '本文详细介绍了如何通过GitHub免费申请PublicFreeSuffix域名的详细步骤'
ai: 本文详细介绍了如何通过GitHub免费申请PublicFreeSuffix域名的详细步骤
image: 'https://avatars.githubusercontent.com/u/213755762?v=4'
tags: [域名,日常]
category: '日常'
draft: false 
---
如题，此帖讲的是PublicFreeSuffix免费域名的申请教程.<br>
首先，打开他们的GitHub仓库地址：
`https://github.com/PublicFreeSuffix/PublicFreeSuffix`<br>
他们提供了`pfsdns.org`,`nastu.net`,`tun.re`,`6ti.net`和`no.kg`后缀的免费域名,都无法托管到Cloudflare.<br>
注册域名步骤：<br>
第一步，fork他们的GitHub仓库.<br>
第二步，打开你fork的仓库，在whois文件夹里新建一个json文件，文件名为`你想注册的域名.no.kg.json`.<br>
这里使用no.kg的域名后缀作为演示，如果想使用其他域名后缀，请把no.kg改为你想使用的域名后缀.<br>
json文件格式：
```json
{
  "registrant": "一个可以发邮件的邮箱",
  "domain": "域名名字",
  "sld": "域名后缀",
  "nameservers": [
    "NS服务器1",
    "NS服务器2",
    "NS服务器3",
    "NS服务器4"
  ],
  "agree_to_agreements": {
    "registration_and_use_agreement": true,
    "acceptable_use_policy": true,
    "privacy_policy": true
  }
}
```
第三步，在你fork的仓库里把这个提交创建为一个新分支，名字为`域名全称-request-1`.<br>
注意：第几次更改就填数字几<br>
第四步，向官方仓库发起一个拉取请求，标题为`Registration/Update/Remove: 域名名字.域名后缀`
内容这样填写：
```markdown
> All items should be completed and confirmed to trigger the automatic merge workflow.

## Operation Type
- [x] Registration, Register a new domain name.
- [ ] Update, Update NS information or registrant email for an existing domain.
- [ ] Remove, Cancel my domain name.

## Domain
- [x] 域名名字.域名后缀

## Confirmation Items
- [x] I confirm that I will deploy the website content for this domain name and put it into use within 30 days instead of hoarding and occupying resources.
- [x] I confirm that the title of this Pull Request and the submitted files are in the standard format; otherwise, it will not be processed automatically.
- [x] I confirmed that the name in the whois file meets the standards.
- [x] I confirm that the domain name is at least 3 characters.
- [x] I confirm that I have read and understood the [Acceptable Use Policy](https://github.com/PublicFreeSuffix/PublicFreeSuffix/blob/main/agreements/acceptable-use-policy.md).
- [x] I confirm that I have read and agree to the [Privacy Policy](https://github.com/PublicFreeSuffix/PublicFreeSuffix/blob/main/agreements/privacy-policy.md).
- [x] I confirm that I have read and agree to the [Registration And Use Agreement](https://github.com/PublicFreeSuffix/PublicFreeSuffix/blob/main/agreements/registration-and-use-agreement-sokg.md).
- [x] I confirm that the domain does not contain any reserved terms from the [Reserved Words List](https://github.com/PublicFreeSuffix/PublicFreeSuffix/blob/main/reserved_words.txt).
- [x] I confirm that I will complete the registrant's email verification according to [ARAE Instructions](https://github.com/PublicFreeSuffix/PublicFreeSuffix/blob/main/AUTHORIZATION.md) to complete the merger.
```
如果是更新或删除，就把代码中Registration前面中括号里的x放在Update/Remove前面的中括号里.<br>
第五步：当拉取请求状态为validation-passed后，用你刚才在json文件中填写的邮箱向 `pr-authorization@publicfreesuffix.org`发送一封邮件，标题为`APPROVE_PFS_PR_你的拉取请求ID`，内容随便写.<br>
第六步，到你的DNS提供商里添加域名.<br>
至此申请结束.
