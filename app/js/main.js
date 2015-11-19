import SpotifyAPI from './SpotifyAPI';
import EventQueue from './EventQueue';
import Papa from './vendor/papaparse.min';
import {chunk, partial} from 'lodash';
import Q from 'q';

const spotify = new SpotifyAPI();

document.addEventListener('DOMContentLoaded', function() {
  let formInput = document.getElementById('csv-upload');
  formInput.addEventListener('change', handleFiles, false);
  function handleFiles(files) {
    parseCSVInput(this.files[0]);
  }
});

function parseCSVInput(csv) {
  Papa.parse(csv, {
    complete: function(response) {
      let queue = new EventQueue(searchTrackFromRow);
      let pending_tracks = response.data.slice(1).map(track => queue.append(track));
      queue.begin();

      Q.allSettled(pending_tracks)
        .then(function(results) {
          return results
            .filter(p => p.state === 'fulfilled' && p.value)
            .map(p => p.value)
        })
        .then(saveTracks)
    }
  })
}

function searchTrackFromRow(row) {
  return spotify
    .searchTracks(`track:"${row[0]}" artist:"${row[1]}"`, {market: 'CA', limit: 1})
    .then(data => {
      const raw_track = data.tracks.items[0];
      if (raw_track) {
        const track_data = {
          id: raw_track.id,
          song: raw_track.name,
          artist: raw_track.artists[0].name,
          album: raw_track.album.name,
          image: raw_track.album.images[0].url
        };

        return track_data;
      }
    })
    .catch(err => console.error("ERROR!", err));
}

function saveTracks(tracks) {
  return spotify.getMe().then(createPlaylistWithTracks(tracks));
}

function createPlaylistWithTracks(tracks) {
  console.log("Creating playlist...")
  const track_uris = tracks.map(track => `spotify:track:${track.id}`)

  return function createPlaylist(data) {
    const user_id = data.id;

    spotify
      .createPlaylist(user_id, {name: 'Imported via CSV', public: false})
      .then(data => {
        let playlist_id = data.id;
        let addTracks = partial(spotify.addTracksToPlaylist, user_id, playlist_id).bind(spotify);
        let queue = new EventQueue(addTracks, 500);

        let chunked_uris = chunk(track_uris, 75);
        let pending_playlist_adds = chunked_uris.map(queue.append.bind(queue));
        queue.begin();

        Q.allSettled(pending_playlist_adds)
          .then(data => alert('Complete!'));
      })
  };
}
