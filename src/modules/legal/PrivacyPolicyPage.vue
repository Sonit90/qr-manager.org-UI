<script setup lang="ts">
import LegalPage from '@/modules/legal/LegalPage.vue'

const appName = import.meta.env.VITE_APP_NAME
const companyName = import.meta.env.VITE_COMPANY_NAME
const contactEmail = import.meta.env.VITE_CONTACT_EMAIL
</script>

<template>
  <LegalPage title="Privacy Policy">
    <div class="legal-content">
      <p class="legal-meta">Last Updated: May 20, 2026</p>

      <h2>1. Introduction</h2>
      <p>
        {{ companyName }} ("we," "our," or "us") operates {{ appName }}, a SaaS platform for
        creating and managing dynamic QR codes. This Privacy Policy describes how we collect, use,
        store, and protect your personal information when you access or use our services.
      </p>
      <p>
        By using {{ appName }}, you agree to the collection and use of information in accordance
        with this policy. If you are located in the European Economic Area (EEA), this policy
        fulfills our obligations under the General Data Protection Regulation (GDPR).
      </p>

      <h2>2. Information We Collect</h2>

      <h3>Account Information</h3>
      <p>
        When you register, we collect your email address, optional display name, and a securely
        hashed password. We do not store plaintext passwords.
      </p>

      <h3>QR Code Data</h3>
      <p>
        We store the QR code configurations you create, including destination URLs, labels, and
        status (active/disabled). You retain full control over this content. We are not responsible
        for the content of third-party websites linked via your QR codes.
      </p>

      <h3>Analytics and Scan Data</h3>
      <p>
        When one of your QR codes is scanned, we may collect anonymized technical information to
        generate analytics, including:
      </p>
      <ul>
        <li>Timestamp of the scan</li>
        <li>Approximate geographic location (country/region level)</li>
        <li>Device type (mobile, desktop, tablet)</li>
        <li>Browser and operating system</li>
        <li>Referring URL, if available</li>
      </ul>
      <p>
        This data is collected to provide you with usage insights. No personally identifiable
        information about QR code scanners is shared with you or third parties.
      </p>

      <h3>Technical and Security Data</h3>
      <p>
        We automatically collect IP addresses, session tokens, and standard web server log data for
        the purposes of security, fraud prevention, and service performance. This data is not used
        for marketing purposes.
      </p>

      <h2>3. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide, operate, and improve the {{ appName }} platform</li>
        <li>Authenticate your identity and protect your account</li>
        <li>Generate and display QR scan analytics</li>
        <li>Send transactional emails (account activation, password reset)</li>
        <li>Detect and prevent abuse, fraud, and unauthorized access</li>
        <li>Comply with applicable legal obligations</li>
      </ul>
      <p>We do not sell your personal data to third parties.</p>

      <h2>4. Cookies and Tracking Technologies</h2>
      <p>We use the following types of cookies and similar technologies:</p>
      <ul>
        <li>
          <strong>Essential cookies</strong> — required for authentication, session management, and
          core platform functionality. These cannot be disabled without impairing service.
        </li>
        <li>
          <strong>Functional cookies</strong> — used to remember your preferences and settings.
        </li>
        <li>
          <strong>Analytics cookies</strong> — used to understand how the platform is used and where
          improvements can be made. These may be disabled through your browser settings or our
          cookie consent controls.
        </li>
      </ul>
      <p>
        You may disable non-essential cookies via your browser settings at any time. Note that
        disabling essential cookies will prevent you from logging in.
      </p>

      <h2>5. QR Scan Analytics</h2>
      <p>
        {{ appName }} provides analytics for QR codes you own. When someone scans your QR code, our
        systems record anonymized metadata about that scan event. This analytics data is associated
        with your account so you can track usage trends.
      </p>
      <p>
        We do not profile individual scanners, and the data collected is not used to identify
        specific individuals. Analytics data is retained for the lifetime of your account.
      </p>

      <h2>6. Data Retention</h2>
      <p>We retain your personal data for as long as your account is active. Specifically:</p>
      <ul>
        <li>Account data is retained until you delete your account</li>
        <li>QR code configurations and analytics are retained for the account lifetime</li>
        <li>
          After account deletion, all personal data is purged within 30 days, except where retention
          is required by law
        </li>
        <li>
          Server logs containing IP addresses are retained for up to 90 days for security purposes
        </li>
      </ul>
      <p>
        You may request deletion of your data at any time by contacting us at
        <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a
        >.
      </p>

      <h2>7. Data Security</h2>
      <p>
        We implement industry-standard technical and organizational security measures, including:
      </p>
      <ul>
        <li>Encrypted data transmission via TLS/HTTPS</li>
        <li>Securely hashed passwords (bcrypt or equivalent)</li>
        <li>JWT-based authentication with short-lived tokens and refresh rotation</li>
        <li>Role-based access controls</li>
        <li>Regular security assessments</li>
      </ul>
      <p>
        No method of transmission over the internet is 100% secure. While we strive to protect your
        data, we cannot guarantee absolute security. In the event of a data breach affecting your
        rights, we will notify you as required by applicable law.
      </p>

      <h2>8. Third-Party Services</h2>
      <p>
        We may engage third-party service providers to assist with hosting, infrastructure, email
        delivery, and analytics. These providers act as data processors and are bound by data
        processing agreements that require them to handle your data only as instructed by us and in
        compliance with applicable law.
      </p>
      <p>
        {{ appName }} is not responsible for the content, privacy practices, or terms of third-party
        websites accessed via QR codes created by our users. We encourage users to review the
        privacy policies of any third-party sites they visit.
      </p>

      <h2>9. Your Rights Under GDPR</h2>
      <p>
        If you are located in the European Economic Area, you have the following rights regarding
        your personal data:
      </p>
      <ul>
        <li>
          <strong>Right to Access</strong> — request a copy of the personal data we hold about you
        </li>
        <li>
          <strong>Right to Rectification</strong> — request correction of inaccurate or incomplete
          data
        </li>
        <li>
          <strong>Right to Erasure</strong> ("right to be forgotten") — request deletion of your
          personal data
        </li>
        <li>
          <strong>Right to Data Portability</strong> — receive your data in a structured,
          machine-readable format
        </li>
        <li>
          <strong>Right to Object</strong> — object to processing based on legitimate interests
        </li>
        <li>
          <strong>Right to Restriction</strong> — request that we limit processing of your data in
          certain circumstances
        </li>
        <li>
          <strong>Right to Withdraw Consent</strong> — where processing is based on consent, you may
          withdraw at any time
        </li>
      </ul>
      <p>
        To exercise any of these rights, contact us at
        <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a
        >. We will respond within 30 days. You also have the right to lodge a complaint with your
        local data protection authority.
      </p>

      <h2>10. International Data Transfers</h2>
      <p>
        Your data may be processed in countries outside the European Economic Area. Where such
        transfers occur, we ensure appropriate safeguards are in place, including Standard
        Contractual Clauses (SCCs) approved by the European Commission, to maintain the same level
        of data protection as required within the EEA.
      </p>

      <h2>11. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. When we make material changes, we will
        notify you by email or by displaying a prominent notice on the platform prior to the change
        taking effect. The "Last Updated" date at the top of this page reflects the most recent
        revision. Continued use of the service after changes take effect constitutes acceptance of
        the updated policy.
      </p>

      <h2>12. Contact Us</h2>
      <p>For privacy-related inquiries, data access requests, or to exercise your GDPR rights:</p>
      <p>
        <strong>{{ companyName }}</strong>
        <br />
        Email: <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
      </p>
    </div>
  </LegalPage>
</template>
