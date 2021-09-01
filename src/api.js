import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export const useApi = (url, options = {}) => {
  const { getAccessTokenSilently, logout } = useAuth0();
  const [state, setState] = useState({
    error: null,
    loading: true,
    data: null,
    status: 200
  });
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
      	const { ...fetchOptions } = options;

        const accessToken = await getAccessTokenSilently({ audience: "https://staging.flytternu.io" });

        const res = await fetch(url, {
          ...fetchOptions,
          headers: {
            ...fetchOptions.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const json = await res.json();

        if (res.status === 401) {
          logout({ returnTo: window.location.origin });
          return;
        }

        setState({
          ...state,
          data: json['data'],
          error: null,
          loading: false,
          status: res.status
        });
      } catch (error) {
        setState({
          ...state,
          error,
          loading: false,
        });
      }
    })();
  }, [refreshIndex]);

  return {
    ...state,
    refresh: () => setRefreshIndex(refreshIndex + 1),
  };
};

export const post = async (url, body, accessToken) => {
	const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(body)
    };

    return await fetch(url, requestOptions);
}

export const patch = async (url, body, accessToken) => {
  const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(body)
    };

    return await fetch(url, requestOptions);
}

export const deleteRequest = async (url, accessToken) => {
  const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` }
    };

    return await fetch(url, requestOptions);
}