const About = () => (
  <div className="mx-auto max-w-4xl px-4 py-16">
    <h1 className="mb-4 text-4xl font-bold">About Serandip Prime</h1>
    <p className="mb-8 text-lg text-muted-foreground">
      Serandip Prime brings premium movies and series together in a crafted streaming experience that is fast,
      immersive, and focused on what you actually want to watch.
    </p>
    <div className="grid gap-4 sm:grid-cols-3">
      {[
        { t: "4K HDR Quality", d: "The sharpest picture, deep blacks, and richer color." },
        { t: "Massive Library", d: "Thousands of titles across genres and decades." },
        { t: "Watch Anywhere", d: "Stream on web or download for later." },
      ].map((c) => (
        <div key={c.t} className="public-glass-card rounded-2xl p-5">
          <h3 className="mb-1 font-semibold text-primary">{c.t}</h3>
          <p className="text-sm text-muted-foreground">{c.d}</p>
        </div>
      ))}
    </div>
  </div>
);

export default About;
