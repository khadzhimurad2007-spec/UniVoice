import { loginWithGoogle, logout, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Home() {
    const [user] = useAuthState(auth);

    return (
        <div>
            <h1>Главная страница UniVoice</h1>
            {user ? (
                <>
                    <p>Привет, {user.displayName}</p>
                    <button onClick={logout}>Выйти</button>
                </>
            ) : (
                <button onClick={loginWithGoogle}>Войти через Google</button>
            )}
        </div>
    );
}
