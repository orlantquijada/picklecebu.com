import { toast } from "sonner";

export function copyCurrentUrl(description: string) {
  navigator.clipboard.writeText(window.location.href);
  toast("Link copied!", { description });
}
