import axios from 'axios';

const ZULIP_BOT_EMAIL = process.env.ZULIP_BOT_EMAIL!;
const ZULIP_API_KEY = process.env.ZULIP_API_KEY!;

const api = axios.create({
  baseURL: 'https://recurse.zulipchat.com/api/v1',
  auth: {
    username: ZULIP_BOT_EMAIL,
    password: ZULIP_API_KEY,
  },
});

export async function fetchZulipUserById(userId: string) {
  const {data} = await api.get(`/users/${userId}`);

  return data.user;
}
