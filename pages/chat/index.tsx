import {NextPage} from 'next';
import React from 'react';
import {useRouter} from 'next/router';
import {id, tx} from '@instantdb/react';
import dayjs from 'dayjs';

import {cn} from '@/lib/utils';
import db, {seed, reset} from '@/lib/instant';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {useCombinedAuth} from '@/lib/hooks';
import Spinner from '@/components/Spinner';
import FadeIn from '@/components/FadeIn';
import Markdown from '@/components/Markdown';

function ChatMessages({
  className,
  channelId,
  currentUser,
}: {
  className?: string;
  channelId: string;
  currentUser: any;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [text, setText] = React.useState('');
  const {data, isLoading, error} = db.useQuery({
    messages: {users: {}, $: {where: {channelId}}},
  });
  const count = data?.messages.length ?? 0;
  const messages = (data?.messages || [])
    .filter((m) => {
      // TODO: figure out how to handle this better with Instant
      return m.users.length > 0;
    })
    .map((message) => {
      const [author] = message.users;

      return {...message, author};
    });

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({});
    }
  }, [scrollRef, count]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text) {
      return;
    }

    const messageId = id();
    const txn = tx.messages[messageId]
      .update({
        body: text,
        timestamp: +new Date(),
        userId: currentUser.id,
        channelId,
      })
      .link({users: currentUser.id});

    db.transact(txn);
    setText('');
  };

  return (
    <div className={cn('relative flex flex-1 flex-col justify-end', className)}>
      {error ? (
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-4 px-4 py-8 sm:px-8">
          <div className="text-red-500">
            Error loading messages: {error.message}
          </div>
        </div>
      ) : isLoading || !data ? (
        <FadeIn direction="none" delay={500}>
          <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-4 px-4 py-8 sm:px-8">
            <Spinner className="h-8 w-8 text-zinc-400" />
            <div className="text-sm text-zinc-300">Loading messages...</div>
          </div>
        </FadeIn>
      ) : (
        <div className="max-h-screen overflow-auto pb-20 pt-8 duration-200 animate-in fade-in-0">
          {messages.map((message: any, index: number) => {
            const {author} = message;
            const prev = messages[index - 1];
            const isSameAuthor = !!prev && author.id === prev.author.id;
            const ts = dayjs(message.timestamp);
            const isToday = ts.isSame(dayjs(), 'day');

            return (
              <div
                key={message.id}
                className={cn(
                  'mx-auto flex w-full max-w-4xl gap-4 px-0 sm:px-8',
                  isSameAuthor ? 'mt-2' : 'mt-4'
                )}
              >
                <div className="flex-0 flex w-16 justify-end">
                  {!isSameAuthor && (
                    <img
                      className="h-12 w-12 rounded-lg"
                      src={author.image}
                      alt={author.name}
                    />
                  )}
                </div>

                <div className="flex-1">
                  {!isSameAuthor && (
                    <div className="mb-1 text-sm font-medium text-zinc-900">
                      {author.name}
                    </div>
                  )}
                  <Markdown
                    onImageLoaded={() => scrollRef.current?.scrollIntoView({})}
                  >
                    {message.body}
                  </Markdown>
                </div>

                <div className="w-16 pt-0.5 text-xs text-zinc-300">
                  {isToday ? ts.format('h:mm a') : ts.format('MMM D')}
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>
      )}
      <div className="absolute bottom-0 w-full">
        <form
          key={channelId}
          className="mx-auto flex w-full max-w-4xl items-center gap-0 bg-white bg-opacity-60 px-4 py-4 backdrop-blur sm:gap-4 sm:px-8"
          onSubmit={handleSendMessage}
        >
          <div className="flex-0 hidden w-16 sm:flex" />
          <Input
            className="flex-1 bg-white"
            placeholder="Type a message..."
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex-0 hidden w-16 sm:flex" />
        </form>
      </div>
    </div>
  );
}

const ChatPage: NextPage = () => {
  const router = useRouter();
  const {isLoading, error, data} = db.useQuery({
    channels: {messages: {users: {}}},
    users: {},
  });
  const {
    user,
    status,
    isLoading: isLoadingUser,
    error: authError,
  } = useCombinedAuth();
  const [selectedChannelId, setSelectedChannelId] = React.useState<
    string | null
  >(null);

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status]);

  React.useEffect(() => {
    if (isLoading || !data) {
      return;
    }

    const {channels = []} = data;
    const isInvalidSelection =
      !selectedChannelId || !channels.some((c) => c.id === selectedChannelId);

    if (channels.length > 0 && isInvalidSelection) {
      setSelectedChannelId(channels[0].id);
    }
  }, [isLoading, data]);

  if (!data || !user) {
    return null;
  }

  const {channels = [], users = []} = data;

  return (
    <div
      className={cn(
        'flex min-h-screen w-full flex-1 flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100'
      )}
    >
      <div className="flex flex-1">
        <div className="hidden w-64 max-w-64 flex-1 flex-col border-r border-zinc-100 bg-zinc-50/80 p-4 sm:flex">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-400">
            Channels
          </h2>
          <ul className="flex w-full flex-1 flex-col items-start gap-1">
            {channels.map((channel) => {
              const isSelected = channel.id === selectedChannelId;

              return (
                <li key={channel.id} className="w-full">
                  <button
                    className={cn(
                      'flex w-full items-center justify-start rounded-md border border-zinc-100 px-3 py-2 text-sm font-medium',
                      isSelected
                        ? 'bg-zinc-800 text-zinc-100'
                        : 'bg-white text-zinc-700'
                    )}
                    onClick={() => setSelectedChannelId(channel.id)}
                  >
                    {channel.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <main className="flex flex-1 flex-col bg-white">
          {selectedChannelId && (
            <ChatMessages channelId={selectedChannelId} currentUser={user} />
          )}
        </main>
        <div className="hidden flex-1 flex-col border-l border-zinc-100 bg-zinc-50/80 p-4 lg:flex lg:w-72 lg:max-w-72">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-400">
            Users
          </h2>
          <ul className="flex w-full flex-1 flex-col items-start gap-1">
            {users.map((user) => {
              return (
                <li
                  key={user.id}
                  className="w-full text-sm font-medium text-zinc-600"
                >
                  {user.name}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
