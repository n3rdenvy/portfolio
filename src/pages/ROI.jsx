import PageShell from '../components/PageShell';
import ReturnToHub from '../components/ReturnToHub';

export default function ROI() {
  return (
    <PageShell width="narrow">
      <ReturnToHub />
      <article className="glass rounded-2xl p-8 md:p-12">
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
          National ROI Framework
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-white md:text-xl">
          Unifying 4 siloed teams and 7 technical tools into a single national media standard
        </p>
        <div className="mt-10 space-y-6 text-[15px] leading-[1.75] text-white md:text-base">
          <p>
            The program moved production from isolated local vignettes—each team shipping its own codecs,
            color pipelines, and review rituals—toward one national media spine. Shared ingest, shared QC
            language, and shared release criteria replaced redundant tooling and compressed cycle time
            without sacrificing brand fidelity in regional markets.
          </p>
          <p>
            A multimodal training suite anchored the transition: text, audio, and motion assets were
            labeled and validated in the same environment engineers used for deployment. That single
            surface let the four teams rehearse handoffs, retire seven overlapping utilities, and measure
            ROI as throughput plus defect reduction rather than headcount alone.
          </p>
        </div>
      </article>
    </PageShell>
  );
}
