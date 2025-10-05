import { useMemo } from "react";

type LearningItem = {
  id: number;
  title: string;
  currentStage: string;
  nextAction: string;
};

const sampleItems: LearningItem[] = [
  {
    id: 1,
    title: "Chord foundations",
    currentStage: "Comfortably switching between open chords",
    nextAction: "Learn and practice the common barre chord shapes",
  },
  {
    id: 2,
    title: "Strumming patterns",
    currentStage: "Can follow down-up patterns with a metronome",
    nextAction: "Add syncopated accents to 4/4 songs you like",
  },
  {
    id: 3,
    title: "Song library",
    currentStage: "Have 2 go-to songs for casual jams",
    nextAction: "Break down and learn the bridge of 'Wish You Were Here'",
  },
];

export function App(): JSX.Element {
  const totalItems = useMemo(() => sampleItems.length, []);

  return (
    <main className="app">
      <header className="hero">
        <h1>LearnIt</h1>
        <p className="tagline">Track skills, understand your progress, plan the next rep.</p>
      </header>

      <section className="overview">
        <h2>Learning snapshot</h2>
        <p>You have {totalItems} focus areas queued up. Here's a sample roadmap:</p>
        <ul className="learning-list">
          {sampleItems.map((item) => (
            <li key={item.id} className="learning-item">
              <h3>{item.title}</h3>
              <p className="current">Current focus: {item.currentStage}</p>
              <p className="next">Next up: {item.nextAction}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
