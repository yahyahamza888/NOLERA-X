import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

const supabase = createSupabaseBrowserClient();

export type NoleraAIAgent = {
  id: string;
  name: string;
  name_ar: string | null;
  description: string | null;
  description_ar: string | null;
  category: string;
  module: string;
  icon: string | null;
  status: "active" | "paused" | "disabled";
  agent_type: "native" | "api" | "hybrid" | "external";
  capabilities: string[];
  commands: string[];
  settings: Record<string, unknown>;
  priority: number;
};

export type NoleraAIAgentAssignment = {
  id: string;
  agent_id: string;
  module: string;
  enabled: boolean;
  permissions: string[];
  settings: Record<string, unknown>;
};

export async function getAIAgents(
  module?: string,
): Promise<NoleraAIAgent[]> {
  let query = supabase
    .from("nolera_ai_agents")
    .select("*")
    .eq("status", "active")
    .order("priority", { ascending: true });

  if (module) {
    query = query.eq("module", module);
  }

  const { data, error } = await query;

  if (error) {
    console.error("NOLERA AI agents:", error);
    return [];
  }

  return (data ?? []) as NoleraAIAgent[];
}

export async function getAIAgentsForModule(
  module: string,
): Promise<NoleraAIAgent[]> {
  const { data, error } = await supabase
    .from("nolera_ai_agent_assignments")
    .select(`
      agent_id,
      module,
      enabled,
      nolera_ai_agents (*)
    `)
    .eq("module", module)
    .eq("enabled", true);

  if (error) {
    console.error("NOLERA AI module agents:", error);
    return [];
  }

  return (data ?? [])
    .map((row: any) => row.nolera_ai_agents)
    .filter(Boolean)
    .filter((agent: NoleraAIAgent) => agent.status === "active");
}

export async function sendAIAgentCommand({
  agentId,
  module,
  command,
  input = {},
}: {
  agentId: string;
  module: string;
  command: string;
  input?: Record<string, unknown>;
}) {
  const {
    data: {
      user,
    },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("يجب تسجيل الدخول أولاً.");
  }

  const { data, error } = await supabase
    .from("nolera_ai_agent_commands")
    .insert({
      agent_id: agentId,
      module,
      command,
      input,
      requested_by: user.id,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("NOLERA AI command:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function updateAIAgent(
  agentId: string,
  updates: Partial<NoleraAIAgent>,
) {
  const { data, error } = await supabase
    .from("nolera_ai_agents")
    .update(updates)
    .eq("id", agentId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as NoleraAIAgent;
}

export async function assignAIAgent(
  agentId: string,
  module: string,
  permissions: string[] = [],
) {
  const { data, error } = await supabase
    .from("nolera_ai_agent_assignments")
    .upsert(
      {
        agent_id: agentId,
        module,
        enabled: true,
        permissions,
      },
      {
        onConflict: "agent_id,module",
      },
    )
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function setAIAgentStatus(
  agentId: string,
  status: NoleraAIAgent["status"],
) {
  return updateAIAgent(agentId, { status });
}
