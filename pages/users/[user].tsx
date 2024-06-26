import {NextPage} from 'next';
import React from 'react';
import {useRouter} from 'next/router';
import dayjs from 'dayjs';
import {Cursors, id, tx} from '@instantdb/react';
import Link from 'next/link';
import {ArrowLeftIcon, Trash2Icon} from 'lucide-react';

import {cn} from '@/lib/utils';
import {RcPerson} from '@/lib/types/rc';
import {sendZulipNotification, useProfileById} from '@/lib/api';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import db from '@/lib/instant';
import {useCombinedAuth} from '@/lib/hooks';
import Spinner from '@/components/Spinner';
import Markdown from '@/components/Markdown';
import {
  PersonAbout,
  PersonContactInfo,
  PersonOverview,
} from '@/components/Profile';
import {Label} from '@/components/ui/label';

type RcInstantUser = {
  id: string;
  email: string;
  name: string;
  image: string;
  rcId: number;
};
type RcSpacePost = {
  id: string;
  content: string;
  timestamp: number;
  profileId: number | string;
  author?: RcInstantUser | null;
};

function PostsFeed({
  posts,
  currentUser,
  onDeletePost,
}: {
  posts: RcSpacePost[];
  currentUser: RcInstantUser;
  onDeletePost: (postId: string) => void;
}) {
  if (posts.length === 0) {
    return <div className="text-sm text-zinc-400">No posts yet!</div>;
  }

  return (
    <div className="flex flex-col">
      {posts
        .sort((a, b) => b.timestamp - a.timestamp)
        .map((post) => {
          const {id: postId, author, content, timestamp} = post;
          const ts = dayjs(timestamp);
          const isToday = ts.isSame(dayjs(), 'day');
          const canDeletePost = author?.email === currentUser.email;

          return (
            <div
              key={post.id}
              className={cn(
                'group flex w-full gap-3 border-b-2 border-zinc-100 py-3 duration-500 animate-in fade-in-0'
              )}
            >
              <div className="flex-0 flex justify-end">
                {!!author ? (
                  <img
                    className="h-12 w-12 rounded-lg"
                    src={author.image}
                    alt={author.name}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-zinc-100" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex justify-between">
                  {/* This field was added later, so some users may not have it set yet :( */}
                  {author?.rcId ? (
                    <Link
                      className="mb-1 text-sm font-medium text-zinc-900"
                      href={`/users/${author.rcId}`}
                    >
                      {author?.name}
                    </Link>
                  ) : (
                    <div className="mb-1 text-sm font-medium text-zinc-900">
                      {author?.name}
                    </div>
                  )}

                  <div
                    className={cn(
                      'pt-0.5 text-xs text-zinc-300',
                      canDeletePost && 'group-hover:hidden'
                    )}
                  >
                    {isToday ? ts.format('h:mm a') : ts.format('MMM D')}
                  </div>
                  {canDeletePost && (
                    <button
                      className="hidden pt-0.5 group-hover:flex"
                      onClick={() => onDeletePost(postId)}
                    >
                      <Trash2Icon className="h-4 w-4 text-red-500" />
                    </button>
                  )}
                </div>
                <Markdown>{content}</Markdown>
              </div>
            </div>
          );
        })}
    </div>
  );
}

function displayTypingUsers(users: any[]) {
  if (users.length === 0) {
    return null;
  } else if (users.length === 1) {
    const [user] = users;

    return `${user.name} is typing...`;
  } else if (users.length === 2) {
    const [a, b] = users;

    return `${a.name} and ${b.name} are typing...`;
  } else {
    return 'Several people are typing...';
  }
}

function RcSpace({
  className,
  person,
  currentUser,
}: {
  className: string;
  person: RcPerson;
  currentUser: any;
}) {
  const [content, setPostContent] = React.useState('');
  const {isLoading, error, data} = db.useQuery({
    posts: {$: {where: {profileId: person.id}}, users: {}},
  });
  const room = db.room('rc-space', person.slug);
  const {user: me, peers, publishPresence} = room.usePresence();
  const typing = room.useTypingIndicator('post');

  React.useEffect(() => {
    if (currentUser) {
      publishPresence({
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        image: currentUser.image,
      });
    }
  }, [currentUser.id, person.id]);
  // room.useSyncPresence(
  //   {
  //     id: currentUser.id,
  //     name: currentUser.name,
  //     email: currentUser.email,
  //     image: currentUser.image,
  //   },
  //   [person.id]
  // );

  const handlePostMessage = async () => {
    try {
      if (!content) {
        return;
      }

      const postId = id();
      const txn = tx.posts[postId]
        .update({
          content,
          timestamp: +new Date(),
          profileId: person.id,
        })
        .link({users: currentUser.id});
      setPostContent('');
      await db.transact(txn);
      // TODO: verify this works as expected!
      await sendZulipNotification({
        zulipId: person.zulip_id,
        content,
      });
    } catch (e) {
      console.error('Transaction failed:', e);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const txn = tx.posts[postId].delete();

      await db.transact(txn);
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const posts = (data?.posts || []).map((post) => {
    const {users = [], ...rest} = post;
    const [author = null] = users;

    return {
      ...rest,
      author,
    };
  });

  return (
    <Cursors
      room={room}
      renderCursor={({presence}) => {
        const {id, name, image} = presence;

        return (
          <img
            key={id}
            className="h-6 w-6 rounded-b-full rounded-r-full border-2 border-blue-400"
            src={image}
            alt={name}
          />
        );
      }}
    >
      <main className={className}>
        <div className="flex w-full flex-1 flex-col gap-4 sm:flex-row">
          <div className="flex max-h-screen flex-col py-4 sm:sticky sm:top-0 sm:w-64 sm:py-12">
            <div className="flex flex-1 flex-col rounded-md border bg-white p-4">
              <PersonOverview person={person} />
              <PersonContactInfo person={person} />
              {Object.values(peers).length > 0 && (
                <div className="mt-4 border-t-2 border-zinc-100 pt-4">
                  <Label>Current Visitors</Label>
                  <div className="mt-2 flex flex-col gap-2">
                    {Object.values(peers).map((peer) => (
                      <div
                        key={peer.email}
                        className="flex items-center gap-2 duration-500 animate-in fade-in-0"
                      >
                        <img
                          className="h-6 w-6 rounded-full"
                          src={peer.image}
                          alt={peer.name}
                        />
                        <span className="text-sm text-zinc-500">
                          {peer.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-1 flex-col justify-end">
                <div className="mt-4 border-t-2 border-zinc-100 pt-2">
                  <Link href="/users">
                    <Button
                      className="flex w-full items-center gap-2"
                      size="sm"
                      variant="secondary"
                    >
                      <ArrowLeftIcon className="h-4 w-4" />
                      Back to directory
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-4 py-4 sm:py-12">
            <div className="rounded-md border border-zinc-300 bg-zinc-100 p-4 shadow">
              <Textarea
                className="bg-white"
                rows={3}
                placeholder="Write something!"
                value={content}
                onKeyDown={(e) => {
                  typing.inputProps.onKeyDown(e);

                  if (e.metaKey && e.key === 'Enter') {
                    handlePostMessage();
                  }
                }}
                onChange={(e) => setPostContent(e.target.value)}
              />
              <div className="mt-2 flex items-start justify-between">
                <span className="px-2 text-sm text-zinc-400">
                  {displayTypingUsers(typing.active)}
                </span>
                <Button size="sm" onClick={() => handlePostMessage()}>
                  Post
                </Button>
              </div>
            </div>

            <div className="rounded-md border bg-white p-4">
              <div className="mb-2 border-b-2 pb-2">
                <h2 className="text-base font-bold leading-none text-zinc-900">
                  Public Feed
                </h2>
              </div>
              {isLoading ? (
                <div className="my-4 flex items-center gap-2">
                  <Spinner className="h-4 w-4" />
                  <span className="text-sm text-zinc-400">Loading feed...</span>
                </div>
              ) : posts.length > 0 ? (
                <PostsFeed
                  posts={posts}
                  currentUser={currentUser}
                  onDeletePost={handleDeletePost}
                />
              ) : (
                <div className="my-4">
                  <span className="text-sm text-zinc-400">No posts yet!</span>
                </div>
              )}
            </div>
          </div>

          <div className="sticky top-0 hidden max-h-screen w-80 flex-col py-4 sm:py-12 lg:flex">
            <div className="flex-1 rounded-md border bg-white p-4">
              <div className="mb-2 border-b-2 pb-2">
                <h2 className="text-base font-bold leading-none text-zinc-900">
                  About
                </h2>
              </div>
              <PersonAbout person={person} />
            </div>
          </div>
        </div>
      </main>
    </Cursors>
  );
}

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const {
    user,
    status,
    isLoading: isLoadingUser,
    error: authError,
  } = useCombinedAuth();
  const profileId = router.query.user as string;

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push({pathname: '/', query: {redirect: router.asPath}});
    }
  }, [status]);

  const {data: person, isLoading, error} = useProfileById(profileId);

  return (
    <div
      className={cn(
        'flex min-h-screen w-full flex-1 flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100'
      )}
    >
      {!!user && !!person && (
        <RcSpace
          className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-4"
          person={person}
          currentUser={user}
        />
      )}
    </div>
  );
};

export default ProfilePage;
