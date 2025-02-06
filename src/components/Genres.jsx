import React from 'react';

const Genres = ({ genres, selectedGenre, setSelectedGenre }) => {
  return (
    <select
      value={selectedGenre}
      onChange={(e) => setSelectedGenre(e.target.value)}
      className="selectable"
    >
      <option value="">Select Genre</option>
      {genres.map((genre) => (
        <option key={genre.id} value={genre.id}>
          {genre.name}
        </option>
      ))}
    </select>
  );
};

export default Genres;