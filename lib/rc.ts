import axios, {AxiosInstance} from 'axios';

const PERSONAL_API_KEY = process.env.RC_API_KEY;

export const api = (token = PERSONAL_API_KEY) => {
  return axios.create({
    baseURL: 'https://www.recurse.com/api/v1',
    headers: {Authorization: `Bearer ${token}`},
  });
};

export async function fetchProfiles(
  token: string,
  params: Record<string, any> = {}
) {
  const {data} = await api(token).get('/profiles', {
    params,
  });

  return data;
}

export async function fetchCurrentUser(
  token: string,
  params: Record<string, any> = {}
) {
  const {data} = await api(token).get(`/profiles/me`, {
    params,
  });

  return data;
}

export async function fetchProfileById(
  id: string | number,
  token: string,
  params: Record<string, any> = {}
) {
  const {data} = await api(token).get(`/profiles/${id}`, {
    params,
  });

  return data;
}

export async function fetchHubVisits(
  token: string,
  params: Record<string, any> = {}
) {
  const {data} = await api(token).get('/hub_visits', {
    params,
  });

  return data;
}

export async function fetchBatches(
  token: string,
  params: Record<string, any> = {}
) {
  const {data} = await api(token).get('/batches', {params});

  return data;
}

export default class RcApiClient {
  token: string;
  http: AxiosInstance;

  constructor(token: string) {
    this.token = token;
    this.http = axios.create({
      baseURL: 'https://www.recurse.com/api/v1',
      headers: {Authorization: `Bearer ${token}`},
    });
  }

  async fetchProfiles(params: Record<string, any> = {}) {
    const {data} = await this.http.get('/profiles', {
      params,
    });

    return data;
  }

  async fetchCurrentUser(params: Record<string, any> = {}) {
    const {data} = await this.http.get(`/profiles/me`, {
      params,
    });

    return data;
  }

  async fetchProfileById(
    id: string | number,
    params: Record<string, any> = {}
  ) {
    const {data} = await this.http.get(`/profiles/${id}`, {
      params,
    });

    return data;
  }

  async fetchBatches(params: Record<string, any> = {}) {
    const {data} = await this.http.get('/batches', {params});

    return data;
  }

  async fetchHubVisits(params: Record<string, any> = {}) {
    const {data} = await this.http.get('/hub_visits', {
      params,
    });

    return data;
  }
}
