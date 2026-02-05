import ChildFallback from "@/components/fallback/child.fallback";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { InputWrapper } from "@/components/wrapper/InputWrapper";
import { Icon } from "@iconify/react/dist/iconify.js";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BellIcon, Book, MailIcon, MessageSquareIcon } from "lucide-react";
const DaftarBalitaKaderSection = () => {
  return (
    <section className="w-full min-h-screen flex items-center justify-start flex-col overflow-x-hidden relative p-2 space-y-2">
      <div className="w-full flex items-center justify-between ">
        <h1 className="text-2xl font-bold">Daftar Balita</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Icon
              icon="iconoir:filter-solid"
              width={24}
              height={24}
              className="text-primary cursor-pointer"
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-52">
            <DropdownMenuCheckboxItem>
              <MailIcon className="mr-2 h-4 w-4" />
              0-12 bulan
            </DropdownMenuCheckboxItem>

            <DropdownMenuCheckboxItem>
              <MessageSquareIcon className="mr-2 h-4 w-4" />
              1-3 tahun
            </DropdownMenuCheckboxItem>

            <DropdownMenuCheckboxItem>
              <BellIcon className="mr-2 h-4 w-4" />
              3-5 tahun
            </DropdownMenuCheckboxItem>

            <DropdownMenuCheckboxItem>
              <Book className="mr-2 h-4 w-4" />
              Laki-laki
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>
              <Book className="mr-2 h-4 w-4" />
              Perempuan
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-full ">
        <InputWrapper
          className="w-full border rounded-lg"
          placeholder="cari disini...."
          rightIcon={
            <Icon
              icon="material-symbols:search-rounded"
              width="24"
              height="24"
            />
          }
        />
        <div className="w-full grid grid-cols-4  mt-2 gap-2 grid-rows-1">
          <ButtonWrapper>Semua</ButtonWrapper>
          <ButtonWrapper>Normal</ButtonWrapper>
          <ButtonWrapper>Berisiko</ButtonWrapper>
          <ButtonWrapper>Gizi Buruk</ButtonWrapper>
        </div>
      </div>
      <div className="w-full">
        <ChildFallback />
      </div>
    </section>
  );
};

export default DaftarBalitaKaderSection;
