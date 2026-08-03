"use client";

export default function PrintContractButton() {
  return (
    <button
      type="button"
      className="rounded border border-neutral-300 bg-white px-3 py-1.5 hover:bg-neutral-50"
      onClick={() => window.print()}
    >
      Print / Save PDF
    </button>
  );
}
