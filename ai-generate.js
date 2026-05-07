const fs = require("fs");

console.log("START");

// 读取 input.txt
let input = [];

if (fs.existsSync("input.txt")) {
    input = fs.readFileSync("input.txt", "utf-8")
        .split("\n")
        .map(i => i.trim())
        .filter(Boolean);
}

// 读取 posts.json
let posts = [];

if (fs.existsSync("posts.json")) {
    try {
        posts = JSON.parse(fs.readFileSync("posts.json", "utf-8"));
    } catch (e) {
        console.log("posts.json parse error");
        posts = [];
    }
}

// 去重
let seen = new Set(posts.map(p => p.url));

function generateDesc(title) {
    return `${title}，最新资源与教程整理。`;
}

// 主循环
for (let line of input) {

    // 必须包含 |
    if (!line.includes("|")) {
        console.log("skip invalid line:", line);
        continue;
    }

    let parts = line.split("|");

    // 防止 undefined
    let title = parts[0] ? parts[0].trim() : "";
    let url = parts[1] ? parts[1].trim() : "";

    // 空值跳过
    if (!title || !url) {
        console.log("skip empty:", line);
        continue;
    }

    // 已存在
    if (seen.has(url)) {
        console.log("skip duplicate:", url);
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
