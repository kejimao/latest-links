const fs = require("fs");

console.log("START");

// 1. 读取 input
let input = fs.readFileSync("input.txt", "utf-8")
    .split("\n")
    .map(i => i.trim())
    .filter(Boolean);

// 2. 读取旧 posts（关键）
let posts = [];
if (fs.existsSync("posts.json")) {
    try {
        posts = JSON.parse(fs.readFileSync("posts.json", "utf-8"));
    } catch (e) {
        posts = [];
    }
}

// 3. 去重集合
let seen = new Set(posts.map(p => p.url));

// 4. 处理 input（只增不删）
for (let line of input) {

    if (!line.includes("|")) continue;

    let [title, url] = line.split("|").map(i => i.trim());

    if (!title || !url) continue;

    if (seen.has(url)) continue;

    posts.unshift({
        title,
        desc: `${title}，最新资源与教程整理。`,
        url,
        category: url.includes("github") ? "github" : "external",
        time: Date.now()
    });

    seen.add(url);
}

// 5. 🔥 不要覆盖全部，只追加
fs.writeFileSync("posts.json", JSON.stringify(posts, null, 2));

console.log("DONE:", posts.length);
