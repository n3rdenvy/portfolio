import PageShell from '../components/PageShell';
import ReturnToHub from '../components/ReturnToHub';

export default function Contact() {
  return (
    <PageShell width="narrow">
      <ReturnToHub />
      <header className="glass rounded-2xl p-8 md:p-10">
        <h1 className="text-2xl font-semibold tracking-tight text-accent md:text-3xl">Contact</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-textSecondary">
          Reach out via the floating email control or add your preferred channels here.
        </p>
      </header>
    </PageShell>
  );
}
