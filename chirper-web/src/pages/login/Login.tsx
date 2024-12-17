import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FC, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type LoginRequest = {
    username: string;
    password: string;
};

const Login: FC = () => {
    const navigate = useNavigate();
    const form = useForm<LoginRequest>();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState(null);

    const onSubmit = (req: LoginRequest) => {
        startTransition(async () => {
            const error = await fetch("http://localhost:3000/auth/login", {
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
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormMessage>{error}</FormMessage>
                    <FormField
                        name="username"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel />
                                <FormControl>
                                    <Input placeholder="Username" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="password"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel />
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Login</Button>
                    {isPending && <p>Please wait...</p>}
                </form>
            </Form>
        </section>
    );
};

export default Login;
