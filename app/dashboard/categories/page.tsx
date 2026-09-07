"use client";

import { useState, useTransition, useEffect } from "react";
import { Layers, Plus, Edit2, Trash2, Search, CheckCircle, AlertCircle, X, Loader2, RefreshCw, ToggleLeft, ToggleRight } from "lucide-react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/actions/dashboard.actions";

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  isActive: boolean;
  articleCount: number;
  sortOrder: number;
  createdAt: Date;
};

const COLOR_PRESETS = [
  "#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#0ea5e9", "#ec4899", "#14b8a6", "#f97316", "#84cc16",
];

export default function CategoriesDashboardPage() {
  const [cats, setCats] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formColor, setFormColor] = useState("#6366f1");
  const [formIcon, setFormIcon] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const loadCats = () => {
    startTransition(async () => {
      const data = await getCategories();
      setCats(data as Category[]);
    });
  };

  useEffect(() => { loadCats(); }, []);

  // Auto-generate slug from name
  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingCat) {
      setFormSlug(val.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").trim());
    }
  };

  const openCreate = () => {
    setEditingCat(null);
    setFormName(""); setFormSlug(""); setFormDesc(""); setFormColor("#6366f1"); setFormIcon("");
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCat(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDesc(cat.description ?? "");
    setFormColor(cat.color ?? "#6366f1");
    setFormIcon(cat.icon ?? "");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      let result;
      if (editingCat) {
        result = await updateCategory(editingCat.id, {
          name: formName,
          description: formDesc,
          color: formColor,
          icon: formIcon,
          isActive: editingCat.isActive,
        });
      } else {
        result = await createCategory({
          name: formName,
          slug: formSlug,
          description: formDesc,
          color: formColor,
          icon: formIcon,
        });
      }
      if (result.success) {
        showToast("success", editingCat ? `"${formName}" updated.` : `"${formName}" created successfully.`);
        setShowModal(false);
        loadCats();
      } else {
        showToast("error", result.error ?? "Operation failed.");
      }
    });
  };

  const handleToggleActive = (cat: Category) => {
    startTransition(async () => {
      const result = await updateCategory(cat.id, {
        name: cat.name,
        description: cat.description ?? "",
        color: cat.color ?? "",
        icon: cat.icon ?? "",
        isActive: !cat.isActive,
      });
      if (result.success) {
        setCats(prev => prev.map(c => c.id === cat.id ? { ...c, isActive: !c.isActive } : c));
      } else {
        showToast("error", result.error ?? "Failed to toggle status.");
      }
    });
  };

  const handleDelete = (cat: Category) => {
    startTransition(async () => {
      const result = await deleteCategory(cat.id);
      if (result.success) {
        showToast("success", `"${cat.name}" deleted.`);
        setCats(prev => prev.filter(c => c.id !== cat.id));
      } else {
        showToast("error", result.error ?? "Failed to delete.");
      }
    });
  };

  const filtered = cats.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-page-container space-y-6">
      {toast && (
        <div className={`dashboard-toast ${toast.type === "error" ? "dashboard-text-error" : ""}`}>
          {toast.type === "success" ? <CheckCircle className="dashboard-icon dashboard-text-success" /> : <AlertCircle className="dashboard-icon dashboard-text-error" />}
          <span>{toast.msg}</span>
        </div>
      )}

      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">
            <Layers className="dashboard-page-icon" /> Category Taxonomy
          </h1>
          <p className="dashboard-page-subtitle">
            Manage article categories, slugs, and visibility. Categories with articles cannot be deleted.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadCats} disabled={isPending} className="btn btn-ghost" title="Refresh">
            <RefreshCw className={isPending ? "dashboard-spinner" : "dashboard-icon"} />
          </button>
          <button onClick={openCreate} className="btn btn-primary dashboard-primary-btn shrink-0">
            <Plus className="dashboard-icon" /> Add Category
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {[
          { label: "Total", count: cats.length },
          { label: "Active", count: cats.filter(c => c.isActive).length },
          { label: "Inactive", count: cats.filter(c => !c.isActive).length },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: "0.875rem 1.25rem", minWidth: 100 }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-text-primary)" }}>{s.count}</div>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-toolbar">
        <div className="dashboard-search-wrap max-w-sm w-full">
          <Search className="dashboard-search-icon" />
          <input
            id="category-search-input" type="text" value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search categories or slug…"
            className="input dashboard-search-input"
          />
        </div>
      </div>

      <div className="dashboard-card card">
        <div className="dashboard-table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th className="th-title">Category</th>
                <th className="th-cat">Slug</th>
                <th className="th-views">Articles</th>
                <th className="th-status">Status</th>
                <th className="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isPending && cats.length === 0 ? (
                <tr><td colSpan={5} className="td-empty"><Loader2 className="dashboard-spinner inline mr-2" />Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="td-empty">
                  {cats.length === 0 ? "No categories yet. Create your first one." : "No categories match your search."}
                </td></tr>
              ) : filtered.map(cat => (
                <tr key={cat.id} className="dashboard-table-row">
                  <td className="td-title">
                    <div className="flex items-center gap-3">
                      <span className="dashboard-color-dot" style={{ backgroundColor: cat.color ?? "#6366f1" }} />
                      <div>
                        <span>{cat.name}</span>
                        {cat.description && (
                          <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.15rem" }}>
                            {cat.description.slice(0, 60)}{cat.description.length > 60 ? "…" : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="td-cat">/{cat.slug}</td>
                  <td className="td-views">{cat.articleCount}</td>
                  <td className="td-status">
                    <button
                      onClick={() => handleToggleActive(cat)}
                      disabled={isPending}
                      title={cat.isActive ? "Click to deactivate" : "Click to activate"}
                      style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem" }}
                    >
                      {cat.isActive
                        ? <><ToggleRight className="w-5 h-5" style={{ color: "#10b981" }} /><span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 600 }}>Active</span></>
                        : <><ToggleLeft className="w-5 h-5" style={{ color: "#6b7280" }} /><span style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: 600 }}>Inactive</span></>
                      }
                    </button>
                  </td>
                  <td className="td-actions">
                    <div className="dashboard-action-group">
                      <button onClick={() => openEdit(cat)} className="dashboard-action-btn dashboard-action-btn--edit" title="Edit">
                        <Edit2 className="dashboard-icon" />
                      </button>
                      <button onClick={() => handleDelete(cat)} disabled={isPending} className="dashboard-action-btn dashboard-action-btn--delete" title="Delete">
                        <Trash2 className="dashboard-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-card card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingCat ? "Edit Category" : "Create New Category"}</h3>
              <button onClick={() => setShowModal(false)} className="modal-close-btn"><X className="dashboard-icon-md" /></button>
            </div>
            <form onSubmit={handleSubmit} className="dashboard-form-fields">
              <div>
                <label className="dashboard-label">Category Name *</label>
                <input type="text" value={formName} onChange={e => handleNameChange(e.target.value)}
                  placeholder="e.g. Artificial Intelligence" required className="input" />
              </div>
              {!editingCat && (
                <div>
                  <label className="dashboard-label">URL Slug *</label>
                  <input type="text" value={formSlug} onChange={e => setFormSlug(e.target.value)}
                    placeholder="e.g. ai" required className="input input--mono" />
                </div>
              )}
              <div>
                <label className="dashboard-label">Description</label>
                <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} rows={2}
                  placeholder="Short description…" className="input" style={{ resize: "vertical" }} />
              </div>
              <div>
                <label className="dashboard-label">Color</label>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {COLOR_PRESETS.map(c => (
                    <button key={c} type="button" onClick={() => setFormColor(c)}
                      style={{
                        width: 28, height: 28, borderRadius: "50%", backgroundColor: c, border: "none", cursor: "pointer",
                        outline: formColor === c ? `3px solid ${c}` : "none", outlineOffset: 2,
                      }}
                    />
                  ))}
                  <input type="color" value={formColor} onChange={e => setFormColor(e.target.value)}
                    style={{ width: 28, height: 28, borderRadius: "50%", border: "none", cursor: "pointer", padding: 0 }} />
                </div>
              </div>
              <div className="dashboard-modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost text-sm">Cancel</button>
                <button type="submit" disabled={isPending} className="btn btn-primary text-sm">
                  {isPending ? <><Loader2 className="dashboard-spinner dashboard-spinner--sm" /> Saving…</> : (editingCat ? "Save Changes" : "Create Category")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
