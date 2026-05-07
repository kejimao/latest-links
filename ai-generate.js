const fs = require("fs");

console.log("START");

// 读取 input
let input = fs.readFileSync("input.txt", "utf-8")
    .split("\n")
    .map(i => i.trim())
    .filter(Boolean);

// 读取旧数据（关键）
let posts = [];
if (fs.existsSync("posts.json")) {
    try {
        posts = JSON.parse(fs.readFileSync("posts.json", "utf-8"));
    } catch (e) {
        posts = [];
    }
}

// 去重集合
let seen = new Set(posts.map(p => p.url));

function generateDesc(title) {
    return `${title}，最新教程与资源整理。`;
}

// 合并逻辑（不会丢历史数据）
for (let line of input) {

    if (!line.includes("|")) continue;

    let parts = line.split("|");

    let title = parts[0]?.trim();
    let url = parts[1]?.trim();

    if (!title || !url) continue;

    if (seen.has(url)) continue;

    posts.unshift({
        title,
        desc: generateDesc(title),
        url,
        time: Date.now()
    });

    seen.add(url);
}

// 🔥 关键：限制长度（避免无限增长）
posts = posts.slice(0, 300);

// 写回
fs.writeFileSync("posts.json", JSON.stringify(posts, null, 2));

console.log("DONE:", posts.length);
