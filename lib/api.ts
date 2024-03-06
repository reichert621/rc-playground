import axios from 'axios';
import useSWR, {SWRConfiguration} from 'swr';

export type CurrentLocation = {
  id: number;
  name: string;
  short_name: string;
};

export type RcBatch = {
  id: number;
  name: string;
  short_name: string;
  alt_name: string;
};

export type Stint = {
  id: number;
  type: string;
  title: null | string;
  for_half_batch: boolean;
  in_progress: boolean;
  start_date: string; // ISO date format
  end_date: string; // ISO date format
  batch: RcBatch;
};

export type RcPerson = {
  id: number;
  first_name: string;
  last_name: string;
  name: string;
  name_hl: string;
  email: string;
  github: string;
  employer_role: null | string;
  twitter: string;
  pronouns: string;
  unformatted_phone_number: null | string;
  zoom_url: string;
  zulip_id: number;
  linkedin: null | string;
  image_path: string;
  phone_number: string;
  slug: string;
  joy_of_computing_username: null | string;
  bio_rendered: string;
  bio_match: null;
  bio_hl: null;
  bio_truncated: null;
  before_rc_rendered: string;
  before_rc_match: null;
  before_rc_hl: string;
  before_rc_truncated: string;
  during_rc_rendered: string;
  during_rc_match: null;
  during_rc_hl: string;
  during_rc_truncated: string;
  interests_rendered: string;
  interests_match: null;
  interests_hl: string;
  interests_truncated: string;
  employer_info_rendered: string;
  employer_info_match: null;
  employer_info_hl: null;
  employer_info_truncated: null;
  github_rendered: string;
  github_match: null;
  github_hl: string;
  github_truncated: string;
  phone_number_rendered: string;
  phone_number_match: null;
  phone_number_hl: null;
  phone_number_truncated: null;
  email_rendered: string;
  email_match: null;
  email_hl: string;
  email_truncated: string;
  current_location: CurrentLocation;
  stints: Stint[];
};

export type HubVisitor = {
  person: RcPerson;
  date: string; // ISO date format
  app_data: object;
  notes: string;
  created_at: string; // ISO date and time format
  updated_at: string; // ISO date and time format
  created_by_app: string;
  updated_by_app: string;
};

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
