import SpotifyWebAPI from 'spotify-web-api-js';
import Q from 'q';

const SPOTIFY_AUTHORIZATION_URL = 'accounts.spotify.com/authorize';
const API_CLIENT_ID = '38354db516d84e70944e1a5533e6ca37';

export default class SpotifyAPI {
  constructor() {
    const hash_data = window.location.hash.slice(1);
    if (hash_data) {
      const data_as_arr = hash_data.split('&').map(kv => kv.split('='))
      this.credentials = new Map(data_as_arr);

      if (this.credentials.has('error')) {
        alert('Failed to authenticate with Spotify');
      } else {
        this._api = new SpotifyWebAPI();
        this._api.setPromiseImplementation(Q);
        this._api.setAccessToken(this.credentials.get('access_token'));
      }
    } else {
      this.authorize();
    }
  }

  createState() {
    const random_data = Math.random().toString().slice(2);
    localStorage.setItem('state', random_data);
    return random_data;
  }

  authorize() {
    const query_string = `response_type=token&client_id=${API_CLIENT_ID}&redirect_uri=http://localhost:3000/&state=${this.createState()}&scope=playlist-modify-private`;
    const url_string = `https://${SPOTIFY_AUTHORIZATION_URL}?${query_string}`;
    document.location = url_string;
  }

  searchTracks() {
    return this._api.searchTracks.apply(this._api, arguments);
  }

  getMe() {
    return this._api.getMe.apply(this._api, arguments);
  }

  createPlaylist() {
    return this._api.createPlaylist.apply(this._api, arguments);
  }

  addTracksToPlaylist() {
    return this._api.addTracksToPlaylist.apply(this._api, arguments);
  }
}
