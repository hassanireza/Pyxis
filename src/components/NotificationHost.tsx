import { useNotebookStore } from "../store/notebookStore";
import { AlertIcon, CheckIcon, InfoIcon } from "./icons";

const icons = { info: InfoIcon, success: CheckIcon, error: AlertIcon };

export function NotificationHost() {
  const notifications = useNotebookStore((s) => s.notifications);
  const dismiss = useNotebookStore((s) => s.dismissNotification);

  if (!notifications.length) return null;

  return (
    <div className="toast-stack">
      {notifications.map((n) => {
        const Icon = icons[n.tone];
        return (
          <div key={n.id} className={`toast toast-${n.tone}`} onClick={() => dismiss(n.id)}>
            <Icon width={15} height={15} />
            <span>{n.message}</span>
          </div>
        );
      })}
    </div>
  );
}
