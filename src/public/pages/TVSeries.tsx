import { SERIES } from "../data/movies";
import { MediaListPage } from "../components/MediaListPage";

const TVSeries = () => (
  <MediaListPage title="TV Series" subtitle="Discover binge-worthy series across every genre" items={SERIES} />
);

export default TVSeries;
