import { buildEmbedTitle } from "./embedUtils";
import { resolveModuleUrl } from "./moduleRegistry";

type ModuleFrameProps = {
  module: string;
  height?: string;
};

export function ModuleFrame({ module, height = "70vh" }: ModuleFrameProps) {
  const src = resolveModuleUrl(module);
  const fills = height === "100%";

  return (
    <section
      className="card"
      style={{
        padding: 0,
        overflow: "hidden",
        height: fills ? "100%" : undefined,
        display: fills ? "flex" : undefined,
        flexDirection: fills ? "column" : undefined,
      }}
    >
      <iframe
        title={buildEmbedTitle(module)}
        src={src}
        style={{ border: 0, width: "100%", height, flex: fills ? "1 1 auto" : undefined }}
        loading="lazy"
      />
    </section>
  );
}
