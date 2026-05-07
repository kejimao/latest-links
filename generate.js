const fs = require("fs");

// 1. 读取 input.txt
let input = [];
if (fs.existsSync("input.txt")) {
    input = fs.readFileSync("input.txt", "utf-8")
        .split("\n")
        .map(i => i.trim())
        .filter(Boolean);
}

// 2. 读取已有 posts.json
let posts = [];
if (fs.existsSync("posts.json")) {
    posts = JSON.parse(fs.readFileSync("posts.json", "utf-8"));
}

// 3. 去重（避免重复URL）
const exists = (url) => posts.some(p => p.url === url);

// 4. 转换 input → posts
input.forEach((url) => {
    if (!exists(url)) {
        posts.unshift({
            title: "新资源更新",
            desc: "自动整理生成的内容",
            url: url
        });
    }
});

// 5. 写回 posts.json
fs.writeFileSync("posts.json", JSON.stringify(posts, null, 2));

console.log("✅ posts.json updated, total:", posts.length);
