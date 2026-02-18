import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const StepFinal = () => {
  const ButtonRouting = [
    {
      title: "Masuk",
      href: "/login",
    },
    {
      title: "Daftar",
      href: "/register",
    },
  ];
  return (
    <div className="w-full bg-primary min-h-screen flex justify-center items-center text-background">
      <div className="absolute z-0">
        <svg
          width="416"
          height="891"
          viewBox="0 0 416 891"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M378.5 953.407C-550.5 701.407 666.5 637.871 366.5 720.907C138.5 784.014 790 -411.593 -12.5 151.407"
            stroke="white"
            stroke-width="0.5"
          />
        </svg>
      </div>
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col space-y-2 items-center text-center px-6 z-1"
      >
        <Image
          alt="icon"
          src={"/images/logo.svg"}
          width={100}
          height={100}
          className="aspect-square rounded-full"
        />
        <h1 className="text-2xl font-bold">Mulai Gunakan NutriPlate</h1>
        <p className="font-light text-lg">
          Masuk atau buat akun untuk mulai memantau gizi dan pertumbuhan anak.
        </p>
        {ButtonRouting.map((items, key) => (
          <Link key={key} href={items.href} className="w-full max-w-sm">
            <ButtonWrapper variant={"splash"} className="w-full font-bold">
              {items.title}
            </ButtonWrapper>
          </Link>
        ))}
      </motion.section>
    </div>
  );
};

export default StepFinal;
