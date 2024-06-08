# YouTubeMusicLiveSVG

YouTubeMusicLiveSVG is a Node.js application designed to interact with YouTube Music and generate dynamic SVG graphics based on the user's playback history. These graphics can be included in a GitHub README to always show the last song played.

## Features

- **Playback History Retrieval**: Connects to YouTube Music to retrieve and display playback history.
- **SVG Visual Generation**: Creates dynamic SVG graphics with song information and animated bars.

## API Endpoints

### `/api/history`

Returns the user's playback history in JSON format.

#### Example Request

```sh
GET /api/history
```
