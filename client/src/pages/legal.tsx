import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Shield, AlertTriangle, Info } from "lucide-react";

export default function Legal() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Legal Information</h1>
        <p className="text-slate-600">Terms of Service, Privacy Policy, and Risk Disclosures</p>
      </div>

      <div className="space-y-8">
        
        {/* Risk Disclosure */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Financial Risk Disclosure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
              <p className="font-medium text-red-800">IMPORTANT RISK WARNING</p>
              <div className="text-sm text-red-700 space-y-2">
                <p><strong>Cryptocurrency Risks:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Cryptocurrency investments are highly volatile and speculative</li>
                  <li>You may lose some or all of your invested funds</li>
                  <li>Past performance does not guarantee future results</li>
                  <li>Regulatory changes may affect cryptocurrency values</li>
                </ul>
                
                <p><strong>Banking & Debt Management:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Banking integrations may have fees, delays, or service interruptions</li>
                  <li>Debt management tools are informational only, not financial advice</li>
                  <li>Results may vary based on individual financial circumstances</li>
                </ul>

                <p className="font-medium">We are not licensed financial advisors. Consult qualified professionals before making financial decisions.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms of Service */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Terms of Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4 text-sm text-gray-700 pr-4">
                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">1. Service Description</h3>
                  <p>Dime Time provides debt reduction tools, round-up investment features, and financial tracking services. All services are provided "as is" without warranties of any kind.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">2. User Responsibilities</h3>
                  <p>By using our service, you agree to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Provide accurate and complete financial information</li>
                    <li>Monitor your accounts and transactions regularly</li>
                    <li>Understand investment risks before making financial decisions</li>
                    <li>Comply with all applicable laws and regulations</li>
                    <li>Keep your login credentials secure</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">3. Limitations of Liability</h3>
                  <p>Dime Time and its operators shall not be liable for:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Investment losses or poor financial outcomes</li>
                    <li>Third-party service interruptions or failures</li>
                    <li>Data processing errors or system downtime</li>
                    <li>Indirect, incidental, or consequential damages</li>
                    <li>Financial decisions made using our tools or information</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">4. Third-Party Integrations</h3>
                  <p>Our app integrates with external services including:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Coinbase for cryptocurrency transactions</li>
                    <li>Plaid for banking connections</li>
                    <li>Financial institutions for account access</li>
                  </ul>
                  <p className="mt-2">These services have their own terms and conditions which apply to your use.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">5. Account Management</h3>
                  <p>We reserve the right to suspend or terminate accounts that:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Violate these terms of service</li>
                    <li>Engage in suspicious or fraudulent activity</li>
                    <li>Compromise system security or integrity</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">6. Changes to Terms</h3>
                  <p>We may update these terms periodically. Continued use of the service constitutes acceptance of updated terms.</p>
                </section>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Privacy Policy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-700">
              <section>
                <h3 className="font-semibold text-gray-900 mb-2">Data Collection</h3>
                <p>We collect:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Account information and authentication data</li>
                  <li>Financial transaction and account balance data</li>
                  <li>App usage and performance analytics</li>
                  <li>Device and browser information</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-2">Data Usage</h3>
                <p>Your data is used to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Provide core app functionality and features</li>
                  <li>Process financial transactions and investments</li>
                  <li>Generate insights and debt reduction strategies</li>
                  <li>Improve service quality and user experience</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-2">Data Sharing</h3>
                <p>We may share data with:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Banking partners and financial service providers</li>
                  <li>Cryptocurrency exchanges for transaction processing</li>
                  <li>Analytics providers for service improvement</li>
                  <li>Legal authorities when required by law</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-2">Data Security</h3>
                <p>We implement industry-standard security measures including encryption, secure servers, and access controls. However, no system is completely secure, and we cannot guarantee absolute data protection.</p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-2">Your Rights</h3>
                <p>You may request to access, correct, or delete your personal data. Note that data deletion may limit or prevent access to our services.</p>
              </section>
            </div>
          </CardContent>
        </Card>

        {/* Regulatory Notice */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Regulatory Notice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Important:</strong> Dime Time is a financial technology platform, not a licensed financial advisor, broker-dealer, or investment company. We do not provide investment advice, tax planning, or legal counsel. 
              </p>
              <p className="text-sm text-blue-800 mt-2">
                Before making any financial decisions, please consult with qualified licensed professionals including financial advisors, tax professionals, or legal counsel as appropriate for your situation.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500 pt-8 border-t">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p className="mt-2">
            <strong>Legal Notice:</strong> This framework requires review by qualified legal counsel before use.
          </p>
        </div>
      </div>
    </main>
  );
}