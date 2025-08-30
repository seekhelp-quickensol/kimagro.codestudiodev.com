import React, {
  FunctionComponent,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";

type AuthContextType = {
  user: UserInfoResponse;
  login: (access_code: string) => void;
  logout: () => void;
};

type Key = {
  kty: string;
  e: string;
  kid: string;
  n: string;
};

type JwkResponse = {
  keys: Key[];
};

type OIDCResponse = {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  token_endpoint_auth_methods_supported: string[];
  jwks_uri: string;
  userinfo_endpoint: string;
  response_types_supported: string[];
  grant_types_supported: string[];
  revocation_endpoint: string;
  revocation_endpoint_auth_methods_supported: string[];
  introspection_endpoint: string;
  introspection_endpoint_auth_methods_supported: string[];
  subject_types_supported: string[];
  id_token_signing_alg_values_supported: string[];
  scopes_supported: string[];
};

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  scope: string;
  id_token: string;
  token_type: string;
  expires_in: number;
};

type UserInfoResponse = {
  sub: string;
  aud: string[];
  nbf: number;
  scope: string[];
  iss: string;
  exp: number;
  iat: number;
  user: string;
  authorities: string[];
};

type Config = {
  oidc_url?: string;
  jwks_url?: string;
  token_url?: string;
  redirect_url?: string;
  authorize_url?: string;
  user_info_url?: string;
  refresh_token_url?: string;
  revoke_token_url?: string;
  grant?: string;
  scope?: string;
  credentials?: {
    client_id: string;
    client_secret: string;
  };
};

let conf: Config;

export const initializeAuthguard = (config: Config) => {
  if (!conf) {
    conf = config;
  } else {
    throw new Error("Config parameters are not correct");
  }
};

export const getJWKS = async () => {
  if (conf.jwks_url) {
    const res = await axios.get<JwkResponse>(conf.jwks_url, {
      headers: {
        Accept: "application/json",
      },
    });
    return res;
  } else {
    throw new Error("JWKS URI not found");
  }
};

export const getOIDC = async () => {
  if (conf.oidc_url) {
    const res = await axios.get<OIDCResponse>(conf.oidc_url, {
      headers: {
        Accept: "application/json",
      },
    });
    return res;
  } else {
    throw new Error("OIDC URI not found");
  }
};

export const getAuthorizationUrl = () => {
  if (
    conf.authorize_url &&
    conf.credentials?.client_id &&
    conf.scope &&
    conf.redirect_url
  ) {
    return `${conf.authorize_url}?response_type=code&client_id=${conf.credentials?.client_id}&scope=${conf.scope}&redirect_uri=${conf.redirect_url}`;
  } else {
    throw new Error(
      "Authguard app is not initialized with required parameters. Call initializeAuthguard() first."
    );
  }
};

export const getAuthorizationCodeAccessToken = async (access_code: string) => {
  if (
    conf.token_url &&
    conf.credentials &&
    conf.redirect_url &&
    conf.grant &&
    access_code
  ) {
    const res = await axios.post<TokenResponse>(conf.token_url, null, {
      params: {
        redirect_uri: conf.redirect_url,
        grant_type: conf.grant,
        code: access_code,
      },
      auth: {
        username: conf.credentials.client_id,
        password: conf.credentials.client_secret,
      },
    });
    return res;
  } else {
    throw new Error(
      "Authguard app is not initialized with required parameters. Call initializeAuthguard() first."
    );
  }
};

export const getClientCredentialsAccessToken = async () => {
  if (conf.token_url && conf.credentials && conf.scope && conf.grant) {
    const res = await axios.post<TokenResponse>(conf.token_url, null, {
      params: {
        grant_type: conf.grant,
        scope: conf.scope,
      },
      auth: {
        username: conf.credentials.client_id,
        password: conf.credentials.client_secret,
      },
    });
    return res;
  } else {
    throw new Error(
      "Authguard app is not initialized with required parameters. Call initializeAuthguard() first."
    );
  }
};

export const getUserInfo = async (bearer: string) => {
  if (conf.user_info_url && bearer) {
    const res = await axios.get<UserInfoResponse>(conf.user_info_url, {
      headers: {
        Accept: "application/json",
        Authorization: `bearer ${bearer}`,
      },
    });
    return res;
  } else {
    throw new Error(
      "Authguard app is not initialized with required parameters. Call initializeAuthguard() first."
    );
  }
};

export const refreshToken = async (refresh_token: string) => {
  if (conf.refresh_token_url && conf.credentials && refresh_token) {
    const res = await axios.post<TokenResponse>(conf.refresh_token_url, null, {
      params: {
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      },
      auth: {
        username: conf.credentials.client_id,
        password: conf.credentials.client_secret,
      },
    });
    return res;
  } else {
    throw new Error(
      "Authguard app is not initialized with required parameters. Call initializeAuthguard() first."
    );
  }
};

export const revokeToken = async (access_token: string) => {
  if (conf.revoke_token_url && conf.credentials && access_token) {
    const res = await axios.post(conf.revoke_token_url, null, {
      params: {
        token: access_token,
      },
      auth: {
        username: conf.credentials.client_id,
        password: conf.credentials.client_secret,
      },
    });
    return res;
  } else {
    throw new Error(
      "Authguard app is not initialized with required parameters. Call initializeAuthguard() first."
    );
  }
};

export const AuthguardContext = createContext({});

export const useAuthguard = () =>
  useContext(AuthguardContext) as AuthContextType;

interface Props {
  loader?: React.ReactNode | null;
  children: React.ReactNode;
}

export const Provider: FunctionComponent<Props> = ({ loader, children }) => {
  const [user, setUser] = useState<UserInfoResponse>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    code && login(code);
  }, []);

  const fetchUser = async () => {
    const _token = localStorage.getItem("token");
    if (_token && _token != "") {
      const userData = await getUserInfo(_token);
      setUser(userData.data);
    }
    setLoading(false);
  };

  const login = async (access_code: string) => {
    const tokenData = await getAuthorizationCodeAccessToken(access_code);
    localStorage.setItem("token", tokenData.data.access_token);
    fetchUser();
    window.history.pushState({}, document.title, window.location.pathname);
  };

  const logout = async () => {
    setUser(undefined);
    const _token = localStorage.getItem("token");
    if (_token && _token != "") {
      revokeToken(_token);
    }
    localStorage.removeItem("token");
  };

  return (
    <AuthguardContext.Provider value={{ user, logout, login }}>
      {!loading ? children : <div>{loader}</div>}
    </AuthguardContext.Provider>
  );
};
