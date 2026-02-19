import { UniBridgeDashboard } from "@/components/unibridge-dashboard";

export default function AiToolsPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-10">
        <h1 className="text-3xl font-medium tracking-tighter text-white">Neural Terminal</h1>
        <p className="mt-2 text-sm text-neutral-400 font-light">
          Access all autonomous UniBridge protocols — summarization, moderation, translation, and neural matching.
        </p>
      </div>
      <UniBridgeDashboard />
    </div>
  );
}
