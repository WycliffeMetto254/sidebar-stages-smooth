import { useState } from 'react';
import { useForgeAuth } from '@/contexts/ForgeAuthContext';
import { useForgeData } from '@/contexts/ForgeDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { FileCheck, Plus, CheckCircle2, Clock } from 'lucide-react';

export default function MarketValidationPage() {
  const { member, squad } = useForgeAuth();
  const { lois, addLOI, verifyLOI } = useForgeData();
  const [open, setOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerOrg, setCustomerOrg] = useState('');
  const [description, setDescription] = useState('');

  if (!member || !squad) return null;

  const squadLOIs = lois.filter(l => l.squadId === squad.id);
  const verifiedCount = squadLOIs.filter(l => l.verified).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerOrg.trim()) return;
    addLOI({
      squadId: squad.id,
      customerName: customerName.trim(),
      customerOrg: customerOrg.trim(),
      description: description.trim(),
      dateReceived: new Date().toISOString().split('T')[0],
      verified: false,
    });
    setCustomerName('');
    setCustomerOrg('');
    setDescription('');
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Market Validation</h1>
          <p className="text-muted-foreground text-sm">Collect Letters of Intent and proof of market demand from potential customers.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add LOI
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Letter of Intent</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Jane Doe" required />
              </div>
              <div className="space-y-2">
                <Label>Organization</Label>
                <Input value={customerOrg} onChange={e => setCustomerOrg(e.target.value)} placeholder="Acme Corp" required />
              </div>
              <div className="space-y-2">
                <Label>Description / Notes</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What did they commit to? What need does this validate?" />
              </div>
              <DialogFooter>
                <Button type="submit">Submit LOI</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <FileCheck className="h-8 w-8 mx-auto text-orange-500 mb-2" />
            <p className="text-3xl font-bold">{squadLOIs.length}</p>
            <p className="text-xs text-muted-foreground">Total LOIs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="h-8 w-8 mx-auto text-green-500 mb-2" />
            <p className="text-3xl font-bold">{verifiedCount}</p>
            <p className="text-xs text-muted-foreground">Verified</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Clock className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
            <p className="text-3xl font-bold">{squadLOIs.length - verifiedCount}</p>
            <p className="text-xs text-muted-foreground">Pending Verification</p>
          </CardContent>
        </Card>
      </div>

      {/* LOI List */}
      {squadLOIs.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground py-12">
            <FileCheck className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No Letters of Intent yet</p>
            <p className="text-sm mt-1">Start connecting with potential customers and collecting LOIs.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {squadLOIs.map(loi => (
            <Card key={loi.id}>
              <CardContent className="pt-4 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold">{loi.customerName}</p>
                    <span className="text-xs text-muted-foreground">— {loi.customerOrg}</span>
                    {loi.verified ? (
                      <Badge className="bg-green-100 text-green-800 text-[10px]">Verified</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">Pending</Badge>
                    )}
                  </div>
                  {loi.description && <p className="text-xs text-muted-foreground">{loi.description}</p>}
                  <p className="text-[10px] text-muted-foreground mt-1">Received: {loi.dateReceived}</p>
                </div>
                {!loi.verified && (
                  <Button size="sm" variant="outline" onClick={() => verifyLOI(loi.id)}>
                    Mark Verified
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
