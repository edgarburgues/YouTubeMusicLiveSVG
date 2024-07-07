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
      <img src="https://youtubemusiclivesvg.azurewebsites.net/api/svg-vinyl" />
    </td>

  </tr>
</table>

1. **API Endpoints**:

   - `/api/history`: Retrieves the history of videos played on YouTube Music.
   - `/api/svg`: Generates an SVG visualization for the first video in the YouTube Music history.
   - `/api/svg-vertical`: Generates a vertical SVG visualization for the first video in the YouTube Music history.

2. **SVG Generation**:

   - Generates dynamic SVG content based on the video title, author, and thumbnail.
   - Utilizes dominant colors from the video's thumbnail to create a gradient background and animated bars.

3. **OAuth Integration**:
   - Utilizes OAuth for authenticating requests to YouTube Music.
   - Automatically refreshes the OAuth token when it expires.

## Deployment

### Local Deployment

To deploy the application locally, follow these steps:

1. **Clone the Repository**:

```
git clone https://github.com/edgarburgues/YouTubeMusicLiveSVG.git
cd YouTubeMusicLiveSVG
```

2. **Set Up Environment Variables**:
Create a `.env` file in the root directory with the following content:
```
OAUTH_JSON=<your_oauth_json_content>
```

3. **Install Dependencies**:
``` 
bun install 
```

4. **Run the Application**:
```
bun src/server.js
```

The application will be accessible at `http://localhost:3000`.

### Docker Deployment

To deploy the application using without building, follow these steps:

1. **Pull and Run the Docker Image from Docker Hub**:
```
docker pull edgarburgues/youtube-music-live-svg
docker run -p 3000:3000 -e OAUTH_JSON="<your_oauth_json_content>" edgarburgues/youtube-music-live-svg
```
The application will be accessible at `http://localhost:3000`.


## File Descriptions

- `.dockerignore`: Specifies files and directories to ignore when building the Docker image.
- `.gitignore`: Specifies files and directories to ignore in Git.
- `Dockerfile`: Docker configuration file to build the application image.
- `src/server.js`: Main server file that sets up the API endpoints and starts the Express server.
- `src/utils/svg_templates.js`: Contains functions to generate SVG content.
- `src/utils/utils.js`: Contains utility functions for fetching video history and processing images.
- `src/ytmusic/ytmusic.js`: Contains the YTMusic class for interacting with YouTube Music API.

## Notes

- Ensure that the `OAUTH_JSON` environment variable is set correctly, containing valid OAuth credentials.
- The application uses the `bun` package manager for Node.js. Make sure you have it installed before running the application.
- The SVG visualizations are dynamic and will change based on the video history retrieved from YouTube Music.























