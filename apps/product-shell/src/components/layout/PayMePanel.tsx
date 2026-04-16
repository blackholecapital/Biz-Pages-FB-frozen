import { usePayMeCart } from "../../state/paymeCartState";
import { ModuleFrame } from "../integrations/ModuleFrame";

export function PayMePanel() {
  const { open, hide } = usePayMeCart();

  return (
    <aside
      className={"paymeSidePanel" + (open ? " paymeSidePanelOpen" : "")}
      aria-hidden={!open}
      role="dialog"
      aria-label="PayMe"
    >
      <div className="paymeSidePanelHeader">
        <div className="paymeSidePanelTitle">PayMe</div>
        <button
          type="button"
          className="paymeSidePanelClose"
          onClick={hide}
          aria-label="Close PayMe panel"
        >
          ×
        </button>
      </div>
      <div className="paymeSidePanelBody">
        <ModuleFrame module="payme" height="100%" />
      </div>
    </aside>
  );
}
