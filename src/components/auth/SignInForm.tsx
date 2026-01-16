import { Button, Input as AntInput } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useLogin } from '../../hooks/useLogin';
import { EyeCloseIcon, EyeIcon } from '../../icons';

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { mutate: login, isPending } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone || !password) {
      toast.error('Iltimos, barcha maydonlarni to‘ldiring!');
      return;
    }

    // Teacher uchun +998 formatini qo‘shish (agar 9 raqam bo‘lsa)
    let formattedPhone = phone;
    const numeric = phone.replace(/\D/g, '');
    if (numeric.length === 9) {
      formattedPhone = '+998' + numeric;
    }

    login(
      { phone: formattedPhone, password },
      {
        onSuccess: data => {
          const role = data?.message; // ROLE_TEACHER yoki ROLE_ADMIN

          if (role === 'ROLE_TEACHER' || role === 'ROLE_ADMIN') {
            // Avvalgi user ma’lumotlarini tozalash
            localStorage.clear();

            // Yangi user ma’lumotlarini saqlash
            localStorage.setItem('access_token', data.data);
            localStorage.setItem('token_expiry', new Date(Date.now() + 30 * 60 * 1000).toISOString());
            localStorage.setItem('user_id', formattedPhone);
            localStorage.setItem('role', role);

            toast.success(`Siz tizimga muvaffaqqiyatli kirdingiz !`);

            // Role bo‘yicha yo‘naltirish
            if (role === 'ROLE_TEACHER') {
              navigate('/teacher', { replace: true });
            } else if (role === 'ROLE_ADMIN') {
              navigate('/admin', { replace: true });
            }
          } else {
            toast.error('Login yoki parol xato!');
          }
        },
        onError: () => {
          toast.error('Server bilan ulanishda xatolik!');
        },
      }
    );
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl transition-all duration-500 hover:shadow-blue-200 dark:hover:shadow-blue-900 p-10">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Kirish
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Kirish uchun ID yoki telefon va parolingizni kiriting!
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* ID / Phone input */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  ID / Phone <span className="text-error-500">*</span>
                </label>
                <AntInput
                  placeholder="Enter your ID or Phone"
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  size="large"
                  className="rounded-md"
                />
              </div>

              {/* Password input */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password <span className="text-error-500">*</span>
                </label>
                <div className="relative">
                  <AntInput
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    size="large"
                    className="rounded-md pr-10"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>

              {/* Submit button */}
              <div>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full !text-[1rem] !py-5"
                  loading={isPending}
                >
                  Sign in
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
