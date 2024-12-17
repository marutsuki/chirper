import { FC, useState, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import Form from "@/common/Form";

type RegisterRequest = {
    username: string;
    email: string;
    password: string;
};

const shape = {
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    email: z.string().email(),
    password: z.string().min(4),
};

const formSchema = z.object(shape);

const RegisterForm = Form<typeof shape, typeof formSchema>;

const Register: FC = () => {
    const navigate = useNavigate();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState();

    const onSubmit = (req: RegisterRequest) => {
        startTransition(async () => {
            const error = await fetch("http://localhost:3000/auth/register", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(req),
            });
            if (!error.ok) {
                const { message } = await error.json();
                setError(message);
                return;
            }
            navigate("/home");
        });
    };
    return (
        <section className="h-full flex flex-col justify-center items-center gap-2">
            <RegisterForm
                schema={formSchema}
                opts={{
                    username: {
                        placeholder: "Username",
                    },
                    email: {
                        placeholder: "Email",
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

export default Register;
