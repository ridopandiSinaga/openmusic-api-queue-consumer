const { Pool } = require('pg');

class PlaylistsServices {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistSong(playlistId) {
    const query = {
      text: 'SELECT id, name FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    let result = await this._pool.query(query);

    const playlist = result.rows[0];

    const querySong = {
      text: `SELECT C.id, C.title, C.performer 
        FROM playlists A 
        JOIN playlist_songs B ON b.playlist_id = A.id
        JOIN songs C ON C.id = B.song_id 
        WHERE A.id = $1`,
      values: [playlistId],
    };

    result = await this._pool.query(querySong);

    playlist.songs = result.rows;

    return playlist;
  }
}

module.exports = PlaylistsServices;
