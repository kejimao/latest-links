const fs = require("fs");

console.log("START");

// 1. 读取 input
let input = [];

if (fs.existsSync("input.txt")) {
    input = fs.readFileSync("input.txt", "utf-8")
        .split("\n")
        .map(i => i.trim())
        .filter(Boolean);
}

console.log("INPUT:", input.length);

// 2. 读取 posts.json
let posts = [];

if (fs.existsSync("posts.json")) {
    try {
        posts = JSON.parse(fs.readFileSync("posts.json", "utf-8"));
    } catch (e) {
        posts = [];
    }
}

// 3. 去重
let seen = new Set(posts.map(p => p.url));

// 4. 追加新数据
for (let line of input) {

    if (!line.includes("|")) continue;

    let [title, url] = line.split("|").map(i => i.trim());

    if (!title || !url) continue;
    if (seen.has(url)) continue;

    posts.unshift({
        title,
        desc: `${title}，最新资源与教程整理`,
        url,
        category: url.includes("github") ? "github" : "external",
        time: Date.now()
    });

    seen.add(url);
}

// 5. 限制长度（避免爆）
posts = posts.slice(0, 100);

// 6. 写 posts.json
fs.writeFileSync("posts.json", JSON.stringify(posts, null, 2));

// 7. 🔥 同步生成 README（关键）
let md = `# 🔥 最新资源合集（自动同步）\n\n`;

md += `> 自动生成系统，无需手动维护\n\n`;

for (let i = 0; i < posts.length; i++) {
    const p = posts[i];

    md += `## ${i + 1}. ${p.title}\n`;
    md += `- 📝 ${p.desc}\n`;
    md += `- 🔗 ${p.url}\n\n`;
}

fs.writeFileSync("README.md", md);

console.log("DONE POSTS:", posts.length);
console.log("README UPDATED");
