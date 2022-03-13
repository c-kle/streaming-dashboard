import { useMutation } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../lib/apiClient';
import { useAuth } from '../lib/hooks/useAuth';

export const LoginPage = () => {
  const { setToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { mutate: login } = useMutation(auth, {
    onSuccess: ({ session_token }) => {
      setToken(session_token);

      const from = (location.state as any)?.from?.pathname || '/';

      navigate(from, { replace: true });
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const identifiant = formData.get('username') as string;
    const password = formData.get('password') as string;

    login({ identifiant, password });
  };

  return (
    <div className="chi-main__content">
      <form onSubmit={handleSubmit}>
        <div className="chi-form__item">
          <label className="chi-label" htmlFor="username">
            Username
          </label>
          <input type="text" className="chi-input" name="username" id="username" />
        </div>
        <div className="chi-form__item">
          <label className="chi-label" htmlFor="password">
            Password
          </label>
          <input type="text" className="chi-input" name="password" id="password" />
        </div>
        <div className="chi-form__item">
          <div className="chi-main__header-end">
            <input className="chi-button -primary" type="submit" value="Log in" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
