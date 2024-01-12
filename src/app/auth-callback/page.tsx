// 'use client';

// import { useRouter, useSearchParams } from 'next/navigation';
// import { trpc } from '../_trpc/client';
// import { Loader2 } from 'lucide-react';
// import { useEffect } from 'react';

// const Page = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const origin = searchParams.get('origin');

//   const { data, error } = trpc.authCallback.useQuery(undefined);

//   useEffect(() => {
//     if (data?.success) {
//       // Si la requête est un succès
//       router.push(origin ? `/${origin}` : '/dashboard');
//     } else if (error?.data?.code === 'UNAUTHORIZED') {
//       // Si une erreur se produit
//       router.push(
//         'https://jeremyteurteriedocai.kinde.com/auth/cx/_:nav&m:login&psid:48211ce3f4714f7c96e2c9d3d7d35231'
//       );
//     }
//   }, [data, error, router, origin]);

//   return (
//     <div className="w-full mt-24 flex justify-center">
//       <div className="flex flex-col items-center gap-2">
//         <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
//         <h3 className="font-semibold text-xl">Setting up your account...</h3>
//         <p>You will be redirected automatically.</p>
//       </div>
//     </div>
//   );
// };

// export default Page;

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { trpc } from '../_trpc/client';
import { Loader2 } from 'lucide-react';

const Page = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const origin = searchParams.get('origin');

  trpc.authCallback.useQuery(undefined, {
    onSuccess: ({ success }) => {
      if (success) {
        // user is synced to db
        router.push(origin ? `/${origin}` : '/dashboard');
      }
    },
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
        router.push('/sign-in');
      }
    },
    retry: true,
    retryDelay: 500,
  });

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default Page;
