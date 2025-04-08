import { FC, useState, useTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import Form from "@/components/form/Form";
import { IoChevronBackSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { backend } from "@/config";

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
            const error = await fetch(backend("/auth/register"), {
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
        <section className="h-full flex flex-col justify-center items-center gap-2 w-96 place-self-center">
            <div className="w-full">
                <Button variant="ghost" onClick={() => navigate("/")}>
                    <IoChevronBackSharp />
                    Back
                </Button>
            </div>
            <RegisterForm
                title="Register an account"
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
                submitLabel="Register"
                onSubmit={onSubmit}
            />

            <div className="flex justify-center w-full items-center">
                Have an account already?
                <Button asChild variant="link">
                    <Link to="/login">Login</Link>
                </Button>
            </div>
        </section>
    );
};

export default Register;
