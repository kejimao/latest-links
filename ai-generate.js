const fs = require("fs");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// 读取 input.txt
let input = fs.readFileSync("input.txt", "utf-8")
    .split("\n")
    .map(i => i.trim())
    .filter(Boolean);

// 读取 posts.json
let posts = [];
if (fs.existsSync("posts.json")) {
    posts = JSON.parse(fs.readFileSync("posts.json", "utf-8"));
}

const exists = (url) => posts.some(p => p.url === url);

// 抓取 meta
async function fetchMeta(url) {
    try {
        console.log("fetching:", url);

        const res = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const html = await res.text();

        let title = html.match(/<title>(.*?)<\/title>/i)?.[1] || "无标题";

        let desc =
            html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i)?.[1] ||
            title;

        return { title, desc };

    } catch (e) {
        console.log("ERROR fetching:", url, e.message);

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

async function run() {
    console.log("input count:", input.length);

    for (let url of input) {
        if (exists(url)) {
            console.log("skip duplicate:", url);
            continue;
        }

        const meta = await fetchMeta(url);

        posts.unshift({
            title: meta.title,
            desc: meta.desc,
            url: url,
            category: getCategory(url)
        });

        console.log("added:", meta.title);
    }

    fs.writeFileSync("posts.json", JSON.stringify(posts, null, 2));

    console.log("DONE posts:", posts.length);
}

run();
