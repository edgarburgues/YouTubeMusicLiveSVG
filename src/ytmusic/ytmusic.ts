import axios from "axios";
import { logger } from "../utils/logger";

const YTM_DOMAIN = "https://music.youtube.com";
const YTM_BASE_API = `${YTM_DOMAIN}/youtubei/v1/`;
const YTM_PARAMS = "?alt=json";
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0";

if (!process.env.BROWSER_JSON) {
  throw new Error("BROWSER_JSON environment variable not set. Please set it in the environment variables.");
}

const browserJson = JSON.parse(process.env.BROWSER_JSON);

function initializeHeaders() {
  const headers: {
    "user-agent": string;
    accept: string;
    "accept-encoding": string;
    "content-type": string;
    "content-encoding": string;
    origin: string;
    authorization?: string;
    cookie: string;
  } = {
    "user-agent": browserJson["user-agent"] || USER_AGENT,
    accept: browserJson["accept"] || "*/*",
    "accept-encoding": browserJson["accept-encoding"] || "gzip, deflate",
    "content-type": browserJson["content-type"] || "application/json",
    "content-encoding": browserJson["content-encoding"] || "gzip",
    origin: browserJson["origin"] || YTM_DOMAIN,
    cookie: browserJson["cookie"] || "",
  };

  const sapisid = browserJson["cookie"]
    .split("; ")
    .find((cookie: string) => cookie.startsWith("__Secure-3PAPISID="))
    ?.split("=")[1];

  if (!sapisid) {
    throw new Error("Missing __Secure-3PAPISID in cookies. Ensure BROWSER_JSON contains valid cookies.");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const hash = require("crypto").createHash("sha1").update(`${timestamp} ${sapisid} ${YTM_DOMAIN}`).digest("hex");
  headers.authorization = `SAPISIDHASH ${timestamp}_${hash}`;

  return headers;
}

function initializeContext() {
  return {
    context: {
      client: {
        clientName: "WEB_REMIX",
        clientVersion: `1.${new Date().toISOString().slice(0, 10).replace(/-/g, "")}.01.00`,
      },
    },
  };
}

async function getVisitorId() {
  const response = await axios.get(YTM_DOMAIN);
  const matches = response.data.match(/ytcfg\.set\s*\(\s*({.+?})\s*\)\s*;/);
  let visitor_id = "";
  if (matches) {
    const ytcfg = JSON.parse(matches[1]);
    visitor_id = ytcfg.VISITOR_DATA;
  }
  return { "X-Goog-Visitor-Id": visitor_id };
}

class YTMusic {
  private context: any;
  private headers: any;

  constructor() {
    logger.debug("YTMusic initialized.");
    this.context = initializeContext();
    this.headers = initializeHeaders();
  }

  async sendRequest(endpoint: string, body: any, additionalParams: string = "") {
    body = { ...body, ...this.context };
    if (!("X-Goog-Visitor-Id" in this.headers)) {
      const visitorId = await getVisitorId();
      this.headers = { ...this.headers, ...visitorId };
    }

    try {
      logger.debug(`Request: POST ${endpoint}`);
      const response = await axios.post(`${YTM_BASE_API}${endpoint}${YTM_PARAMS}${additionalParams}`, body, {
        headers: this.headers,
      });
      logger.debug(`Response: ${endpoint} - Status ${response.status}`);
      return response.data;
    } catch (error: any) {
      const message = error.response ? `HTTP ${error.response.status}: ${error.response.statusText}` : `Error: ${error.message}`;
      logger.error(`Request failed: ${endpoint} - ${message}`);
      throw new Error(message);
    }
  }

  async getHistory() {
    const endpoint = "browse";
    const body = { browseId: "FEmusic_history" };

    logger.debug(`Fetching history...`);
    try {
      const response = await this.sendRequest(endpoint, body);

      const results = this.nav(response, [
        "contents",
        "singleColumnBrowseResultsRenderer",
        "tabs",
        "0",
        "tabRenderer",
        "content",
        "sectionListRenderer",
        "contents",
      ]);

      const items = results[0].musicShelfRenderer.contents;
      logger.debug(`Fetched ${items.length} items from history.`);

      return items.map((item: any) => {
        const thumbnail = item.musicResponsiveListItemRenderer.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails.reduce(
          (max: any, current: any) => (current.width * current.height > max.width * max.height ? current : max)
        ).url;

        const song = item.musicResponsiveListItemRenderer.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;
        const author = item.musicResponsiveListItemRenderer.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;

        return { thumbnail, song, author };
      });
    } catch (error: any) {
      logger.error(`Error fetching history: ${error.message}`);
      throw new Error(`Failed to fetch history: ${error.message}`);
    }
  }

  nav(root: any, path: string[]) {
    try {
      for (let key of path) {
        if (root[key] === undefined) {
          throw new Error(`Key '${key}' not found`);
        }
        root = root[key];
      }
    } catch (e: any) {
      throw new Error(`Navigation error: ${e.message}`);
    }
    return root;
  }
}

export { YTMusic };
