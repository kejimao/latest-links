const fs = require("fs");

// 读取 input.txt
let input = fs.readFileSync("input.txt", "utf-8")
    .split("\n")
    .map(i => i.trim())
    .filter(Boolean);

// 读取已有 posts.json
let posts = [];
if (fs.existsSync("posts.json")) {
    posts = JSON.parse(fs.readFileSync("posts.json", "utf-8"));
}

// 去重
const exists = (url) => posts.some(p => p.url === url);

// 🔥 抓网页真实 title / description
async function fetchMeta(url) {
    try {
        const res = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const html = await res.text();

        // title
        let title = html.match(/<title>(.*?)<\/title>/i)?.[1] || "无标题";

        // meta description
        let desc =
            html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i)?.[1] ||
            "";

        // 如果没有 desc，用 title 兜底
        if (!desc) desc = title;

        return { title, desc };

    } catch (e) {
        return {
            title: "无法获取标题",
            desc: "自动生成内容"
        };
    }
}

function getCategory(url) {
    if (url.includes("github.com") || url.includes("github.io")) {
        return "github";
    }
    return "external";
}

// 主逻辑
async function run() {
    for (let url of input) {
        if (exists(url)) continue;

        console.log("processing:", url);

        const meta = await fetchMeta(url);

        posts.unshift({
            title: meta.title,   // ✅ 真实网页标题
            desc: meta.desc,     // ✅ 真实描述
            url: url,
            category: getCategory(url)
        });
    }

    fs.writeFileSync("posts.json", JSON.stringify(posts, null, 2));

    console.log("done:", posts.length);
}

run();
