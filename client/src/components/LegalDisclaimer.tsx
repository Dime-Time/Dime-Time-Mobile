import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, FileText, Shield } from "lucide-react";

interface LegalDisclaimerProps {
  onAccept: () => void;
  onDecline: () => void;
}

export function LegalDisclaimer({ onAccept, onDecline }: LegalDisclaimerProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedRisks, setAcceptedRisks] = useState(false);

  const canProceed = acceptedTerms && acceptedPrivacy && acceptedRisks;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Terms of Service & Risk Disclosure
          </CardTitle>
          <p className="text-sm text-gray-600">
            Please read and acknowledge the following before using Dime Time
          </p>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full max-h-[60vh] pr-4">
            <div className="space-y-6">
              
              {/* Financial Risk Disclosure */}
              <section className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-500" />
                  Financial Risk Disclosure
                </h3>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-2 text-sm">
                  <p className="font-medium text-red-800">IMPORTANT: READ CAREFULLY</p>
                  <ul className="list-disc list-inside space-y-1 text-red-700">
                    <li>Cryptocurrency investments involve substantial risk of loss</li>
                    <li>Past performance does not guarantee future results</li>
                    <li>You may lose some or all of your invested funds</li>
                    <li>Banking integrations may have fees and processing delays</li>
                    <li>Debt management tools are for informational purposes only</li>
                    <li>We are not financial advisors - consult professionals for advice</li>
                  </ul>
                </div>
              </section>

              {/* Service Terms */}
              <section className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Terms of Service
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>1. Service Description:</strong> Dime Time provides debt reduction tools, round-up investments, and financial tracking. Services are provided "as is" without warranties.</p>
                  
                  <p><strong>2. User Responsibilities:</strong> You are responsible for:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Providing accurate financial information</li>
                    <li>Monitoring your accounts and transactions</li>
                    <li>Understanding risks before making investments</li>
                    <li>Complying with applicable laws and regulations</li>
                  </ul>

                  <p><strong>3. Limitations of Liability:</strong> Dime Time and its operators shall not be liable for:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Investment losses or financial decisions made using our tools</li>
                    <li>Third-party service interruptions (banks, exchanges, etc.)</li>
                    <li>Data processing errors or system downtime</li>
                    <li>Indirect, incidental, or consequential damages</li>
                  </ul>

                  <p><strong>4. Third-Party Services:</strong> We integrate with Coinbase, Plaid, and banking partners. Their terms and fees apply separately.</p>

                  <p><strong>5. Account Termination:</strong> We reserve the right to suspend or terminate accounts for violations of terms or suspicious activity.</p>
                </div>
              </section>

              {/* Privacy Policy */}
              <section className="space-y-3">
                <h3 className="text-lg font-semibold">Privacy Policy Summary</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Data Collection:</strong> We collect account information, transaction data, and usage analytics to provide our services.</p>
                  <p><strong>Data Sharing:</strong> We share data with banking partners, crypto exchanges, and service providers as necessary for app functionality.</p>
                  <p><strong>Data Security:</strong> We implement industry-standard security measures but cannot guarantee absolute security.</p>
                  <p><strong>Your Rights:</strong> You may request data deletion, but this may limit service functionality.</p>
                </div>
              </section>

              {/* Regulatory Notice */}
              <section className="space-y-3">
                <h3 className="text-lg font-semibold">Regulatory Notice</h3>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                  <p>Dime Time is a financial technology company, not a licensed financial advisor, broker, or investment company. We do not provide investment, tax, or legal advice. Consult qualified professionals for financial planning decisions.</p>
                </div>
              </section>
            </div>
          </ScrollArea>

          {/* Acceptance Checkboxes */}
          <div className="mt-6 space-y-4 border-t pt-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm leading-relaxed">
                I have read and agree to the <strong>Terms of Service</strong> and understand the limitations of liability.
              </label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="privacy"
                checked={acceptedPrivacy}
                onCheckedChange={(checked) => setAcceptedPrivacy(checked === true)}
                className="mt-1"
              />
              <label htmlFor="privacy" className="text-sm leading-relaxed">
                I acknowledge the <strong>Privacy Policy</strong> and consent to data collection and sharing as described.
              </label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="risks"
                checked={acceptedRisks}
                onCheckedChange={(checked) => setAcceptedRisks(checked === true)}
                className="mt-1"
              />
              <label htmlFor="risks" className="text-sm leading-relaxed">
                I understand the <strong>financial risks</strong> including potential losses from cryptocurrency investments and acknowledge this is not financial advice.
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onDecline}
              className="text-gray-600"
            >
              Decline & Exit
            </Button>
            
            <Button
              onClick={onAccept}
              disabled={!canProceed}
              className="bg-dime-purple hover:bg-dime-purple/90"
            >
              Accept & Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}