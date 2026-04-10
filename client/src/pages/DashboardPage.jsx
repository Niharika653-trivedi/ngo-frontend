import { useCallback, useEffect, useMemo, useState } from "react";
import { FaBook, FaCalendarAlt, FaChartBar, FaDonate, FaMoon, FaSearch, FaSignOutAlt, FaUsers, FaVolumeUp } from "react-icons/fa";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart } from "recharts";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useVoiceAccessibility } from "../hooks/useVoiceAccessibility";

const menu = ["Dashboard", "Students", "Donors", "Events", "Courses", "Analytics", "Settings"];
const endpoints = { Students: "students", Donors: "donors", Events: "events", Courses: "courses" };
const formConfigs = {
  Students: [
    { key: "name", type: "text" },
    { key: "contact", type: "text" },
    { key: "dateOfBirth", type: "date" },
    { key: "disabilityType", type: "text" },
    { key: "courseEnrolled", type: "text" },
    { key: "enrollmentDate", type: "date" },
    { key: "progress", type: "number" },
  ],
  Donors: [
    { key: "donorName", type: "text" },
    { key: "contactInfo", type: "text" },
    { key: "donationAmount", type: "number" },
    { key: "date", type: "date" },
    { key: "relatedActivity", type: "text" },
  ],
  Events: [
    { key: "eventName", type: "text" },
    { key: "description", type: "text" },
    { key: "objectives", type: "text" },
    { key: "participants", type: "number" },
    { key: "outcomes", type: "text" },
    { key: "date", type: "date" },
  ],
  Courses: [
    { key: "title", type: "text" },
    { key: "description", type: "text" },
    { key: "durationWeeks", type: "number" },
    { key: "participants", type: "number" },
  ],
};

