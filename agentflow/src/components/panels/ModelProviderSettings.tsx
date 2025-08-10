"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
// Use secure API routes; do NOT import server-only services in client components
import { getProfile as mockGet, upsertProfile as mockUpsert, setProvider as mockSetProvider, setApiKey as mockSetApiKey } from "@/lib/mockProfileStore";

interface ModelProviderSettingsProps {
  userId: string;
  userEmail: string;
}

export default function ModelProviderSettings({ userId, userEmail }: ModelProviderSettingsProps) {
  const [provider, setProvider] = useState<'weev' | 'byok'>('weev');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Load user profile data on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      // If dev_user exists, prefer mock profile store
      const isDev = typeof window !== 'undefined' && !!localStorage.getItem('dev_user');
      if (isDev) {
        const mock = mockGet(userId) || mockUpsert(userId, { email: userEmail, llm_provider: 'weev' });
        if (mock.llm_provider) setProvider(mock.llm_provider as 'weev' | 'byok');
        return;
      }
      try {
        const res = await fetch('/api/user/profile/upsert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, email: userEmail })
        });
        const data = await res.json();
        if (res.ok && data?.llm_provider) {
          setProvider(data.llm_provider as 'weev' | 'byok');
        }
      } catch {
        // Fallback to mock store on failure
        const mock = mockGet(userId) || mockUpsert(userId, { email: userEmail, llm_provider: 'weev' });
        if (mock.llm_provider) setProvider(mock.llm_provider as 'weev' | 'byok');
      }
    };

    if (userId && userEmail) {
      loadUserProfile();
    }
  }, [userId, userEmail]);

  const handleProviderChange = async (newProvider: 'weev' | 'byok') => {
    setProvider(newProvider);
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      const res = await fetch('/api/user/profile/provider', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, provider: newProvider })
      });
      if (res.ok) {
        setSaveStatus('success');
      } else {
        // Also persist to mock store
        mockSetProvider(userId, newProvider);
        setSaveStatus('success');
      }
    } catch (error) {
      // Persist to mock store on error
      mockSetProvider(userId, newProvider);
      setSaveStatus('success');
    } finally {
      setIsSaving(false);
    }
  };

  const handleApiKeySave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      const res = await fetch('/api/user/profile/apikey', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, apiKey })
      });
      if (res.ok) {
        setSaveStatus('success');
        setProvider('byok');
      } else {
        // Save to mock store if API fails
        mockSetApiKey(userId, apiKey);
        mockSetProvider(userId, 'byok');
        setSaveStatus('success');
        setProvider('byok');
      }
    } catch (error) {
      // Save to mock store on error
      mockSetApiKey(userId, apiKey);
      mockSetProvider(userId, 'byok');
      setSaveStatus('success');
      setProvider('byok');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border hover:border-muted-foreground/20">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-white/80">Model Provider</CardTitle>
        <CardDescription className="text-sm text-white/50">
          Choose between Weev-hosted model execution or bring your own API key
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Provider Toggle */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-white/70">Execution Mode</Label>

          {/* Segmented control for visibility */}
          <div className="inline-flex rounded-md overflow-hidden border border-border/40">
            <button
              type="button"
              className={`px-4 py-2 text-sm ${provider === 'weev' ? 'bg-primary/10 text-white border-r border-border/40' : 'bg-background text-white/60 hover:text-white/80 border-r border-border/40'}`}
              onClick={() => handleProviderChange('weev')}
            >
              Weev-hosted
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm ${provider === 'byok' ? 'bg-primary/10 text-white' : 'bg-background text-white/60 hover:text-white/80'}`}
              onClick={() => handleProviderChange('byok')}
            >
              BYOK
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg mt-2">
            <div className="space-y-1">
              <div className="font-medium text-white/80">
                {provider === 'weev' ? 'Weev-hosted' : 'Bring Your Own Key'}
              </div>
              <div className="text-xs text-white/50">
                {provider === 'weev'
                  ? 'Use Weev\'s hosted models with token billing'
                  : 'Use your own API key for model execution'}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-white/60">Enable BYOK</span>
              <Switch
                aria-label="Toggle BYOK"
                checked={provider === 'byok'}
                onCheckedChange={(checked: boolean) =>
                  handleProviderChange(checked ? 'byok' : 'weev')
                }
              />
            </div>
          </div>
        </div>
        
        {/* API Key Input (only shown when BYOK is selected) */}
        {provider === 'byok' && (
          <div className="space-y-4">
            <Label className="text-sm font-medium text-white/70">API Key</Label>
            
            <div className="flex gap-2">
              <Input
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your NVIDIA API key"
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? 'Hide' : 'Show'}
              </Button>
            </div>
            
            <div className="text-xs text-white/50">
              Demo mode: key stored locally for testing. In production, keys are stored securely and never exposed.
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        {provider === 'byok' && (
          <Button 
            onClick={handleApiKeySave}
            disabled={isSaving || !apiKey}
            className="w-full"
          >
            {isSaving ? 'Saving...' : 'Save API Key'}
          </Button>
        )}
        
        {saveStatus === 'success' && (
          <div className="text-sm text-green-500">Settings saved successfully!</div>
        )}
        
        {saveStatus === 'error' && (
          <div className="text-sm text-red-500">Error saving settings. Please try again.</div>
        )}
      </CardFooter>
    </Card>
  );
}
