// ============================================================
// HOTFIX — SEC-310: CORS Accepting All Origins
// Priority: P1 | SLA: 30 minutes | Reporter: Security Team
// ============================================================
//
// The API's CORS configuration is set to allow ALL origins (*).
// This means any website can make API requests on behalf of
// logged-in users. Fix to only allow our domains.
//
// ============================================================

const ALLOWED_ORIGINS = [
    'https://app.ourcompany.com',
    'https://admin.ourcompany.com',
    'http://localhost:3000',  // Dev only
];

function corsMiddleware(req) {
    const origin = req.headers.origin;

    return {
        'Access-Control-Allow-Origin': '*',  // Should check ALLOWED_ORIGINS
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
    };
}

// Test
console.log(corsMiddleware({ headers: { origin: 'https://evil-site.com' } }));
// Should NOT allow evil-site.com!
