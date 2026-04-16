import { buildEmbedTitle } from "./embedUtils";
import { resolveModuleUrl } from "./moduleRegistry";

type ModuleFrameProps = {
  module: string;
  height?: string;
};

export function ModuleFrame({ module, height = "70vh" }: ModuleFrameProps) {
  const src = resolveModuleUrl(module);

  return (
    <section className="card" style={{ padding: 0, overflow: "hidden" }}>
      <iframe
        title={buildEmbedTitle(module)}
        src={src}
        style={{ border: 0, width: "100%", height }}
        loading="lazy"
      />
    </section>
  );
}
