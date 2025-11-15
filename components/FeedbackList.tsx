'use client';
import React, { useEffect, useState } from 'react';
import { getReadOnlyContract } from '../lib/contract';

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const contract = getReadOnlyContract();
      const res = await contract.getAllFeedback();
      const parsed = res.map((f: any) => ({
        sender: f.sender,
        message: f.message,
        timestamp: Number(f.timestamp.toString())
      })).reverse();
      setFeedbacks(parsed);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Recent Feedback</h2>
      {loading ? <div>Loading...</div> : (
        <div className="space-y-3">
          {feedbacks.length === 0 ? <div className="text-sm text-gray-500">No feedback yet</div> : feedbacks.map((f, i) => (
            <div key={i} className="p-3 border rounded bg-white">
              <div className="text-sm">{f.message}</div>
              <div className="text-xs text-gray-500 mt-2">From: <span className="font-mono">{f.sender}</span></div>
              <div className="text-xs text-gray-400">{new Date(f.timestamp * 1000).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
