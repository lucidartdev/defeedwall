'use client';
import React, { useState } from 'react';
import { ethers } from 'ethers';
import ConnectWallet from '../components/ConnectWallet';
import FeedbackList from '../components/FeedbackList';
import { getContract } from '../lib/contract';

export default function Home() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | undefined>();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!provider) return alert('Connect wallet');
    if (!message || message.trim().length === 0) return alert('Message empty');
    if (message.length > 140) return alert('Message too long');

    try {
      setLoading(true);
      const signer = await provider.getSigner();
      const contract = getContract(signer);
      const tx = await contract.submitFeedback(message);
      await tx.wait();
      setMessage('');
      // simple reload to refresh list
      window.location.reload();
    } catch (e: any) {
      console.error(e);
      alert(e?.message || 'Failed');
    } finally { setLoading(false); }
  }

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Decentralized Feedback Wall</h1>
        <ConnectWallet onConnect={(p) => setProvider(p)} />
      </header>

      <section className="mb-6">
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write feedback (max 140 chars)" maxLength={140} className="w-full p-3 border rounded bg-white" rows={3} />
        <div className="mt-2 flex justify-end">
          <button onClick={submit} disabled={loading} className="px-4 py-2 bg-emerald-600 text-white rounded">{loading ? 'Submitting...' : 'Submit Feedback'}</button>
        </div>
      </section>

      <FeedbackList />
    </div>
  );
}
