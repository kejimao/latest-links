const fs = require("fs");

console.log("START");

// 读取 input.txt
let input = fs.readFileSync("input.txt", "utf-8")
    .split("\n")
    .map(i => i.trim())
    .filter(Boolean);

// posts
let posts = [];
if (fs.existsSync("posts.json")) {
    posts = JSON.parse(fs.readFileSync("posts.json", "utf-8"));
}

let seen = new Set(posts.map(p => p.url));

function generateDesc(title) {
    return `${title}，最新教程与资源整理。`;
}

for (let line of input) {

    // 分割 标题 | 链接
    const parts = line.split("|");

    if (parts.length < 2) continue;

    const title = parts[0].trim();
    const url = parts[1].trim();

    if (seen.has(url)) {
        console.log("skip:", url);
        continue;
    }

    posts.unshift({
        title: title,
        desc: generateDesc(title),
        url: url,
        category: url.includes("github") || url.includes("github.io")
            ? "github"
            : "external"
    });

    seen.add(url);

    console.log("added:", title);
}

// 保存
fs.writeFileSync("posts.json", JSON.stringify(posts, null, 2));

console.log("DONE:", posts.length);
