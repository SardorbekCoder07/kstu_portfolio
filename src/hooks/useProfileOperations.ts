// src/hooks/useProfileOperations.ts
import { useQuery } from "@tanstack/react-query";
import { fetchProfile, Profile } from "../api/pagesApi/profileApi";

export const useProfile = () => {
  return useQuery<Profile, Error>({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
