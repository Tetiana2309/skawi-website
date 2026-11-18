import Hero from './sections/Hero.jsx';
import Preloader from './components/Preloader.jsx';

export default function App() {
  return (
    <>
      <Preloader />
      <main>
        <Hero />
      </main>
    </>
  );
}
