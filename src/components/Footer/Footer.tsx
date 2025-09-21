import { SquareArrowOutUpRight } from "lucide-react";

interface FooterProps {
  emoji?: string;
}

const Footer = ({ emoji = "👾" }: FooterProps) => {
  return (
    <footer className="row-start-3 flex gap-4 sm:gap-6 flex-wrap items-center justify-center px-4">
      <a
        className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-sm"
        href="https://www.damir.fun"
        target="_blank"
        rel="noopener noreferrer"
      >
        <SquareArrowOutUpRight size={15} /> Created by Damir {emoji}
      </a>
    </footer>
  );
};

export default Footer;
