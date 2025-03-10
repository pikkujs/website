#### 1. API Key in Header (`x-api-key`)

An API key can be passed via the `x-api-key` header. Pikku will call the provided `getSessionForAPIKey` function to retrieve the user session. If the API key is present but not handled, an error will be thrown.
