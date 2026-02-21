import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Pitch } from '@/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Check, FileSignature } from 'lucide-react';

interface Props {
  pitch: Pitch;
}

const CONTRACT_TEXT = `VENTURE INVESTMENT AGREEMENT

This Venture Investment Agreement ("Agreement") is entered into between the Founder ("Founder") and the Venture Partner ("Analyst") through Vett & Venture Operations Platform.

1. EQUITY ASSIGNMENT
The Founder agrees to assign Ten Percent (10%) equity ownership in the Company to Vett & Venture in consideration of funding, mentorship, and operational support provided under this Agreement.

2. ANTI-DILUTION CLAUSE
The equity stake held by Vett & Venture shall be subject to full-ratchet anti-dilution protection. In the event of a down-round financing, the conversion price shall be adjusted to equal the price per share of the new issuance.

3. TRANCHE-BASED FUNDING
Capital shall be released in tranches contingent upon the achievement of predefined milestones. Each tranche release requires verification and approval by the assigned Senior Analyst. Funds shall be held in escrow until milestone approval.

4. INTELLECTUAL PROPERTY OWNERSHIP
All intellectual property developed during the engagement period shall remain the property of the Company. However, Vett & Venture retains a perpetual, non-exclusive license to utilize methodologies, frameworks, and processes developed during the bootcamp program.

5. REVERSE VESTING
The Founder's equity shall be subject to a thirty-six (36) month reverse vesting schedule with a twelve (12) month cliff. In the event of voluntary departure before the cliff period, unvested shares shall be returned to the Company's option pool.

6. KILL-SWITCH CLAUSE
Vett & Venture reserves the right to terminate funding and invoke the kill-switch provision if the Company fails to meet two consecutive milestone targets, materially misrepresents financial data, or breaches any material term of this Agreement. Upon activation, remaining escrow funds shall be returned and equity provisions shall be subject to renegotiation.

7. BOARD OBSERVER RIGHTS
Vett & Venture shall be entitled to appoint one (1) non-voting board observer who shall have the right to attend all board meetings, receive all board materials, and participate in discussions without voting rights.

8. NON-COMPETE & NON-SOLICITATION
The Founder agrees to a twelve (12) month non-compete period following termination, during which the Founder shall not engage in any business that directly competes with the Company's core business. Additionally, neither party shall solicit employees or contractors of the other party for a period of twenty-four (24) months.

9. EXCLUSIVITY PERIOD
The Company agrees to an exclusivity period of six (6) months from the date of this Agreement, during which the Company shall not seek, negotiate, or accept alternative investment or partnership arrangements without prior written consent from Vett & Venture.

10. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with applicable commercial law. Any disputes arising shall be resolved through binding arbitration.`;

export default function ContractPanel({ pitch }: Props) {
  const { user } = useAuth();
  const { signContract } = useData();

  const isFounder = user?.role === 'founder' && user.id === pitch.founderId;
  const isAssignedAnalyst = user?.id === pitch.assignedAnalystId;

  const canSign =
    (isFounder && !pitch.contractSignedFounder) ||
    (isAssignedAnalyst && !pitch.contractSignedAnalyst);

  const handleSign = () => {
    if (isFounder) signContract(pitch.id, 'founder');
    else if (isAssignedAnalyst) signContract(pitch.id, 'analyst');
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold">Investment Agreement</h3>

      <div className="border rounded-md p-6 bg-muted/30 max-h-[400px] overflow-y-auto">
        <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">{CONTRACT_TEXT}</pre>
      </div>

      <Separator />

      <div className="space-y-3">
        <h4 className="text-sm font-medium">Signatures</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SignatureBox
            label="Founder"
            signed={pitch.contractSignedFounder}
          />
          <SignatureBox
            label="Analyst"
            signed={pitch.contractSignedAnalyst}
          />
        </div>
      </div>

      {canSign && (
        <Button onClick={handleSign} className="gap-2">
          <FileSignature className="h-4 w-4" />
          Sign Agreement
        </Button>
      )}

      {pitch.contractSignedFounder && pitch.contractSignedAnalyst && (
        <p className="text-sm text-success font-medium flex items-center gap-1">
          <Check className="h-4 w-4" />
          Both parties have signed. Proceeding to Bootcamp.
        </p>
      )}

      {!canSign && !(pitch.contractSignedFounder && pitch.contractSignedAnalyst) && (
        <p className="text-sm text-muted-foreground">
          {pitch.contractSignedFounder && 'Waiting for analyst signature.'}
          {pitch.contractSignedAnalyst && 'Waiting for founder signature.'}
          {!pitch.contractSignedFounder && !pitch.contractSignedAnalyst && 'Both parties must sign to proceed.'}
        </p>
      )}
    </div>
  );
}

function SignatureBox({ label, signed }: { label: string; signed: boolean }) {
  return (
    <div className={`border rounded-md p-4 ${signed ? 'border-success bg-success/5' : ''}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        {signed ? (
          <span className="text-xs text-success font-medium flex items-center gap-1">
            <Check className="h-3 w-3" /> Signed
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">Pending</span>
        )}
      </div>
      {signed && (
        <div className="mt-2 border-t pt-2">
          <p className="text-xs text-muted-foreground italic">Electronically signed on {new Date().toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
}