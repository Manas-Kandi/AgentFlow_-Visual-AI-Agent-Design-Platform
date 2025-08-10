'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
 

interface BillingFormProps {
  subscriptionPlan: { name: string } & Record<string, unknown>;
}

export default function BillingForm({ subscriptionPlan }: BillingFormProps) {
  const [loading, setLoading] = useState(false);

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/create-portal-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const ct = res.headers.get('content-type') || '';
      const isJson = ct.includes('application/json');
      const payload = isJson ? await res.json().catch(() => ({})) : await res.text();
      if (!res.ok) {
        const rawMsg = isJson ? (payload as Record<string, unknown>)?.message : undefined;
        const msg = typeof rawMsg === 'string' ? rawMsg : isJson ? JSON.stringify(payload) : String(payload);
        throw new Error(msg || `Failed to create portal link (HTTP ${res.status})`);
      }
      const url = (payload as Record<string, unknown>)?.url;
      if (typeof url !== 'string' || !url) throw new Error('No portal URL returned');
      window.location.assign(url);
    } catch (error) {
      alert((error as Error)?.message ?? 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-medium">Subscription Plan</h3>
        <p className="text-sm text-muted-foreground">
          You are currently on the <strong>{subscriptionPlan.name}</strong> plan.
        </p>
      </div>
      <Button onClick={redirectToCustomerPortal} disabled={loading} variant="outline" size="sm">
        {loading ? 'Loading...' : 'Manage Subscription'}
      </Button>
    </div>
  );
}

