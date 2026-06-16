"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ORDER_STATUSES } from "@/shared/lib/validators";

export function OrderFilters() {
  const router = useRouter();
  const params = useSearchParams();

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/admin/orders?${next.toString()}`);
  }

  return (
    <div className="card mb-4 grid gap-3 p-4 sm:grid-cols-4">
      <div>
        <label className="label" htmlFor="status">
          Status
        </label>
        <select
          id="status"
          className="input"
          defaultValue={params.get("status") ?? ""}
          onChange={(e) => setParam("status", e.target.value)}
        >
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="phone">
          Phone
        </label>
        <input
          id="phone"
          className="input"
          placeholder="Search phone"
          defaultValue={params.get("phone") ?? ""}
          onBlur={(e) => setParam("phone", e.target.value)}
        />
      </div>
      <div>
        <label className="label" htmlFor="from">
          From
        </label>
        <input
          id="from"
          type="date"
          className="input"
          defaultValue={params.get("from") ?? ""}
          onChange={(e) => setParam("from", e.target.value)}
        />
      </div>
      <div>
        <label className="label" htmlFor="to">
          To
        </label>
        <input
          id="to"
          type="date"
          className="input"
          defaultValue={params.get("to") ?? ""}
          onChange={(e) => setParam("to", e.target.value)}
        />
      </div>
    </div>
  );
}
