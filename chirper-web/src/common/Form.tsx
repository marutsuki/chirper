import { Button } from "@/components/ui/button";
import {
    Form as ShadCnForm,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DefaultValues, Path, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodObject, ZodRawShape, ZodSchema } from "zod";
import { ComponentProps } from "react";

type FormProps<T extends ZodRawShape, S extends ZodSchema & ZodObject<T>> = {
    schema: S;
    opts: Record<
        keyof z.output<S>,
        {
            placeholder: string;
        }
    >;
    defaultValues?: DefaultValues<z.output<S>>;
    error?: string;
    isPending?: boolean;
    onSubmit: (data: z.output<S>) => void;
};

const Form = <T extends ZodRawShape, S extends ZodSchema & ZodObject<T>>({
    schema,
    opts,
    defaultValues,
    error,
    isPending,
    onSubmit,
}: FormProps<T, S>) => {
    const form = useForm<z.infer<S>>({
        resolver: zodResolver(schema),
        defaultValues,
    });

    return (
        <section className="h-full flex flex-col justify-center items-center gap-2">
            <ShadCnForm {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormMessage>{error}</FormMessage>
                    {Object.keys(schema.shape).map((key) => {
                        const typedKey = key as Path<z.infer<S>> &
                            keyof typeof opts;
                        return (
                            <FormField
                                name={typedKey}
                                control={form.control}
                                render={({ field }) => {
                                    const typedField = field as ComponentProps<
                                        typeof Input
                                    >;
                                    return (
                                        <FormItem>
                                            <FormLabel />
                                            <FormControl>
                                                <Input
                                                    {...opts[typedKey]}
                                                    {...typedField}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                        );
                    })}
                    <Button type="submit">Register</Button>
                    {isPending && <p>Please wait...</p>}
                </form>
            </ShadCnForm>
        </section>
    );
};

export default Form;
