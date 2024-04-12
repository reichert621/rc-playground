import axios from 'axios';
import useSWR, {SWRConfiguration} from 'swr';

import {Restaurant} from '@/lib/types/eats';
import {HubVisitor, RcPerson} from '@/lib/types/rc';

export async function fetchHubVisitors(): Promise<HubVisitor[]> {
  const {data} = await axios.get('/api/visitors');

  return data.visitors || [];
}

export function useHubVisitors(options: SWRConfiguration = {}) {
  const {data, error, isLoading, isValidating, mutate} = useSWR<HubVisitor[]>(
    ['/api/visitors'],
    () => fetchHubVisitors(),
    options
  );

  return {data, error, isLoading, isValidating, mutate};
}

export async function fetchCurrentBatchProfiles(): Promise<RcPerson[]> {
  const {data} = await axios.get('/api/profiles');

  return data.profiles || [];
}

export function useCurrentBatchProfiles(options: SWRConfiguration = {}) {
  const {data, error, isLoading, isValidating, mutate} = useSWR<RcPerson[]>(
    ['/api/profiles'],
    () => fetchCurrentBatchProfiles(),
    options
  );

  return {data, error, isLoading, isValidating, mutate};
}

export async function fetchProfileById(id: string): Promise<RcPerson> {
  const {data} = await axios.get(`/api/profiles/${id}`);

  return data.profile;
}

export function useProfileById(
  id: string | null,
  options: SWRConfiguration = {}
) {
  const {data, error, isLoading, isValidating, mutate} = useSWR<RcPerson>(
    ['/api/profiles', id],
    id ? () => fetchProfileById(id) : null,
    options
  );

  return {data, error, isLoading, isValidating, mutate};
}

export async function fetchUberEatsDeals(): Promise<Restaurant[]> {
  const {data} = await axios.get('/api/eats');

  return data.deals || [];
}

export function useUberEatsDeals(options: SWRConfiguration = {}) {
  const {data, error, isLoading, isValidating, mutate} = useSWR<Restaurant[]>(
    ['/api/eats'],
    () => fetchUberEatsDeals(),
    options
  );

  return {data, error, isLoading, isValidating, mutate};
}

export async function sendZulipNotification(params: {
  zulipId: number;
  content: string;
}): Promise<RcPerson> {
  const {data} = await axios.post(`/api/zulip/notify`, params);

  return data;
}