const DashboardPage = () => {
  const { logout } = useAuth();
  const [active, setActive] = useState("Dashboard");
  const [stats, setStats] = useState({ cards: {} });
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [requestError, setRequestError] = useState("");
  const [requestSuccess, setRequestSuccess] = useState("");
  const voice = useVoiceAccessibility();

  const fetchStats = useCallback(async () => {
    const response = await api.get("/dashboard/stats");
    setStats(response.data);
  }, []);

  useEffect(() => {
    fetchStats().catch(() => {});
    voice.speak("Welcome to the NGO CRM dashboard");
  }, [fetchStats]);

  useEffect(() => {
    const timer = setInterval(() => {
      fetchStats().catch(() => {});
    }, 10000);
    return () => clearInterval(timer);
  }, [fetchStats]);

  useEffect(() => {
    setRequestError("");
    setRequestSuccess("");
    if (endpoints[active]) {
      api
        .get(`/${endpoints[active]}`)
        .then((r) => setItems(r.data))
        .catch((err) => setRequestError(err?.response?.data?.message || "Could not fetch records."));
    }
  }, [active]);

  const saveItem = async () => {
    if (!endpoints[active]) return;
    setRequestError("");
    setRequestSuccess("");
    try {
      if (form._id) await api.put(`/${endpoints[active]}/${form._id}`, form);
      else await api.post(`/${endpoints[active]}`, form);
      setForm({});
      const { data } = await api.get(`/${endpoints[active]}`);
      setItems(data);
      await fetchStats();
      setRequestSuccess(`${active.slice(0, -1)} saved successfully.`);
    } catch (err) {
      setRequestError(err?.response?.data?.message || "Save failed. Fill all required fields.");
    }
  };
  const handleDelete = async (id) => {
    try {
      setRequestError("");
      setRequestSuccess("");
      await api.delete(`/${endpoints[active]}/${id}`);
      setItems((v) => v.filter((x) => x._id !== id));
      await fetchStats();
      setRequestSuccess(`${active.slice(0, -1)} deleted successfully.`);
    } catch (err) {
      setRequestError(err?.response?.data?.message || "Delete failed.");
    }
  };

  const onEdit = (item) => {
    const updated = { ...item };
    (formConfigs[active] || []).forEach((field) => {
      if (field.type === "date" && updated[field.key]) {
        updated[field.key] = new Date(updated[field.key]).toISOString().slice(0, 10);
      }
    });
    setForm(updated);
  };


  const chartData = useMemo(
    () => [
      { month: "Jan", students: 20, donations: 1500, events: 2 },
      { month: "Feb", students: 26, donations: 2100, events: 4 },
      { month: "Mar", students: 35, donations: 2400, events: 3 },
      { month: "Apr", students: 42, donations: 3100, events: 5 },
      { month: "May", students: 56, donations: 4300, events: 7 },
      { month: "Jun", students: 63, donations: 5000, events: 6 },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-[#edf2ec] p-4">
      <div className="grid grid-cols-12 gap-4">
        <aside className="col-span-2 rounded-2xl bg-[#f5f7f4] p-4 shadow">
          <h2 className="mb-6 text-lg font-bold">Humanist Curator</h2>
          {menu.map((m) => (
            <button key={m} className={`mb-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left ${active === m ? "bg-ngo-100 text-ngo-900" : "hover:bg-white"}`} onMouseEnter={() => voice.speak(m)} onClick={() => setActive(m)}>
              <FaChartBar /> {m}
            </button>
          ))}
          <button className="mt-8 flex w-full items-center gap-2 rounded-lg bg-white px-3 py-2" onClick={() => { logout(); window.location.href = "/"; }}>
            <FaSignOutAlt /> Logout
          </button>
        </aside>
        <main className="col-span-10 space-y-4">
          <header className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow">
            <div className="flex flex-1 items-center gap-2 rounded-xl border px-3 py-2"><FaSearch /><input className="w-full outline-none" placeholder="Search..." aria-label="Search dashboard" /></div>
            <button onClick={() => voice.setHighContrast(!voice.highContrast)} aria-label="Toggle high contrast"><FaMoon /></button>
            <button onClick={() => voice.setFontScale((v) => Math.min(130, v + 10))} aria-label="Increase font size">A+</button>
            <button onClick={() => voice.startListening()} aria-label="Speech to text command">{voice.listening ? "Listening..." : "Voice Cmd"}</button>
            <button onClick={() => voice.setVoiceEnabled(!voice.voiceEnabled)} aria-label="Toggle text to speech"><FaVolumeUp /></button>
          </header>

          <section className="grid grid-cols-4 gap-3">
            {[{ k: "totalStudents", t: "Total Students", i: <FaUsers /> }, { k: "totalDonations", t: "Total Donations", i: <FaDonate /> }, { k: "activeCourses", t: "Active Courses", i: <FaBook /> }, { k: "eventsConducted", t: "Events Conducted", i: <FaCalendarAlt /> }].map((c) => (
              <article key={c.k} className="rounded-2xl bg-white p-4 shadow" onMouseEnter={() => voice.speak(`${c.t} ${stats.cards[c.k] || 0}`)}>
                <div className="flex items-center justify-between"><p className="text-sm text-gray-500">{c.t}</p>{c.i}</div>
                <h3 className="mt-2 text-2xl font-bold">{stats.cards[c.k] || 0}</h3>
              </article>
            ))}
          </section>

          <section className="grid grid-cols-3 gap-4">
            <div className="col-span-2 rounded-2xl bg-white p-4 shadow">
              <h3 className="mb-2 font-semibold">Impact Metrics</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend /><Bar dataKey="students" fill="#2f6d42" /><Bar dataKey="events" fill="#86b38f" /></BarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow">
              <h3 className="mb-2 font-semibold">Donation Trends</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line dataKey="donations" stroke="#1f5030" strokeWidth={2} /></LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          {endpoints[active] && (
            <section className="rounded-2xl bg-white p-4 shadow">
              <h3 className="mb-3 text-lg font-semibold">{active} Management</h3>
              {requestError && <p className="mb-3 rounded bg-red-100 p-2 text-sm text-red-700">{requestError}</p>}
              {requestSuccess && <p className="mb-3 rounded bg-green-100 p-2 text-sm text-green-700">{requestSuccess}</p>}
              <div className="mb-3 grid grid-cols-3 gap-2">
                {(formConfigs[active] || []).map((field) => (
                  <input
                    key={field.key}
                    type={field.type}
                    className="rounded border p-2"
                    placeholder={field.key}
                    value={form[field.key] || ""}
                    onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                    aria-label={field.key}
                  />
                ))}
              </div>
              <button className="mb-4 rounded bg-ngo-700 px-4 py-2 text-white" onClick={saveItem}>{form._id ? "Update" : "Add"} {active.slice(0, -1)}</button>
              <div className="overflow-auto">
                <table className="w-full text-left text-sm">
                  <thead><tr>{items[0] && Object.keys(items[0]).filter((k) => !["_id", "__v", "createdAt", "updatedAt"].includes(k)).map((k) => <th key={k} className="border-b p-2">{k}</th>)}<th className="border-b p-2">Actions</th></tr></thead>
                  <tbody>{items.map((item) => <tr key={item._id}>{Object.keys(item).filter((k) => !["_id", "__v", "createdAt", "updatedAt"].includes(k)).map((k) => <td key={k} className="border-b p-2">{String(item[k])}</td>)}<td className="border-b p-2"><button className="mr-2 text-blue-700" onClick={() => onEdit(item)}>Edit</button><button className="text-red-700" onClick={() => handleDelete(item._id)}>Delete</button></td></tr>)}</tbody>
                </table>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
