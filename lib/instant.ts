import {id, init, tx} from '@instantdb/react';

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID!;

type Schema = {};

export const db = init<Schema>({appId: APP_ID});

export async function seed(channel: string, user: any) {
  const channelId = id();
  const messageId = id();

  return db.transact([
    tx.channels[channelId].update({name: channel}),
    tx.messages[messageId]
      .update({
        body: `Hello ${channel}!`,
        timestamp: +new Date(),
        channelId,
        userId: user.id!,
      })
      .link({channels: channelId}),
    tx.users[user.id!].update(user).link({messages: messageId}),
  ]);
}

export async function reset(data: Record<string, any[]>) {
  const txns = Object.entries(data).flatMap(([table, rows]) =>
    rows.map((row) => tx[table][row.id!].delete())
  );

  return db.transact(txns);
}

export default db;
