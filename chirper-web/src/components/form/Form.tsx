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
    title?: string;
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
    submitLabel?: string;
    onSubmit: (data: z.output<S>) => void;
};

const Form = <T extends ZodRawShape, S extends ZodSchema & ZodObject<T>>({
    title,
    schema,
    opts,
    defaultValues,
    error,
    isPending,
    onSubmit,
    submitLabel = "Submit",
}: FormProps<T, S>) => {
    const form = useForm<z.infer<S>>({
        resolver: zodResolver(schema),
        defaultValues,
    });

    return (
        <section className="w-full max-w-64 flex flex-col items-start gap-4">
            {title && <h1 className="text-xl">{title}</h1>}
            <ShadCnForm {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="h-full flex flex-col justify-center items-end gap-2 w-full"
                >
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
                                        <FormItem className="w-64">
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
                    <Button type="submit">{submitLabel}</Button>
                    {isPending && <p>Please wait...</p>}
                </form>
            </ShadCnForm>
        </section>
    );
};

export default Form;
