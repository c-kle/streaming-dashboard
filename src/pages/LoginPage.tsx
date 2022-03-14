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
      <div className="chi-grid">
        <div className="chi-col -w--4 -o--4">
          <div className="chi-card">
            <div className="chi-card__content">
              <form onSubmit={handleSubmit}>
                <div className="chi-form__item -my--3">
                  <label className="chi-label" htmlFor="username">
                    Username
                  </label>
                  <input type="text" className="chi-input" name="username" id="username" />
                </div>
                <div className="chi-form__item -my--3">
                  <label className="chi-label" htmlFor="password">
                    Password
                  </label>
                  <input type="password" className="chi-input" name="password" id="password" />
                </div>
                <div className="-my--3 -d--flex -justify-content--end">
                  <input className="chi-button -primary" type="submit" value="Log in" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
