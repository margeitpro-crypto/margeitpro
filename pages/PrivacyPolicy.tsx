import React from 'react';
import { PageProps } from '../types';

const PrivacyPolicy: React.FC<PageProps> = ({ theme }) => {
  return (
    <div className={`max-w-4xl mx-auto px-4 py-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <p className="mb-4"><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
      
      <p className="mb-6">
        Marge It Pro ("we", "our", or "us") is committed to protecting your privacy. 
        This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
        when you use our web application. Please read this privacy policy carefully. 
        If you do not agree with the terms of this privacy policy, please do not access the application.
      </p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
          
          <h3 className="text-xl font-medium mb-2">Personal Information</h3>
          <p className="mb-3">
            We may collect personally identifiable information that you voluntarily provide to us when 
            you register with the application or otherwise contact us. This may include:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Name</li>
            <li>Email address</li>
            <li>Google account information (when you sign in with Google)</li>
            <li>Profile picture</li>
          </ul>
          
          <h3 className="text-xl font-medium mb-2">Usage Information</h3>
          <p className="mb-3">
            We may automatically collect certain information when you access or use our application, including:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Pages visited and time spent on pages</li>
            <li>Referring website or application</li>
          </ul>
          
          <h3 className="text-xl font-medium mb-2">Google Services Information</h3>
          <p className="mb-3">
            Since our application integrates with Google services, we may access:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Google Sheets data (as provided by you for merging)</li>
            <li>Google Docs and Slides templates (as provided by you)</li>
            <li>Files created through our application in your Google Drive</li>
          </ul>
          <p className="mb-3">
            <strong>Important:</strong> We only access this information with your explicit permission 
            and only for the purpose of performing the document merging functions you request.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p className="mb-3">We use the information we collect for various purposes, including:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>To provide, maintain, and improve our application</li>
            <li>To authenticate your identity when you sign in</li>
            <li>To perform document merging operations as requested</li>
            <li>To communicate with you, including responding to your inquiries</li>
            <li>To monitor and analyze usage patterns and trends</li>
            <li>To detect, prevent, and address technical issues</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Information Sharing and Disclosure</h2>
          <p className="mb-3">We may share your information in the following situations:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>With your consent:</strong> We may share your information with third parties when you give us permission to do so.</li>
            <li><strong>For legal reasons:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
            <li><strong>To protect rights:</strong> We may disclose your information when we believe it is necessary to protect our rights, property, or safety, or those of our users or others.</li>
          </ul>
          <p className="mb-3">
            We do not sell, trade, or otherwise transfer your personal information to third parties 
            for their marketing purposes without your consent.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Data Security</h2>
          <p className="mb-3">
            We implement appropriate technical and organizational measures to protect the security 
            of your personal information. However, please note that no method of transmission over 
            the Internet or method of electronic storage is 100% secure.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Data Retention</h2>
          <p className="mb-3">
            We will retain your information for as long as necessary to fulfill the purposes outlined 
            in this Privacy Policy, unless a longer retention period is required or permitted by law.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Your Rights</h2>
          <p className="mb-3">Depending on your location, you may have certain rights regarding your personal information:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>The right to access, update, or delete your personal information</li>
            <li>The right to object to or restrict the processing of your personal information</li>
            <li>The right to data portability</li>
            <li>The right to withdraw consent</li>
          </ul>
          <p className="mb-3">
            To exercise these rights, please contact us at the information provided below.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Children's Privacy</h2>
          <p className="mb-3">
            Our application is not intended for use by children under the age of 13. 
            We do not knowingly collect personal information from children under 13. 
            If we become aware that we have collected personal information from a child under 13, 
            we will take steps to delete such information.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">8. Changes to This Privacy Policy</h2>
          <p className="mb-3">
            We may update our Privacy Policy from time to time. We will notify you of any changes 
            by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">9. Contact Us</h2>
          <p className="mb-3">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="mb-3">
            <strong>Email:</strong> privacy@margeitpro.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;