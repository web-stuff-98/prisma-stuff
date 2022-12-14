import { useContext, createContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import axios, { AxiosError } from "axios";

export interface IUser {
  name: string;
  image: string;
  id: string;
  createdAt: Date;
}

const UsersContext = createContext<
  | {
      findUserData: (uid: string) => IUser;
      cacheProfileDataForUser: (uid: string, force?: boolean) => void;
    }
  | any
>(undefined);

export default function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<IUser[]>([]);

  const findUserData = useCallback(
    (uid: string) => users.find((u: IUser) => u.id === uid),
    [users]
  );

  const cacheProfileDataForUser = async (uid: string, force?: boolean) => {
    try {
      if (users.find((u: IUser) => u.id === uid) && !force) return;
      const axres = await axios({
        method: "GET",
        url: `/api/user?uid=${uid}`,
      });
      setUsers((old: IUser[]) => [
        ...old,
        { ...axres.data, createdAt: new Date(axres.data.createdAt) },
      ]);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <UsersContext.Provider value={{ findUserData, cacheProfileDataForUser }}>
      {children}
    </UsersContext.Provider>
  );
}

export const useUsers = () => useContext(UsersContext);
