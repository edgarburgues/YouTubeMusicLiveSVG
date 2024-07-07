import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import { logger } from "../utils/logger";

const YTM_DOMAIN = "https://music.youtube.com";
const YTM_BASE_API = `${YTM_DOMAIN}/youtubei/v1/`;
const YTM_PARAMS = "?alt=json";
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0";

const OAUTH_CLIENT_ID = "861556708454-d6dlm3lh05idd8npek18k6be8ba3oc68.apps.googleusercontent.com";
const OAUTH_CLIENT_SECRET = "SboVhoG9s0rNafixCSGGKXAT";

if (!process.env.OAUTH_JSON) {
  throw new Error("OAUTH_JSON environment variable not set. Please set it in the environment variables.");
}

const oauthJson = JSON.parse(process.env.OAUTH_JSON);

function initializeHeaders(auth: string) {
  const headers: {
    "user-agent": string;
    accept: string;
    "accept-encoding": string;
    "content-type": string;
    "content-encoding": string;
    origin: string;
    authorization?: string; // Add the 'authorization' property
  } = {
    "user-agent": USER_AGENT,
    accept: "*/*",
    "accept-encoding": "gzip, deflate",
    "content-type": "application/json",
    "content-encoding": "gzip",
    origin: YTM_DOMAIN,
  };
  if (auth) {
    headers.authorization = `Bearer ${auth}`;
  }
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
  private auth: string;
  private refreshToken: string;
  private oauth2Client: OAuth2Client;
  private context: any;
  private headers: any;

  constructor() {
    logger.debug("Initializing YTMusic...");
    this.auth = oauthJson.access_token;
    this.refreshToken = oauthJson.refresh_token;

    this.oauth2Client = new OAuth2Client(OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET);
    this.oauth2Client.setCredentials({
      access_token: this.auth,
      refresh_token: this.refreshToken,
    });

    this.context = initializeContext();
    this.headers = initializeHeaders(this.auth);
  }

  async refreshAccessToken() {
    logger.debug("Refreshing access token...");
    try {
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      this.auth = credentials.access_token as string;

      // Update environment variables with the new token
      process.env.OAUTH_ACCESS_TOKEN = credentials.access_token ?? "";

      // Update headers with the new token
      this.headers = initializeHeaders(this.auth);
      logger.debug("Access token refreshed successfully.");
    } catch (error: any) {
      logger.error("Error refreshing access token:", error.message);
      throw new Error("Failed to refresh access token.");
    }
  }

  async sendRequest(endpoint: string, body: any, additionalParams: string = "") {
    body = { ...body, ...this.context };
    if (!("X-Goog-Visitor-Id" in this.headers)) {
      const visitorId = await getVisitorId();
      this.headers = { ...this.headers, ...visitorId };
    }

    try {
      logger.debug(`Sending request to endpoint: ${endpoint}`);
      const response = await axios.post(`${YTM_BASE_API}${endpoint}${YTM_PARAMS}${additionalParams}`, body, {
        headers: this.headers,
      });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        // If the error is 401 (Unauthorized), attempt to refresh the token and retry the request
        logger.warn("Access token expired, attempting to refresh...");
        await this.refreshAccessToken();
        // Retry the request with the new token
        try {
          const response = await axios.post(`${YTM_BASE_API}${endpoint}${YTM_PARAMS}${additionalParams}`, body, {
            headers: this.headers,
          });
          return response.data;
        } catch (retryError: any) {
          const message = retryError.response
            ? `Server returned HTTP ${retryError.response.status}: ${retryError.response.statusText}.`
            : `Error sending request after refreshing token: ${retryError.message}`;
          logger.error(message);
          throw new Error(message);
        }
      } else {
        const message = error.response
          ? `Server returned HTTP ${error.response.status}: ${error.response.statusText}.`
          : `Error sending request: ${error.message}`;
        logger.error(message);
        throw new Error(message);
      }
    }
  }

  async getHistory() {
    const endpoint = "browse";
    const body = { browseId: "FEmusic_history" };
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
    return items.map((item: any) => {
      const thumbnail = item.musicResponsiveListItemRenderer.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails.reduce(
        (max: any, current: any) => {
          return current.width * current.height > max.width * max.height ? current : max;
        }
      ).url;

      const song = item.musicResponsiveListItemRenderer.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;
      const author = item.musicResponsiveListItemRenderer.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;

      return { thumbnail, song, author };
    });
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
      let key;
      throw new Error(`Unable to find '${key}' using path ${JSON.stringify(path)} on ${JSON.stringify(root)}, exception: ${e.message}`);
    }
    return root;
  }
}

export { YTMusic };
