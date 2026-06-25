"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";

export function LiveClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return <div className="text-zinc-500 font-mono text-sm">--:--:--</div>;

  return (
    <div className="flex flex-col items-end">
      <div className="text-zinc-200 font-mono font-medium">
        {format(time, "HH:mm:ss")}
      </div>
      <div className="text-xs text-zinc-500">
        {format(time, "MMM dd, yyyy")}
      </div>
    </div>
  );
}
