<script setup lang="ts">
const appName = import.meta.env.VITE_APP_NAME || 'QR Manager'
const companyName = import.meta.env.VITE_COMPANY_NAME || 'QR Manager'
const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'contact@example.com'
</script>

<template>
  <div class="legal-content">
    <p class="legal-meta">Last Updated: May 20, 2026</p>

    <h2>1. Acceptance of Terms</h2>
    <p>
      By accessing or using {{ appName }} (the "Service"), you agree to be bound by these Terms of
      Service ("Terms"). If you do not agree to these Terms, you may not access or use the
      Service. These Terms constitute a legally binding agreement between you and
      {{ companyName }} ("we," "our," or "us").
    </p>
    <p>
      We reserve the right to modify these Terms at any time. Continued use of the Service after
      changes take effect constitutes your acceptance of the updated Terms.
    </p>

    <h2>2. Description of Service</h2>
    <p>
      {{ appName }} is a cloud-based SaaS platform that allows registered users to create, manage,
      and analyze dynamic QR codes. Features include:
    </p>
    <ul>
      <li>Unlimited QR code creation with customizable destination URLs</li>
      <li>Dynamic redirect management — update destinations without reprinting</li>
      <li>QR code enable/disable controls</li>
      <li>Scan analytics and usage statistics</li>
      <li>Account and access management</li>
    </ul>
    <p>
      We may modify, suspend, or discontinue features of the Service at any time with reasonable
      notice.
    </p>

    <h2>3. User Accounts and Responsibilities</h2>
    <p>To use the Service, you must register for an account. You agree to:</p>
    <ul>
      <li>Provide accurate, complete, and current registration information</li>
      <li>Maintain the confidentiality of your login credentials</li>
      <li>Be responsible for all activity that occurs under your account</li>
      <li>Notify us immediately of any unauthorized use of your account</li>
      <li>Be at least 16 years of age (or 13 in the United States) to use the Service</li>
    </ul>
    <p>
      You are solely responsible for the destination URLs and content linked via QR codes you
      create. We do not review or endorse the content of third-party websites.
    </p>

    <h2>4. Prohibited Uses</h2>
    <p>You may not use {{ appName }} to:</p>
    <ul>
      <li>Link to or distribute illegal, harmful, threatening, or fraudulent content</li>
      <li>
        Spread malware, ransomware, spyware, adware, phishing pages, or other malicious software
      </li>
      <li>Create QR codes designed to deceive, defraud, or harm users</li>
      <li>Abuse redirect functionality to bypass security controls or content filters</li>
      <li>Generate QR codes for spam, unsolicited communications, or bulk phishing campaigns</li>
      <li>Infringe the intellectual property rights of any third party</li>
      <li>
        Engage in any activity that violates applicable local, national, or international law
      </li>
      <li>
        Attempt to gain unauthorized access to the Service, its infrastructure, or other users'
        accounts
      </li>
      <li>Scrape, crawl, or extract data from the platform without prior written consent</li>
      <li>Use the Service in any way that could impair its performance or availability</li>
    </ul>
    <p>
      We reserve the right to immediately suspend or terminate any account engaged in prohibited
      activities and to disable associated QR codes without prior notice.
    </p>

    <h2>5. Intellectual Property</h2>
    <p>
      The {{ appName }} platform — including its software, interface, design, trademarks, logos,
      and documentation — is owned by {{ companyName }} and protected by applicable intellectual
      property laws. Nothing in these Terms grants you ownership of or license to our intellectual
      property beyond what is necessary to use the Service.
    </p>
    <p>
      You retain full ownership of content you create using the Service. By using the Service, you
      grant {{ companyName }} a limited, non-exclusive, royalty-free license to store, process,
      and serve your QR code configurations solely to provide the Service.
    </p>

    <h2>6. Account Termination</h2>
    <p>
      <strong>By you:</strong> You may delete your account at any time through your account
      settings. Upon deletion, your QR codes will be permanently deactivated and your data will be
      deleted per our <router-link to="/privacy">Privacy Policy</router-link>.
    </p>
    <p>
      <strong>By us:</strong> We may suspend or permanently terminate your account without prior
      notice if we determine, at our sole discretion, that you have violated these Terms, engaged
      in fraudulent activity, or posed a risk to the Service or other users. We will attempt to
      notify you where legally permissible.
    </p>

    <h2>7. Availability of Service</h2>
    <p>
      We strive to maintain high availability and reliability, but we do not guarantee that the
      Service will be uninterrupted, error-free, or available at all times. Planned maintenance
      will be communicated in advance where possible. We are not liable for any downtime,
      interruptions, or data loss caused by factors outside our reasonable control.
    </p>

    <h2>8. Disclaimer of Warranties</h2>
    <p class="legal-caps">
      THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER
      EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY,
      FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE
      WILL MEET YOUR REQUIREMENTS, BE CONTINUOUSLY AVAILABLE, OR BE FREE OF ERRORS, VIRUSES, OR
      OTHER HARMFUL COMPONENTS.
    </p>

    <h2>9. Limitation of Liability</h2>
    <p class="legal-caps">
      TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, {{ companyName.toUpperCase() }} AND ITS
      OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
      SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL,
      ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF OR INABILITY TO USE THE SERVICE, EVEN IF
      ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL CUMULATIVE LIABILITY TO YOU SHALL NOT
      EXCEED THE GREATER OF (A) THE TOTAL FEES PAID BY YOU IN THE TWELVE MONTHS PRECEDING THE
      CLAIM, OR (B) ONE HUNDRED US DOLLARS (USD $100).
    </p>

    <h2>10. External Links and Redirects</h2>
    <p>
      QR codes created on {{ appName }} redirect end-users to URLs specified by the QR code owner.
      {{ companyName }} is not responsible for the content, accuracy, safety, legality, or privacy
      practices of any third-party website or service accessed via a QR code redirect.
    </p>
    <p>
      We reserve the right to scan, review, and block QR codes that link to content we determine
      to be harmful, illegal, or in violation of these Terms. However, we are not obligated to
      pre-screen all QR code destinations.
    </p>

    <h2>11. Governing Law</h2>
    <p>
      These Terms are governed by and construed in accordance with the laws of
      <strong>[Jurisdiction]</strong>, without regard to its conflict of law principles. Any
      dispute arising under these Terms shall be subject to the exclusive jurisdiction of the
      courts located in <strong>[Jurisdiction]</strong>. If you are an EU consumer, you may also
      have rights under the laws of your country of residence.
    </p>

    <h2>12. Changes to These Terms</h2>
    <p>
      We may update these Terms from time to time. When we make material changes, we will notify
      you by email and/or by displaying a prominent notice within the Service at least 14 days
      before the changes take effect. Your continued use of the Service after the effective date
      constitutes acceptance of the updated Terms.
    </p>

    <h2>13. Contact Us</h2>
    <p>
      If you have questions about these Terms or need to report a violation, please contact us:
    </p>
    <p>
      <strong>{{ companyName }} </strong><br />
      Email: <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
    </p>
  </div>
</template>

<style scoped>
.legal-content {
  color: var(--ink);
}

.legal-meta {
  font-size: 13px;
  color: var(--muted);
  margin: 0 0 40px;
}

h2 {
  font-size: clamp(16px, 2vw, 20px);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--ink);
  margin: 40px 0 10px;
  padding-top: 32px;
  border-top: 1px solid var(--line);
}

h2:first-of-type {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}

p {
  color: var(--ink-2);
  font-size: 15px;
  line-height: 1.8;
  margin: 0 0 12px;
}

ul,
ol {
  color: var(--ink-2);
  font-size: 15px;
  line-height: 1.8;
  padding-left: 22px;
  margin: 0 0 14px;
}

li {
  margin-bottom: 4px;
}

a {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

strong {
  font-weight: 700;
  color: var(--ink);
}

.legal-caps {
  font-size: 13px;
  line-height: 1.7;
  color: var(--ink-2);
  letter-spacing: 0.01em;
}
</style>
