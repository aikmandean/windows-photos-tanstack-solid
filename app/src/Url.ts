
export const apiRoot = "http://localhost:8080/api"
export const apiBasic = apiRoot + "/basic"

export async function fetchJson(url = "", body = {}, options = {}) {
    return fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        ...options
    }).then(r => r.json())
} 