"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

type Profile = {
  id: string;
  name?: string | null;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
};

type Permission = {
  permission: string;
  name_ar: string;
  description_ar?: string | null;
  category: string;
  is_sensitive: boolean;
};

export default function AdminEmployeesPage() {
  const supabase = createClient();

  const [employees, setEmployees] = useState<Profile[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [granted, setGranted] = useState<string[]>([]);
  const [selected, setSelected] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    setMessage("");

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, name, full_name, email, phone, role")
      .eq("id", (await supabase.auth.getUser()).data.user?.id)
      .maybeSingle();

    if (!profile || !["admin", "super_admin"].includes(String(profile.role))) {
      setMessage("ليس لديك صلاحية الوصول إلى هذه الصفحة.");
      setLoading(false);
      return;
    }

    const { data: users } = await supabase
      .from("profiles")
      .select("id, name, full_name, email, phone, role")
      .eq("role", "employee")
      .order("name", { ascending: true });

    const { data: catalog } = await supabase
      .from("nolera_permission_catalog")
      .select("permission, name_ar, description_ar, category, is_sensitive")
      .order("category")
      .order("permission");

    setEmployees(users || []);
    setPermissions(catalog || []);
    setLoading(false);
  }

  async function selectEmployee(employee: Profile) {
    setSelected(employee);
    setMessage("");

    const { data } = await supabase
      .from("nolera_role_permissions")
      .select("permission")
      .eq("user_id", employee.id);

    setGranted((data || []).map((x: { permission: string }) => x.permission));
  }

  async function togglePermission(permission: string, enabled: boolean) {
    if (!selected) return;

    setSaving(true);
    setMessage("");

    if (enabled) {
      const { error } = await supabase
        .from("nolera_role_permissions")
        .insert({
          user_id: selected.id,
          permission,
          granted_by: (await supabase.auth.getUser()).data.user?.id,
        });

      if (error && !error.message.toLowerCase().includes("duplicate")) {
        setMessage(error.message);
        setSaving(false);
        return;
      }

      setGranted((prev) =>
        prev.includes(permission) ? prev : [...prev, permission]
      );
    } else {
      const { error } = await supabase
        .from("nolera_role_permissions")
        .delete()
        .eq("user_id", selected.id)
        .eq("permission", permission);

      if (error) {
        setMessage(error.message);
        setSaving(false);
        return;
      }

      setGranted((prev) => prev.filter((p) => p !== permission));
    }

    setSaving(false);
  }

  async function grantAll() {
    if (!selected) return;

    setSaving(true);
    setMessage("");

    const userId = (await supabase.auth.getUser()).data.user?.id;

    const rows = permissions.map((p) => ({
      user_id: selected.id,
      permission: p.permission,
      granted_by: userId,
    }));

    const { error } = await supabase
      .from("nolera_role_permissions")
      .upsert(rows, { onConflict: "user_id,permission" });

    if (error) {
      setMessage(error.message);
    } else {
      setGranted(permissions.map((p) => p.permission));
      setMessage("تم منح جميع الصلاحيات التشغيلية للموظف.");
    }

    setSaving(false);
  }

  async function revokeAll() {
    if (!selected) return;

    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("nolera_role_permissions")
      .delete()
      .eq("user_id", selected.id);

    if (error) {
      setMessage(error.message);
    } else {
      setGranted([]);
      setMessage("تم سحب جميع الصلاحيات التشغيلية.");
    }

    setSaving(false);
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <main dir="rtl" style={{ padding: 24 }}>
        جاري تحميل لوحة الموظفين...
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        padding: 20,
        background: "var(--background, #f7f7f8)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1>إدارة الموظفين والصلاحيات</h1>

        <p style={{ opacity: 0.7 }}>
          يمكن للإدارة منح الموظف الصلاحيات التشغيلية، بينما تظل سلطة
          Super Admin محمية بالكامل.
        </p>

        {message && (
          <div
            style={{
              padding: 12,
              margin: "16px 0",
              borderRadius: 12,
              background: "#eee",
            }}
          >
            {message}
          </div>
        )}

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: 16,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 18,
              padding: 16,
              border: "1px solid #ddd",
            }}
          >
            <h2>الموظفون</h2>

            {employees.length === 0 ? (
              <p>لا يوجد موظفون حالياً.</p>
            ) : (
              employees.map((employee) => (
                <button
                  key={employee.id}
                  onClick={() => selectEmployee(employee)}
                  style={{
                    width: "100%",
                    textAlign: "right",
                    padding: 14,
                    marginBottom: 8,
                    borderRadius: 12,
                    border:
                      selected?.id === employee.id
                        ? "2px solid #512d68"
                        : "1px solid #ddd",
                    background:
                      selected?.id === employee.id ? "#f1eafa" : "white",
                    cursor: "pointer",
                  }}
                >
                  <strong>
                    {employee.name ||
                      employee.full_name ||
                      employee.email ||
                      employee.phone ||
                      "موظف"}
                  </strong>
                  <br />
                  <small>{employee.email || employee.phone || ""}</small>
                </button>
              ))
            )}
          </div>

          <div
            style={{
              background: "white",
              borderRadius: 18,
              padding: 20,
              border: "1px solid #ddd",
            }}
          >
            {!selected ? (
              <div>
                <h2>اختر موظفاً</h2>
                <p>اختر موظفاً من القائمة لإدارة صلاحياته.</p>
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h2>
                      {selected.name ||
                        selected.full_name ||
                        selected.email ||
                        "الموظف"}
                    </h2>
                    <span>الدور: employee</span>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={grantAll}
                      disabled={saving}
                      style={{
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: 0,
                        cursor: "pointer",
                      }}
                    >
                      منح الكل
                    </button>

                    <button
                      onClick={revokeAll}
                      disabled={saving}
                      style={{
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: 0,
                        cursor: "pointer",
                      }}
                    >
                      سحب الكل
                    </button>
                  </div>
                </div>

                <hr style={{ margin: "20px 0" }} />

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: 12,
                  }}
                >
                  {permissions.map((permission) => {
                    const active = granted.includes(permission.permission);

                    return (
                      <label
                        key={permission.permission}
                        style={{
                          display: "block",
                          padding: 14,
                          borderRadius: 14,
                          border: active
                            ? "2px solid #512d68"
                            : "1px solid #ddd",
                          background: active ? "#f5eff9" : "white",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={active}
                          disabled={saving}
                          onChange={(e) =>
                            togglePermission(
                              permission.permission,
                              e.target.checked
                            )
                          }
                          style={{ marginLeft: 8 }}
                        />

                        <strong>{permission.name_ar}</strong>

                        <div
                          style={{
                            fontSize: 12,
                            opacity: 0.65,
                            marginTop: 5,
                          }}
                        >
                          {permission.description_ar}
                        </div>

                        <div
                          style={{
                            fontSize: 11,
                            opacity: 0.5,
                            marginTop: 5,
                            direction: "ltr",
                            textAlign: "right",
                          }}
                        >
                          {permission.permission}
                        </div>
                      </label>
                    );
                  })}
                </div>

                <div
                  style={{
                    marginTop: 20,
                    padding: 14,
                    borderRadius: 12,
                    background: "#fff7e6",
                  }}
                >
                  🔒 صلاحيات Super Admin وملكية النظام غير موجودة ضمن
                  الصلاحيات التي يستطيع Admin منحها للموظف.
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
