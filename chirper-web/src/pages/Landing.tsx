import { Button } from "@/components/ui/button";
import { FC } from "react";
import { Link } from "react-router-dom";

const Landing: FC = () => {
    return (
        <section className="flex h-full items-center justify-between">
            <div className="flex flex-col gap-4">
                <h1 className="text-7xl">chirper.</h1>
                <h2 className="text-xl">Start chirpin</h2>
            </div>
            <div>
                <Button className="text-2xl">
                    <Link to="/login">Login</Link>
                </Button>
            </div>
        </section>
    );
};

export default Landing;
