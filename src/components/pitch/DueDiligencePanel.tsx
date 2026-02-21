import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Pitch } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Check, Shield } from 'lucide-react';

interface Props {
  pitch: Pitch;
}

export default function DueDiligencePanel({ pitch }: Props) {
  const { user } = useAuth();
  const { submitDiligence, verifyDiligence } = useData();

  const isFounder = user?.role === 'founder' && user.id === pitch.founderId;
  const isAssignedAnalyst = user?.id === pitch.assignedAnalystId;
  const data = pitch.diligenceData;

  const [form, setForm] = useState({
    businessRegistration: data?.businessRegistration || '',
    physicalAddress: data?.physicalAddress || '',
    pinLocation: data?.pinLocation || '',
    workforceSize: data?.workforceSize || '',
    businessType: data?.businessType || '',
  });

  const set = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitDiligence(pitch.id, form);
  };

  if (data?.verified) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-success" />
          <h3 className="font-semibold">Due Diligence Verified</h3>
        </div>
        <div className="grid gap-3 text-sm">
          <Row label="Business Registration" value={data.businessRegistration} />
          <Row label="Physical Address" value={data.physicalAddress} />
          <Row label="Pin Location" value={data.pinLocation} />
          <Row label="Workforce Size" value={data.workforceSize} />
          <Row label="Business Type" value={data.businessType} />
        </div>
        <Badge className="bg-success/10 text-success">Verified & Locked</Badge>
      </div>
    );
  }

  if (data && !data.verified && isAssignedAnalyst) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold">Review Due Diligence</h3>
        <div className="grid gap-3 text-sm">
          <Row label="Business Registration" value={data.businessRegistration} />
          <Row label="Physical Address" value={data.physicalAddress} />
          <Row label="Pin Location" value={data.pinLocation} />
          <Row label="Workforce Size" value={data.workforceSize} />
          <Row label="Business Type" value={data.businessType} />
        </div>
        <Button onClick={() => verifyDiligence(pitch.id)}>
          <Check className="h-4 w-4 mr-2" />
          Verify & Lock Data
        </Button>
      </div>
    );
  }

  if (data && !data.verified) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold">Due Diligence Submitted</h3>
        <p className="text-sm text-muted-foreground">Awaiting analyst verification.</p>
        <div className="grid gap-3 text-sm">
          <Row label="Business Registration" value={data.businessRegistration} />
          <Row label="Physical Address" value={data.physicalAddress} />
          <Row label="Pin Location" value={data.pinLocation} />
          <Row label="Workforce Size" value={data.workforceSize} />
          <Row label="Business Type" value={data.businessType} />
        </div>
      </div>
    );
  }

  if (!isFounder) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        Waiting for the founder to submit due diligence information.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <h3 className="font-semibold">Due Diligence Information</h3>
      <div className="space-y-1.5">
        <Label>Business Registration Number</Label>
        <Input value={form.businessRegistration} onChange={e => set('businessRegistration', e.target.value)} required />
      </div>
      <div className="space-y-1.5">
        <Label>Physical Address</Label>
        <Input value={form.physicalAddress} onChange={e => set('physicalAddress', e.target.value)} required />
      </div>
      <div className="space-y-1.5">
        <Label>Pin Location (Coordinates)</Label>
        <Input value={form.pinLocation} onChange={e => set('pinLocation', e.target.value)} placeholder="-1.2921, 36.8219" required />
      </div>
      <div className="space-y-1.5">
        <Label>Workforce Size</Label>
        <Input value={form.workforceSize} onChange={e => set('workforceSize', e.target.value)} placeholder="e.g., 15" required />
      </div>
      <div className="space-y-1.5">
        <Label>Business Type</Label>
        <Select value={form.businessType} onValueChange={v => set('businessType', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
            <SelectItem value="partnership">Partnership</SelectItem>
            <SelectItem value="llc">LLC</SelectItem>
            <SelectItem value="corporation">Corporation</SelectItem>
            <SelectItem value="cooperative">Cooperative</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Submit for Verification</Button>
    </form>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}