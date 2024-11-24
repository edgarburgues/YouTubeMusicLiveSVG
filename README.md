# YouTube Music Live SVG

This project provides a Bun.js application that serves SVG visualizations based on YouTube Music history. The application offers the following main functionalities:

<table align="center">
  <tr>
    <td colspan="" align="center">
      <strong>/svg</strong>
    </td>
  </tr>
  <tr>
    <td>
      <img src="https://youtubemusiclivesvg.azurewebsites.net/api/svg" />
    </td>
  </tr>
</table>

## 1. API Endpoints

- `/api/history`: Retrieves the history of videos played on YouTube Music.
- `/api/svg`: Generates an SVG visualization for the first video in the YouTube Music history.
- `/api/svg-vertical`: Generates a vertical SVG visualization for the first video in the YouTube Music history.
- `/api/svg-vinyl`: Generates a rotating vinyl SVG visualization for the first video in the YouTube Music history.

## 2. SVG Generation

- Generates dynamic SVG content based on the video title, author, and thumbnail.
- Utilizes dominant colors from the video's thumbnail to create a gradient background and animated bars.

## 3. Credential Configuration (browser.json)

The application uses **browser.json** as an environment variable (`BROWSER_JSON`) instead of OAuth to authenticate requests to the YouTube Music API. To obtain `browser.json`, follow these steps:

### Generating `browser.json` with `ytmusicapi`

1. Install `ytmusicapi` by following the instructions in its [official repository](https://ytmusicapi.readthedocs.io/).
2. Create a virtual environment to manage the installation:

   ```bash
   python -m venv ymusicapi-browser
   source ymusicapi-browser/bin/activate # On Windows use ymusicapi-browser\Scripts\activate
   pip install ytmusicapi
   ```

3. Generate `browser.json` by running the following and following the instructions:

   ```bash
   python -m ytmusicapi setup
   ```

4. Copy the content of the generated `browser.json` file and set it as the `BROWSER_JSON` environment variable before running the application.

## 4. Deployment

### Local Deployment

To deploy the application locally:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/edgarburgues/YouTubeMusicLiveSVG.git
   cd YouTubeMusicLiveSVG
   ```

2. **Set Up Environment Variables**:  
   Create a `.env` file in the project's root directory with the following content:

   ```env
   BROWSER_JSON=<your_browser_json_content>
   ```

3. **Install Dependencies**:

   ```bash
   bun install
   ```

4. **Run the Application**:  
   The application will be accessible at `http://localhost:3000`.

   ```bash
   bun run start
   ```

### Docker Deployment

To deploy using Docker:

1. **Pull and Run the Docker Image from Docker Hub**:

   ```bash
   docker pull edgarburgues/youtube-music-live-svg
   docker run -p 3000:3000 -e BROWSER_JSON="<your_browser_json_content>" edgarburgues/youtube-music-live-svg
   ```

2. The application will be accessible at `http://localhost:3000`.

## 5. File Descriptions

- `.dockerignore`: Specifies files and directories to ignore when building the Docker image.
- `.gitignore`: Specifies files and directories to ignore in Git.
- `Dockerfile`: Docker configuration file to build the application image.
- `src/controllers/ytmusic.controller.ts`: Contains the controller logic for handling API requests related to YouTube Music.
- `src/middlewares/error.middleware.ts`: Contains the middleware for handling errors.
- `src/routes/ytmusic.router.ts`: Defines the API routes for the application.
- `src/utils/cacheHeaders.ts`: Contains a utility function to set cache headers.
- `src/utils/logger.ts`: Configures the logger used for logging messages.
- `src/utils/svg_templates.ts`: Contains functions to generate SVG content.
- `src/utils/utils.ts`: Contains utility functions for fetching video history and processing images.
- `src/ytmusic/ytmusic.ts`: Contains the YTMusic class for interacting with YouTube Music API.
