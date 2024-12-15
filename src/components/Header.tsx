import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { FC, ReactNode } from "react";


const Header: FC<HeaderProps> = ({ children, className }) => {
  return (
    <div className={cn("header", className)}>
      <Link href="/" className="md:flex-1">
        <Image
          src="/assets/icons/logo.svg"
          width={120}
          height={32}
          className="hidden md:block"
          alt=""
        />
        <Image
          src="/assets/icons/logo-icon.svg"
          width={32}
          height={32}
          className="mr-2 md:hidden"
          alt=""
        />
      </Link>
      {children}
    </div>
  );
};

export default Header;
