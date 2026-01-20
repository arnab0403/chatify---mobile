import { db } from "@/firebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  status: string;
  lastSeen: any;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersCollection = collection(db, "users");
      const q = query(usersCollection);
      const snapshot = await getDocs(q);

      const usersList: User[] = [];
      snapshot.forEach((doc) => {
        usersList.push({
          uid: doc.id,
          ...doc.data(),
        } as User);
      });

      setUsers(usersList);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { users, loading, error, refetch: fetchUsers };
};
