import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/dist/server';

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return <div>{user.email}</div>;
};

export default Page;
