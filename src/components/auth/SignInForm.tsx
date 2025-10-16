import { useState } from 'react';
import { replace, useNavigate } from 'react-router-dom';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Button from '../ui/button/Button';
import { EyeCloseIcon, EyeIcon } from '../../icons';
import { toast } from 'sonner';
import { useLogin } from '../../hooks/useLogin';

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { mutate: login, isPending } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone && !password) {
      toast.error('Iltimos, barcha maydonlarni to‘ldiring!');
      return;
    }

    login(
      { phone, password },
      {
        onSuccess: data => {
          if (data?.data) {
            localStorage.setItem('access_token', data.data);
            toast.success('Muvaffaqiyatli kirildi!');
            navigate('/admin', { replace: true });
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
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Kirish
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Kirish uchun ID va parolingizni kiriting!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    ID <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    placeholder="Enter your ID"
                    type="number"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>

                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
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

                <div>
                  <Button className="w-full" size="sm">
                    Sign in
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
