import axios from 'axios';

const token = process.env.RC_API_KEY;

const rc = axios.create({
  baseURL: 'https://www.recurse.com/api/v1',
  headers: {Authorization: `Bearer ${token}`},
});

export async function fetchProfiles(params: Record<string, any> = {}) {
  const {data} = await rc.get('/profiles', {params});

  return data;
}

export async function fetchProfileById(
  id: string | number,
  params: Record<string, any> = {}
) {
  const {data} = await rc.get(`/profiles/${id}`, {params});

  return data;
}

export async function fetchHubVisits(params: Record<string, any> = {}) {
  const {data} = await rc.get('/hub_visits', {params});

  return data;
}
