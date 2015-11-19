# spotify-csv-import

Import a CSV of songs into Spotify.

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone git@github.com:jahfer/spotify-csv-import.git
# Go into the repository
$ cd spotify-csv-import
# Install dependencies and run the app
$ npm install && npm start
# If you plan on making changes, open a new terminal and run gulp to compile code
$ gulp
```

Once the app is running, you’ll be prompted to select a CSV file. The app assumes the following:
- CSV starts with a header row that is ignored
- First column of the CSV is the track name
- Second column is the artist.

Output is available via the `Console` tab in the Dev Tools.

#### License [MIT](LICENSE.md)
