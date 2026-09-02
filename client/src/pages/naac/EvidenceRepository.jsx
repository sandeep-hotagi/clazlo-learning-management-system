import React, { useState, useEffect } from "react";
import axios from "axios";
import { Folder, Upload, Search, Download, Trash2, Calendar, FileText, Activity, AlertTriangle } from "lucide-react";

export default function EvidenceRepository() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search/Filters states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");

  // Upload Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Governance");
  const [department, setDepartment] = useState("IQAC");
  const [academicYear, setAcademicYear] = useState("2025-26");
  const [fileUrl, setFileUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // Selected document audit trails state
  const [activeDocForAudit, setActiveDocForAudit] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.get(`${API_URL}/naac/documents`, config);
      setDocuments(res.data);
    } catch (err) {
      console.warn("Failed to load evidence documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadAuditLogs = async (docId) => {
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.get(`${API_URL}/naac/documents/${docId}/audit-trail`, config);
      setAuditLogs(res.data);
    } catch (err) {
      console.warn("Failed to load document audit logs:", err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });
      setFileUrl(res.data.fileUrl);
      alert("File uploaded to server successfully! Complete the metadata form to save.");
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveDocument = async (e) => {
    e.preventDefault();
    if (!title || !fileUrl) {
      alert("Please upload a file and enter a title.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const res = await axios.post(`${API_URL}/naac/documents`, {
        title,
        category,
        department,
        academicYear,
        fileUrl,
        version: 1
      }, config);

      // Log audit
      await axios.post(`${API_URL}/naac/documents/${res.data._id}/audit-trail`, { actionType: "Upload" }, config);

      setTitle("");
      setFileUrl("");
      loadDocuments();
      alert("Evidence document saved to repository.");
    } catch (err) {
      alert("Failed to save: " + err.message);
    }
  };

  const handleDownload = async (docId, fileUrl) => {
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.post(`${API_URL}/naac/documents/${docId}/audit-trail`, { actionType: "Download" }, config);
      window.open(fileUrl, "_blank");
    } catch (err) {
      console.warn("Failed to record audit for download event:", err);
      window.open(fileUrl, "_blank");
    }
  };

  const handleDeleteDocument = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document from the repository?")) return;
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.delete(`${API_URL}/naac/documents/${id}`, config);
      loadDocuments();
    } catch (err) {
      alert("Action failed: " + err.message);
    }
  };

  // Filter logic
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || doc.category === categoryFilter;
    const matchesDept = deptFilter === "All" || doc.department === deptFilter;

    return matchesSearch && matchesCategory && matchesDept;
  });

  return (
    <div className="p-6 sm:p-10 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Folder className="text-blue-600" /> Compliance Evidence Repository
        </h1>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Version Control, Revision History & Audit Trails</p>
      </div>

      {/* Directory splitting layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Control Panel: Upload or Audit Log display */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-lg">Upload Revision</h3>
            <form onSubmit={handleSaveDocument} className="space-y-4">
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest pl-1">Document Title</label>
                <input 
                  type="text" 
                  required 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. FDP Certificates Roster" 
                  className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest pl-1">Compliance Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none cursor-pointer"
                >
                  <option value="Governance">Governance (CHARTERS)</option>
                  <option value="IQAC">IQAC (RECORDS)</option>
                  <option value="Academics">Academics (CO-PO)</option>
                  <option value="Faculty">Faculty (FDPS)</option>
                  <option value="Students">Students (SUPPORT)</option>
                  <option value="Research">Research (MOUS)</option>
                  <option value="Infrastructure">Infrastructure (SAFTEY)</option>
                </select>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col items-center justify-center space-y-2">
                <Upload className="text-slate-400" size={24} />
                <label className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">
                  <span>{uploading ? "Uploading file..." : fileUrl ? "File Uploaded ✅" : "Select File"}</span>
                  <input type="file" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-1.5">
                Save Evidence File
              </button>
            </form>
          </div>

          {/* Auto-renewal / expiry warnings container */}
          <div className="bg-amber-500/10 border border-amber-500/35 p-5 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="text-amber-500 shrink-0" size={18} />
            <div>
              <h4 className="font-bold text-amber-800 dark:text-amber-450 text-xs uppercase">Compliance Auto-Renewal Warnings</h4>
              <p className="text-[11px] text-amber-700 dark:text-amber-350 mt-1">
                Land and building occupancy compliance documents category are due for administrative inspection within 90 days.
              </p>
            </div>
          </div>
        </div>

        {/* Directory browser list */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters Bar */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-450" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Full text search title..." 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none"
              />
            </div>

            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Governance">Governance</option>
              <option value="IQAC">IQAC</option>
              <option value="Academics">Academics</option>
              <option value="Faculty">Faculty</option>
              <option value="Students">Students</option>
              <option value="Research">Research</option>
              <option value="Infrastructure">Infrastructure</option>
            </select>

            <select 
              value={deptFilter} 
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs outline-none cursor-pointer"
            >
              <option value="All">All Departments</option>
              <option value="IQAC">IQAC</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Basic Sciences">Basic Sciences</option>
              <option value="Administration">Administration</option>
            </select>
          </div>

          {/* List display */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-lg">Revision Files ({filteredDocs.length})</h3>
            
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : (
              <div className="space-y-3 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                {filteredDocs.map((doc) => (
                  <div key={doc._id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <FileText className="text-indigo-500" size={24} />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs">{doc.title}</h4>
                            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-[8px] font-black px-1.5 py-0.5 rounded">v{doc.version || 1}</span>
                          </div>
                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">
                            {doc.category} | Dept: {doc.department} | Year: {doc.academicYear}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleDownload(doc._id, doc.fileUrl)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                        >
                          <Download size={14} /> Download
                        </button>
                        <button 
                          onClick={() => {
                            setActiveDocForAudit(doc);
                            loadAuditLogs(doc._id);
                          }}
                          className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                          title="Audit logs"
                        >
                          <Activity size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteDocument(doc._id)}
                          className="text-rose-500 p-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Audit Logs list inline */}
                    {activeDocForAudit?._id === doc._id && (
                      <div className="mt-3 p-3 bg-slate-100 dark:bg-slate-900 rounded-lg space-y-2 border border-slate-200 dark:border-slate-800 text-[10px]">
                        <h5 className="font-bold uppercase text-slate-400">File Access Audit Log:</h5>
                        {auditLogs.map((log, lIdx) => (
                          <div key={lIdx} className="flex justify-between text-slate-500">
                            <span>{log.performedBy?.name} ({log.performedBy?.role}) - Action: {log.actionType}</span>
                            <span>{new Date(log.actionTimestamp).toLocaleString()}</span>
                          </div>
                        ))}
                        {auditLogs.length === 0 && <p className="text-[9px] text-slate-400">No activity logged.</p>}
                        <button 
                          onClick={() => setActiveDocForAudit(null)} 
                          className="text-[9px] text-indigo-500 hover:underline font-bold"
                        >
                          Collapse Audit List
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
