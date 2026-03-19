import { useState } from "react";

import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { apiFetch } from "#/lib/api";
import { formatHour } from "#/lib/format";

interface Props {
  courtId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const VALID_HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

const BlockSlotModal = ({ courtId, onClose, onSuccess }: Props) => {
  const [date, setDate] = useState("");
  const [hour, setHour] = useState(7);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBlock = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiFetch(`/api/dashboard/courts/${courtId}/block`, {
        body: JSON.stringify({ date, hour, reason: reason || undefined }),
        method: "POST",
      });
      onSuccess();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to block slot");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold">Block a Time Slot</h2>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="block-date">Date</Label>
            <Input
              id="block-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="block-hour">Hour</Label>
            <select
              id="block-hour"
              value={hour}
              onChange={(e) => setHour(Number(e.target.value))}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            >
              {VALID_HOURS.map((h) => (
                <option key={h} value={h}>
                  {formatHour(h)}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="block-reason">Reason (optional)</Label>
            <Input
              id="block-reason"
              placeholder="Maintenance, private event…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <div className="mt-6 flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleBlock} disabled={loading || !date}>
            {loading ? "Blocking…" : "Block Slot"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlockSlotModal;
