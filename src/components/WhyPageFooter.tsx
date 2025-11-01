import React from 'react';
import Link from '@docusaurus/Link';

export default function WhyPageFooter() {
  return (
    <>
      <hr style={{ margin: '3rem 0' }} />

      <section>
        <h2>Get Started</h2>

        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: 'var(--ifm-color-emphasis-700)' }}>
          Ready to try Pikku? Get up and running in 5 minutes.
        </p>

        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <Link to="/docs" className="button button--primary button--lg" style={{ boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', transition: 'all 0.2s' }}>
            Get Started
          </Link>
        </div>
      </section>

      <hr style={{ margin: '3rem 0' }} />

      <section>
        <h2>Learn More</h2>

        <p style={{ marginBottom: '1.5rem' }}>
          Dive deeper into why Pikku gives you the flexibility to succeed.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '3rem' }}>
          <Link to="/why/architecture-flexibility" className="text-primary hover:underline font-medium">
            → Architecture Flexibility
          </Link>
          <Link to="/why/vendor-lock-in" className="text-primary hover:underline font-medium">
            → Avoiding Vendor Lock-In
          </Link>
          <Link to="/why/typescript-everywhere" className="text-primary hover:underline font-medium">
            → TypeScript Everywhere
          </Link>
          <Link to="/why/protocol-unification" className="text-primary hover:underline font-medium">
            → Protocol Unification
          </Link>
        </div>
      </section>

      <hr style={{ margin: '3rem 0' }} />

      <section>
        <h2>Questions or Feedback?</h2>

        <ul style={{ marginTop: '1rem' }}>
          <li>💻 <Link to="https://github.com/pikkujs/pikku">GitHub</Link></li>
          <li>💬 <Link to="https://github.com/pikkujs/pikku/discussions">Discussions</Link></li>
          <li>📚 <Link to="https://pikku.dev/docs">Documentation</Link></li>
          <li>🐦 <Link to="https://x.com/pikkujs">Twitter/X</Link></li>
          <li>💬 <Link to="https://discord.gg/z7r4rhwJ">Discord</Link></li>
        </ul>
      </section>
    </>
  );
}
