import React from 'react';
import { PageProps } from '../types';

const TermsOfService: React.FC<PageProps> = ({ theme }) => {
  return (
    <div className={`max-w-4xl mx-auto px-4 py-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <p className="mb-4"><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
      
      <p className="mb-6">
        These Terms of Service ("Terms") govern your access to and use of the Marge It Pro web application 
        ("Service"), and any content, functionality, and services offered on or through the Service.
      </p>
      
      <p className="mb-6">
        Please read these Terms carefully before you start to use the Service. 
        By using the Service or by clicking to accept or agree to the Terms when this option is made available to you, 
        you accept and agree to be bound and abide by these Terms and our Privacy Policy.
      </p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Eligibility</h2>
          <p className="mb-3">
            This Service is offered and available to users who are at least 13 years of age. 
            By using this Service, you represent and warrant that you are of legal age to form a binding contract 
            with us and meet all of the foregoing eligibility requirements. 
            If you do not meet all of these requirements, you must not access or use the Service.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Account Registration</h2>
          <p className="mb-3">
            To access certain features of the Service, you may be required to register for an account. 
            You agree to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Provide accurate, current, and complete information during registration</li>
            <li>Maintain and promptly update your account information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
          </ul>
          <p className="mb-3">
            You are responsible for all activities that occur under your account.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Acceptable Use</h2>
          <p className="mb-3">
            You agree not to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Use the Service for any illegal or unauthorized purpose</li>
            <li>Violate any laws in your jurisdiction</li>
            <li>Transmit any material that is harmful, offensive, or objectionable</li>
            <li>Interfere with or disrupt the Service or servers</li>
            <li>Attempt to gain unauthorized access to the Service</li>
            <li>Use the Service to transmit spam or other unsolicited communications</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Google Services Integration</h2>
          <p className="mb-3">
            Our Service integrates with Google services including Google Sheets, Docs, and Slides. 
            By using our Service, you agree to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Comply with Google's Terms of Service and Privacy Policy</li>
            <li>Only use data you have permission to access</li>
            <li>Not misuse Google services or attempt to circumvent their security</li>
          </ul>
          <p className="mb-3">
            We are not responsible for any actions taken by Google or for Google's services.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Intellectual Property</h2>
          <p className="mb-3">
            The Service and its entire contents, features, and functionality are owned by Marge It Pro 
            or its licensors and are protected by international copyright, trademark, patent, trade secret, 
            and other intellectual property or proprietary rights laws.
          </p>
          <p className="mb-3">
            You retain all rights to your data. We will not use your data except as necessary to provide 
            the Service to you or as described in our Privacy Policy.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Subscription and Billing</h2>
          <p className="mb-3">
            Some features of the Service may require payment. By selecting a subscription plan, 
            you agree to pay all fees and charges associated with that plan at the rates in effect 
            when charges are incurred.
          </p>
          <p className="mb-3">
            All fees are exclusive of taxes. You are responsible for paying all taxes and government 
            charges (other than taxes based on our net income).
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Disclaimer of Warranties</h2>
          <p className="mb-3">
            THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. 
            WE DISCLAIM ALL WARRANTIES, WHETHER EXPRESS OR IMPLIED, INCLUDING 
            WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, 
            AND NON-INFRINGEMENT.
          </p>
          <p className="mb-3">
            WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, 
            OR THAT DEFECTS WILL BE CORRECTED.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">8. Limitation of Liability</h2>
          <p className="mb-3">
            IN NO EVENT SHALL MARGE IT PRO, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, 
            EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
            SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES, INCLUDING BUT NOT LIMITED TO, 
            DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES.
          </p>
          <p className="mb-3">
            OUR TOTAL LIABILITY TO YOU FOR ANY CLAIM ARISING OUT OF OR RELATING TO THESE TERMS 
            OR THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID US FOR THE SERVICE DURING THE 
            12 MONTHS IMMEDIATELY PRECEDING THE CLAIM.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">9. Modifications to the Service</h2>
          <p className="mb-3">
            We may modify, suspend, or discontinue the Service at any time without notice. 
            We may also impose limits on certain features or restrict your access to parts or 
            all of the Service without notice or liability.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">10. Termination</h2>
          <p className="mb-3">
            We may terminate or suspend your account and access to the Service immediately, 
            without prior notice or liability, for any reason whatsoever, including without 
            limitation if you breach the Terms.
          </p>
          <p className="mb-3">
            Upon termination, your right to use the Service will immediately cease. 
            If you wish to terminate your account, you may simply discontinue using the Service.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">11. Governing Law</h2>
          <p className="mb-3">
            These Terms shall be governed by and construed in accordance with the laws of Nepal, 
            without regard to its conflict of law provisions.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">12. Changes to Terms</h2>
          <p className="mb-3">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
            If a revision is material, we will provide at least 30 days' notice prior to any new terms 
            taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">13. Contact Information</h2>
          <p className="mb-3">
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="mb-3">
            <strong>Email:</strong> support@margeitpro.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;