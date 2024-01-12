import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from './trpc';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db } from '@/db';

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    console.log("Récupération de l'utilisateur depuis Kinde :", user);

    if (!user) {
      console.error("Aucun utilisateur n'a été récupéré depuis Kinde.");
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    if (!user.id || !user.email) {
      console.error("L'utilisateur récupéré n'a pas d'ID ou d'email valide.");
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    console.log(
      `Recherche de l'utilisateur dans la base de données : ${user.id}`
    );
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) {
      console.log(
        `Création de l'utilisateur dans la base de données : ${user.id}`
      );
      try {
        const newUser = await db.user.create({
          data: {
            id: user.id,
            email: user.email,
          },
        });
        console.log('Utilisateur créé avec succès :', newUser);
      } catch (error) {
        console.error(
          "Erreur lors de la création de l'utilisateur dans la base de données :",
          error
        );
      }
    } else {
      console.log("L'utilisateur existe déjà dans la base de données.");
    }

    return { success: true };
  }),
});

export type AppRouter = typeof appRouter;

// import { TRPCError } from '@trpc/server';
// import { publicProcedure, router } from './trpc';
// import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
// import { db } from '@/db';

// export const appRouter = router({
//   authCallback: publicProcedure.query(async () => {
//     const { getUser } = getKindeServerSession();
//     const user = await getUser();

//     // Vérifier si 'user' est null
//     // if (!user) {
//     //   throw new TRPCError({ code: 'UNAUTHORIZED' });
//     // }

//     // Maintenant que nous savons que 'user' n'est pas null, on peut vérifier 'id' et 'email'
//     if (!user.id || !user.email) {
//       throw new TRPCError({ code: 'UNAUTHORIZED' });
//     }

//     // check if the user is in the database
//     const dbUser = await db.user.findFirst({
//       where: {
//         id: user.id,
//       },
//     });

//     if (!dbUser) {
//       // create user in db
//       await db.user.create({
//         data: {
//           id: user.id,
//           email: user.email,
//         },
//       });
//     }

//     return { success: true };
//   }),
// });

// export type AppRouter = typeof appRouter;
