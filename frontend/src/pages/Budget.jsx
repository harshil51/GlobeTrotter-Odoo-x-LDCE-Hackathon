import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, TrendingUp, PieChart } from 'lucide-react';
import {
  PieChart as RechartsPieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { tripsApi } from '../api/trips.api';
import { expensesApi } from '../api/expenses.api';
import { useToast } from '../context/ToastContext';
import { fmtMoney, fmtDate } from '../utils/format';
import Modal from '../components/common/Modal';
import Shell from '../components/layout/Shell';

const EXPENSE_CATEGORIES = ['TRANSPORT', 'ACCOMMODATION', 'FOOD', 'ACTIVITIES', 'SHOPPING', 'OTHER'];
const CATEGORY_COLORS = {
  TRANSPORT: '#2ba7a8',
  ACCOMMODATION: '#1c8a8e',
  FOOD: '#ff8a5c',
  ACTIVITIES: '#4fc0bd',
  SHOPPING: '#c98a1f',
  OTHER: '#8aa0a3',
};
const CATEGORY_EMOJI = {
  TRANSPORT: '✈️',
  ACCOMMODATION: '🏨',
  FOOD: '🍜',
  ACTIVITIES: '🎯',
  SHOPPING: '🛍️',
  OTHER: '💸',
};

export default function Budget() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [trip, setTrip] = useState(null);
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModal, setAddModal] = useState(false);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    category: 'FOOD',
    amount: '',
    description: '',
    date: new Date().toISOString().slice(0, 10),
  });

  const loadAll = async () => {
    try {
      const [tripData, budgetData, expenseData] = await Promise.all([
        tripsApi.getTripById(id),
        expensesApi.getBudget(id),
        expensesApi.getExpenses(id),
      ]);
      setTrip(tripData);
      setBudget(budgetData);
      setExpenses(expenseData);
    } catch (e) {
      toast.error(e.message || 'Failed to load budget data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, [id]);

  const handleAddExpense = async () => {
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setAdding(true);
    try {
      await expensesApi.addExpense({
        tripId: Number(id),
        category: form.category,
        amount: Number(form.amount),
        description: form.description,
        date: form.date,
      });
      toast.success('Expense added!');
      setAddModal(false);
      setForm({ category: 'FOOD', amount: '', description: '', date: new Date().toISOString().slice(0, 10) });
      loadAll();
    } catch (e) {
      toast.error(e.message || 'Failed to add expense');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteExpense = async (expId) => {
    try {
      await expensesApi.deleteExpense(expId);
      toast.success('Expense removed');
      loadAll();
    } catch (e) {
      toast.error(e.message || 'Failed to delete expense');
    }
  };

  if (loading) return (
    <Shell>
      <div className="page" style={{ paddingTop: '60px', textAlign: 'center', color: 'var(--ink-faint)' }}>
        Loading budget…
      </div>
    </Shell>
  );

  // Pie chart data from actual expenses
  const pieData = Object.entries(budget?.byCategory?.actual || {}).map(([cat, val]) => ({
    name: cat,
    value: Math.round(val),
  })).filter(d => d.value > 0);

  // Bar chart combining estimated vs actual
  const barData = EXPENSE_CATEGORIES.map(cat => ({
    category: cat.charAt(0) + cat.slice(1).toLowerCase(),
    Estimated: Math.round(budget?.byCategory?.estimated?.[cat] || 0),
    Actual: Math.round(budget?.byCategory?.actual?.[cat] || 0),
  })).filter(d => d.Estimated > 0 || d.Actual > 0);

  const usedBudget = Math.max(budget?.totalEstimated || 0, budget?.totalActual || 0);
  const pct = budget?.totalBudget > 0 ? Math.min(100, Math.round((usedBudget / budget.totalBudget) * 100)) : 0;
  const overBudget = budget?.isOverBudget;

  return (
    <Shell>
      <div className="page">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/trips/${id}/itinerary`)} style={{ marginBottom: '16px' }}>
          <ArrowLeft size={14} /> Back to Itinerary
        </button>

        <div className="page-head">
          <div>
            <span className="eyebrow">Budget Tracker</span>
            <h1>{trip?.name}</h1>
            <p>Real-time budget breakdown vs estimated and actual spending</p>
          </div>
          <button className="btn btn-accent" onClick={() => setAddModal(true)}>
            <Plus size={15} /> Add Expense
          </button>
        </div>

        {/* Budget Summary Cards */}
        <div className="grid grid-4" style={{ marginBottom: '28px' }}>
          {[
            { label: 'Total Budget', value: fmtMoney(budget?.totalBudget), color: 'var(--ocean-700)' },
            { label: 'Estimated Cost', value: fmtMoney(budget?.totalEstimated), color: 'var(--teal-600)' },
            { label: 'Actual Spend', value: fmtMoney(budget?.totalActual), color: 'var(--coral-600)' },
            {
              label: overBudget ? '⚠️ Over Budget By' : '✅ Remaining Budget',
              value: fmtMoney(Math.abs(budget?.remainingBudget || 0)),
              color: overBudget ? 'var(--danger)' : 'var(--success)',
            },
          ].map(s => (
            <div key={s.label} className="card stat-card">
              <div className="label">{s.label}</div>
              <div className="value" style={{ fontSize: '22px', color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Budget Progress Bar */}
        <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
          <div className="flex justify-between" style={{ marginBottom: '10px' }}>
            <span style={{ fontWeight: 700, fontSize: '14px' }}>Budget Usage</span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: '15px',
              color: overBudget ? 'var(--danger)' : 'var(--success)',
            }}>
              {pct}% {overBudget ? '(Over Budget!)' : 'used'}
            </span>
          </div>
          <div style={{ height: '14px', borderRadius: '8px', background: 'var(--line-soft)', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${pct}%`,
              background: overBudget
                ? 'linear-gradient(90deg, var(--danger), #ff6b6b)'
                : 'linear-gradient(90deg, var(--teal-400), var(--teal-600))',
              borderRadius: '8px',
              transition: 'width 0.5s ease',
            }} />
          </div>
          {overBudget && (
            <div style={{ marginTop: '10px', fontSize: '13px', color: 'var(--danger)', fontWeight: 600 }}>
              ⚠️ You have exceeded your budget by {fmtMoney(budget.overBudgetBy)}. Consider adjusting activities or expenses.
            </div>
          )}
        </div>

        {/* Charts Row */}
        {(pieData.length > 0 || barData.length > 0) && (
          <div className="grid grid-2" style={{ gap: '20px', marginBottom: '28px' }}>
            {pieData.length > 0 && (
              <div className="card" style={{ padding: '20px' }}>
                <div className="flex items-center gap-8" style={{ marginBottom: '16px', fontWeight: 800, fontSize: '15px' }}>
                  <PieChart size={16} style={{ color: 'var(--teal-600)' }} /> Actual Spend by Category
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <RechartsPieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} dataKey="value" paddingAngle={3}>
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#8aa0a3'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => fmtMoney(val)} />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                  {pieData.map(d => (
                    <div key={d.name} className="flex items-center gap-6" style={{ fontSize: '12px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: CATEGORY_COLORS[d.name] || '#8aa0a3', flexShrink: 0 }} />
                      <span style={{ color: 'var(--ink-soft)', fontWeight: 600 }}>{CATEGORY_EMOJI[d.name]} {d.name.charAt(0) + d.name.slice(1).toLowerCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {barData.length > 0 && (
              <div className="card" style={{ padding: '20px' }}>
                <div className="flex items-center gap-8" style={{ marginBottom: '16px', fontWeight: 800, fontSize: '15px' }}>
                  <TrendingUp size={16} style={{ color: 'var(--teal-600)' }} /> Estimated vs Actual
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--line-soft)" />
                    <XAxis dataKey="category" tick={{ fontSize: 11, fill: 'var(--ink-faint)' }} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--ink-faint)' }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(val) => fmtMoney(val)} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="Estimated" fill="var(--teal-400)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Actual" fill="var(--coral-500)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* Expense Table */}
        <div className="section-head">
          <h2>💳 Expense Log</h2>
          <span style={{ fontSize: '13px', color: 'var(--ink-faint)' }}>{expenses.length} entries</span>
        </div>

        {expenses.length === 0 ? (
          <div className="empty-state">
            <div className="icon-wrap"><TrendingUp size={26} /></div>
            <h3>No expenses yet</h3>
            <p>Log your travel expenses to track actual spend vs budget.</p>
            <button className="btn btn-accent" onClick={() => setAddModal(true)}><Plus size={14} /> Add First Expense</button>
          </div>
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ background: 'var(--mist-100)', borderBottom: '1px solid var(--line)' }}>
                  {['Category', 'Description', 'Date', 'Amount', ''].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp, i) => (
                  <tr key={exp.id} style={{ borderBottom: '1px solid var(--line-soft)', background: i % 2 === 0 ? '#fff' : 'var(--mist-50)' }}>
                    <td style={{ padding: '11px 16px' }}>
                      <span className="badge badge-teal">{CATEGORY_EMOJI[exp.category]} {exp.category.charAt(0) + exp.category.slice(1).toLowerCase()}</span>
                    </td>
                    <td style={{ padding: '11px 16px', color: 'var(--ink-soft)' }}>{exp.description || '—'}</td>
                    <td style={{ padding: '11px 16px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-faint)' }}>{fmtDate(exp.date)}</td>
                    <td style={{ padding: '11px 16px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--navy-900)' }}>{fmtMoney(exp.amount)}</td>
                    <td style={{ padding: '11px 16px', textAlign: 'right' }}>
                      <button className="btn btn-danger btn-sm" style={{ padding: '4px 8px' }} onClick={() => handleDeleteExpense(exp.id)}>
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Expense Modal */}
        <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add Expense">
          <div className="field">
            <label>Category</label>
            <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {EXPENSE_CATEGORIES.map(c => (
                <option key={c} value={c}>{CATEGORY_EMOJI[c]} {c.charAt(0) + c.slice(1).toLowerCase()}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Amount (₹) *</label>
            <input type="number" className="input" min={0} step={10} placeholder="e.g. 2500"
              value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} autoFocus />
          </div>
          <div className="field">
            <label>Description (optional)</label>
            <input className="input" placeholder="e.g. Hotel in Tokyo" value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="field">
            <label>Date *</label>
            <input type="date" className="input" value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>
          <div className="flex gap-10">
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setAddModal(false)}>Cancel</button>
            <button className="btn btn-accent" style={{ flex: 1 }} onClick={handleAddExpense} disabled={adding}>
              <Plus size={14} /> {adding ? 'Adding…' : 'Add Expense'}
            </button>
          </div>
        </Modal>
      </div>
    </Shell>
  );
}
