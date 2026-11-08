// Shared helpers for talking to the backend REST API.
const API_BASE_URL = "http://localhost:8080/api/v1";

// Sends a JSON request and returns { ok, status, data }. Throws only on network failure.
async function apiRequest(path, { method = "GET", body } = {}) {
    const options = { method, headers: {} };
    if (body !== undefined) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, options);
    const text = await response.text();
    return {
        ok: response.ok,
        status: response.status,
        data: text ? JSON.parse(text) : null
    };
}

// Turns the backend's error body ({ message, fieldErrors }) into readable text.
function describeApiError(error) {
    if (!error) {
        return "Something went wrong. Please try again.";
    }
    if (error.fieldErrors && error.fieldErrors.length > 0) {
        return error.fieldErrors.map((e) => `${e.field}: ${e.message}`).join("\n");
    }
    return error.message || "Something went wrong. Please try again.";
}

// Escapes text before it is put into innerHTML, so student data can't inject markup.
function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

const SERVER_UNREACHABLE = "Cannot reach the server. Make sure the backend is running on http://localhost:8080.";
