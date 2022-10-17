import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

import { customRateLimit } from "../../../utils/redisRateLimit";

import { LoremIpsum } from "lorem-ipsum";

const lipsum = new LoremIpsum();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") return res.status(405).end();
  let content = "";
  const title = lipsum.generateParagraphs(1).slice(0, 80);
  const description = lipsum
    .generateParagraphs(Math.ceil(Math.random() * 3))
    .slice(0, 160);
  let tags =
    "#" + lipsum.generateParagraphs(1).replaceAll(" ", "#").slice(0, 70);
  const numtags = tags
    .split("#")
    .filter((tag: string) => tag.trim() !== "").length;
  if (numtags > 6) {
    tags =
      "#" +
      tags
        .split("#")
        .filter((tag: string) => tag.trim() !== "")
        .slice(0, 6)
        .join("#");
  }
  try {
    const res = await axios({
      method: "GET",
      url: "https://jaspervdj.be/lorem-markdownum/markdown.txt",
      headers: { "Content-type": "text/plain; charset=UTF-8" },
    });
    content = res.data;
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Couldn't get markdown content" });
  }
  return res.json({ title, description, tags, content });
};

export default customRateLimit(handler, {
  numReqs: 10,
  exp: 10,
  key: "editor-requests",
});
