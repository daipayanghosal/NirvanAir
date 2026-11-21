# NirvanAir Security & CWE Compliance Manifest

## 1. Zero-Trust API Key Architecture

- **Server-Side Secret Isolation**: `GEMINI_API_KEY` is loaded exclusively inside Python runtime environments via `.env` or system environment variables (`backend/config.py`).
- **Zero Client Bundle Leakage**: Production bundles (`dist/assets/*.js`) are scanned to guarantee zero hardcoded API keys, bearer tokens, or internal secrets are compiled into client assets.
- **Client Fallback Mode**: If the user desires direct client-side execution in standalone settings, keys are stored solely in their private browser `localStorage` and never sent to third-party endpoints.

---

## 2. Common Weakness Enumeration (CWE) Mitigation Matrix

| CWE ID | Vulnerability Category | NirvanAir Mitigation Strategy |
| :--- | :--- | :--- |
| **CWE-209** | Information Exposure Through Error Message | Production API catch blocks log stack traces internally to server logs while returning sanitized, generic JSON error envelopes (`detail="Failed to generate AI response"`) to the client. |
| **CWE-79** | Cross-Site Scripting (XSS) | AI markdown responses and pollutant descriptions are rendered using safe React JSX bindings with DOM text escaping and sanitized component trees. Raw `dangerouslySetInnerHTML` is strictly prohibited. |
| **CWE-918** | Server-Side Request Forgery (SSRF) | Geolocation and Open-Meteo requests strictly validate latitude (-90 to +90) and longitude (-180 to +180) float bounds before issuing external HTTP requests. |
| **CWE-352** | Cross-Site Request Forgery (CSRF) | All mutating actions are stateless JSON `POST` requests guarded by CORS headers and decoupled from ambient cookie authentication. |
| **CWE-400** | Uncontrolled Resource Consumption | Geolocation search inputs are truncated to 100 characters; simulation inputs clamp household counts to 10,000 to prevent CPU denial-of-service. |

---

## 3. Network & Transport Security

- **Strict CORS Headers**: FastAPI enforces explicit origins and methods (`GET`, `POST`, `OPTIONS`).
- **HTTPS Enforced**: External API calls (Open-Meteo, Google Generative Language API) enforce TLS 1.3 transport security.
