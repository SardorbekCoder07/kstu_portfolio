import { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axiosClient from "../../api/axiosClient";
import image from "../../assets/images/image.png";
import { useQueryClient } from "@tanstack/react-query";

/* ================= TYPES ================= */
interface UserData {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  biography: string | null;
  input: string | null;
  imageUrl: string | null;
  role: string;
  fileUrl: string | null;
  profession: string | null;
  lavozimName: string | null;
  departmentName: string | null;
  qualification: string | null;
  research: string | null;
  award: string | null;
  consultation: string | null;
  nazorat: string | null;
  publication: string | null;
}

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  const queryClient = useQueryClient(); // 🔥 MUHIM
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);

  /* ================= LOGOUT ================= */
  const logoutFn = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_cache");

    queryClient.clear(); // 🔥 React Query cache tozalanadi

    toast.success("Siz tizimdan muvaffaqiyatli chiqdingiz");
    navigate("/signin");
  };

  /* ================= USER FETCH ================= */
  useEffect(() => {
    const cached = localStorage.getItem("user_cache");

    if (cached) {
      setUser(JSON.parse(cached));
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axiosClient.get("/user");
        setUser(response.data.data);
        localStorage.setItem(
          "user_cache",
          JSON.stringify(response.data.data)
        );
      } catch (error) {
        console.error("User fetch error:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full h-8 w-8 border-2 border-black">
          <img
            src={user?.imageUrl || image}
            className="w-full h-full object-cover"
            alt="User"
          />
        </span>

        <span className="block mr-1 font-medium text-theme-sm">
          {user?.fullName || "Foydalanuvchi"}
        </span>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[280px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="mt-0.5 block text-lg text-gray-500 dark:text-gray-400">
            ID: {user?.id ?? "Noma’lum"}
          </span>
        </div>

        <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
          {["fullName", "email", "phone"].map((key) => {
            const value = user?.[key as keyof UserData];
            return value ? (
              <p key={key}>
                <strong>{key}:</strong> {value}
              </p>
            ) : null;
          })}
        </div>

        <button
          onClick={logoutFn}
          className="flex items-center gap-3 px-3 py-2 mt-4 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
        >
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}
