import { useQuery } from "@tanstack/react-query";
import { fetchProfile, Profile } from "../api/pagesApi/profileApi"; // yo'lni to'g'rilang

export const useProfile = () => {
  return useQuery<Profile, Error>({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    staleTime: 1000 * 60 * 5, // 5 daqiqa
    retry: 2,
  });
};