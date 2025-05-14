
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Wrenchmark. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link 
            to="/about" 
            className="text-sm text-muted-foreground hover:text-primary"
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Contact
          </Link>
          <Link 
            to="/feedback" 
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Feedback
          </Link>
        </div>
      </div>
    </footer>
  );
}
