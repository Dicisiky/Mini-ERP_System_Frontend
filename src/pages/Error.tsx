import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import { NavLink } from "react-router";

const Error = () => {
  return (
    <section>
      <div className="container flex items-center px-6 py-12 mx-auto">
        <div>
          <p className="text-sm font-medium text-primary">404 error</p>
          <h1 className="mt-3 text-2xl font-semibold text-gray-800">
            We can’t find that page
          </h1>
          <p className="mt-4 text-gray-500">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>

          <div className="flex items-center mt-6 gap-x-3">
            <Button>
              <NavLink to="/" className="flex items-center gap-2">
                <HomeIcon className="w-5" />
                Go home
              </NavLink>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Error;
