import React from 'react';

export function AIDisclaimer() {
  return (
    <div className="admonition admonition-info alert alert--info margin-bottom--md">
      <div className="admonition-heading mb-0 pb-0">
        <h5 className='flex items-center gap-2'>
          <span className="admonition-icon">
            <svg viewBox="0 0 14 16" width="14" height="16">
              <path fillRule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path>
            </svg>
          </span>
          AI Generated Content
        </h5>
      </div>
      <div className="admonition-content">
        🤖 This documentation was generated with AI assistance. Please <a href="https://github.com/pikkujs/pikku/issues">report any issues</a> you find.
      </div>
    </div>
  );
}