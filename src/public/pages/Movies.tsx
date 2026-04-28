import { MOVIES } from "../data/movies";
import { MediaListPage } from "../components/MediaListPage";

const Movies = () => (
  <MediaListPage title="Movie Library" subtitle="Browse our extensive collection of movies" items={MOVIES} />
);

export default Movies;
