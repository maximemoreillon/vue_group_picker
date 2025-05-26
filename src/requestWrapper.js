import axios from "axios";
import VueCookies from "vue-cookies";

// Get JWT token from cookies/localStorage
function getJwtToken() {
  return (
    VueCookies.get("jwt") ||
    VueCookies.get("token") ||
    localStorage.getItem("jwt")
  );
}

export function useFetch(url, params = {}, accessToken = null) {
  const token = accessToken || getJwtToken();

  return axios.get(url, {
    params,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
