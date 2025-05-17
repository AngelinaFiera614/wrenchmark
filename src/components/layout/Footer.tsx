
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full border-t py-6 md:py-0 border-border">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Wrenchmark. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link 
            to="/about" 
            className="text-sm text-muted-foreground hover:text-accent-teal wrenchmark-link"
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className="text-sm text-muted-foreground hover:text-accent-teal wrenchmark-link"
          >
            Contact
          </Link>
          <Link 
            to="/feedback" 
            className="text-sm text-muted-foreground hover:text-accent-teal wrenchmark-link"
          >
            Feedback
          </Link>
        </div>
      </div>
    </footer>
  );
}
