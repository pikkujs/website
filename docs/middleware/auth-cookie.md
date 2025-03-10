#### 3. Cookie

Pikku can retrieve a session via cookies. The cookie name can be set via the `cookieNames` option. In cases where the cookie name is determined by the host, use the `cookieNameIsOrigin` option.

Once the cookie is located, Pikku calls `getSessionForCookieValue` to retrieve the user session.
