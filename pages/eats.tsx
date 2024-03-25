import {NextPage} from 'next';
import React from 'react';

import {cn} from '@/lib/utils';
import {useUberEatsDeals} from '@/lib/api';

const BogoEatsPage: NextPage = () => {
  const {
    data: items = [],
    isLoading,
    error,
  } = useUberEatsDeals({
    // poll every 60s
    refreshInterval: 60000,
  });

  return (
    <div
      className={cn(
        'flex min-h-screen w-full flex-1 flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100'
      )}
    >
      <main className="mx-auto w-full max-w-4xl flex-1 bg-white px-8 py-12 dark:bg-zinc-900">
        <h1 className="bg-gradient-to-br from-zinc-950 to-zinc-500 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl sm:leading-snug md:text-6xl md:leading-snug">
          BOGO Deals
        </h1>
        <p className="text-lg text-zinc-500">
          Uber<span className="font-semibold">Eats</span> BOGO deals near the
          hub!
        </p>

        <div className="my-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {items.map((item, index) => {
            const {name, image = [], deals = []} = item;
            const [low, mid] = image;

            return (
              <div
                key={index}
                className="overflow-auto rounded border shadow-sm duration-500 animate-in fade-in-0 hover:shadow"
              >
                <div className="h-48 overflow-hidden">
                  <img className="w-full object-cover" src={mid || low} />
                </div>
                <div className="p-2">
                  <h3 className="mb-2 truncate text-lg font-medium text-zinc-900">
                    {name}
                  </h3>
                  <div className="mb-1 mt-2 space-y-1 border-t pt-2">
                    {deals.map((deal) => {
                      const {title, price, imageUrl} = deal;

                      return (
                        <div
                          key={deal.uuid}
                          className="flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-2">
                            {imageUrl ? (
                              <img
                                className="h-8 w-8 rounded-lg object-cover"
                                src={imageUrl}
                              />
                            ) : (
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 text-zinc-400"
                                  viewBox="0 0 512 512"
                                >
                                  <path
                                    d="M57.49 47.74l368.43 368.43a37.28 37.28 0 010 52.72h0a37.29 37.29 0 01-52.72 0l-90-91.55a32 32 0 01-9.2-22.43v-5.53a32 32 0 00-9.52-22.78l-11.62-10.73a32 32 0 00-29.8-7.44h0a48.53 48.53 0 01-46.56-12.63l-85.43-85.44C40.39 159.68 21.74 83.15 57.49 47.74z"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-linejoin="round"
                                    stroke-width="32"
                                  />
                                  <path
                                    d="M400 32l-77.25 77.25A64 64 0 00304 154.51v14.86a16 16 0 01-4.69 11.32L288 192M320 224l11.31-11.31a16 16 0 0111.32-4.69h14.86a64 64 0 0045.26-18.75L480 112M440 72l-80 80M200 368l-99.72 100.28a40 40 0 01-56.56 0h0a40 40 0 010-56.56L128 328"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="32"
                                  />
                                </svg>
                              </div>
                            )}
                            <div className="font-normal text-zinc-700">
                              {title}
                            </div>
                          </div>
                          <div className="text-sm font-normal text-zinc-600">
                            ${(price / 100).toFixed(2)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default BogoEatsPage;
