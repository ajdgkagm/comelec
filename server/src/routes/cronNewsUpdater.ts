// // cronNewsUpdater.ts
// import cron from "node-cron";
// import axios from "axios";
// import cheerio from "cheerio";
// import NewNews from "./models/NewNews.js";

// const COMELEC_URL = "https://comelec.gov.ph/?r=announcements";

// cron.schedule("*/30 * * * *", async () => {
//   try {
//     const { data } = await axios.get(COMELEC_URL);
//     const $ = cheerio.load(data);
//     const items: any[] = [];

//     $(".announcements-item").each((_, el) => {
//       const title = $(el).find("h3").text().trim();
//       const link = $(el).find("a").attr("href");
//       const dateText = $(el).find(".date").text().trim();
//       const createdAt = dateText ? new Date(dateText) : new Date();
//       if (title) items.push({ title, link, createdAt });
//     });

//     const posts = await Promise.all(items.map(async (item) => {
//       let content = "";
//       if (item.link) {
//         try {
//           const fullLink = item.link.startsWith("http") ? item.link : `https://comelec.gov.ph${item.link}`;
//           const resLink = await axios.get(fullLink);
//           const $$ = cheerio.load(resLink.data);
//           content = $$(".announcement-body").text().trim() || "";
//         } catch (err) {
//           console.error("Failed to fetch full content for", item.link);
//         }
//       }
//       return { ...item, content, author: "COMELEC" };
//     }));

//     for (const post of posts) {
//       const exists = await NewNews.findOne({ title: post.title });
//       if (!exists) await NewNews.create(post);
//     }

//     console.log(`COMELEC news updated at ${new Date().toLocaleTimeString()}`);
//   } catch (err) {
//     console.error("Failed to update COMELEC news:", err);
//   }
// });