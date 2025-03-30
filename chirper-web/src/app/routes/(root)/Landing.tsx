import TextScroller from "@/components/misc/TextScroller";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FC } from "react";
import { Link } from "react-router-dom";

const textScrollers = [
    "Join the flock. Chirp your thoughts to the world.",
    "From trending topics to hidden gems—explore it all on Chirper.",
    "Short, sharp, and social. Chirps that connect.",
    "Where voices echo across the globe—one chirp at a time.",
    "Keep up, speak out, and stay in the loop with Chirper.",
    "A side project by marutsuki!",
];

const Landing: FC = () => {
    return (
        <section className="h-full">
            <div className="h-full flex items-center justify-around p-24">
                <div className="flex flex-col gap-4 w-96">
                    <Separator />
                    <h1 className="text-7xl font-heading">chirper.</h1>
                    <h2 className="text-xl font-heading">start chirpin..!</h2>
                    <TextScroller texts={textScrollers} />
                </div>
                <div className="flex flex-col gap-4 w-96">
                    <h2 className="text-4xl animate-pulse font-heading">
                        lets dive in<span>_</span>
                    </h2>
                    <Separator />
                    <div className="flex w-full items-end gap-4">
                        <Button
                            variant="outline"
                            className="text-xl w-48 p-6"
                            asChild
                        >
                            <Link to="/login">Login</Link>
                        </Button>
                        <Button className="text-xl w-48 p-6" asChild>
                            <Link to="/register">Register</Link>
                        </Button>
                    </div>
                </div>
            </div>

            <footer className="fixed bottom-0 p-6">© 2025 marutsuki</footer>
        </section>
    );
};

export default Landing;
