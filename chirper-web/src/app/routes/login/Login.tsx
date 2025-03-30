import Form from "@/common/Form";
import { FC, useState, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "@/app/AuthContext";

const shape = {
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(4),
};
const formSchema = z.object(shape);

const LoginForm = Form<typeof shape, typeof formSchema>;

const Login: FC = () => {
    const navigate = useNavigate();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>();
    const { login } = useAuth();

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        startTransition(async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/auth/login",
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        method: "POST",
                        body: JSON.stringify(data),
                    }
                );

                if (!response.ok) {
                    const { message } = await response.json();
                    setError(message);
                    return;
                }

                const { token } = await response.json();
                login(token);
                navigate("/home");
            } catch (err) {
                setError("An error occurred during login");
                console.error(err);
            }
        });
    };
    return (
        <section className="h-full flex flex-col justify-center items-center gap-2">
            <LoginForm
                schema={formSchema}
                opts={{
                    username: {
                        placeholder: "Username",
                    },
                    password: {
                        placeholder: "Password",
                    },
                }}
                error={error}
                isPending={isPending}
                onSubmit={onSubmit}
            />
        </section>
    );
};

export default Login;
