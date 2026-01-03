import { Icon } from "@iconify/react/dist/iconify.js";
import { ChevronLeft, ImagePlus } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { FormCreateChild } from "@/types/form/child.form";
import UploadsTrigger from "@/utils/uploadTrigger";

interface FormCreateChildProps {
  router: AppRouterInstance;
  formCreateChild: FormCreateChild;
  setFormCreateChild: React.Dispatch<React.SetStateAction<FormCreateChild>>;
  preview: string | null;
  onChangeAva: (e: any) => void;
  isPending: boolean;
  onCreate: () => void;
  onRemovePreview: () => void;
}
const FormCreateChildSection: React.FC<FormCreateChildProps> = ({
  router,
  formCreateChild,
  setFormCreateChild,
  preview,
  onChangeAva,
  isPending,
  onCreate,
  onRemovePreview,
}) => {
  return (
    <div className="w-full min-h-screen flex flex-col p-2 space-y-2 overflow-y-auto">
      <div className="w-full flex justify-start items-center">
        <ChevronLeft size={40} onClick={() => router.back()} />
        <h1 className="text-2xl font-extrabold">Tambah Data Anak</h1>
      </div>

      <div className="w-full  rounded-lg border flex flex-col ">
        <div className="w-full p-2 bg-primary  rounded-lg flex  items-start">
          <Icon
            icon="ph:baby"
            width={30}
            height={30}
            className="text-background"
          />
          <h1 className="text-lg text-background font-semibold">Data Diri</h1>
        </div>
        <div className="w-full p-2 space-y-2 ">
          <h1 className="text-lg font-bold">Nama Lengkap</h1>
          <Input
            placeholder="Masukkan Nama Lengkap Anak"
            required
            type="text"
            value={formCreateChild.fullName}
            onChange={(e) => {
              setFormCreateChild((prev) => ({
                ...prev,
                fullName: e.target.value,
              }));
            }}
          />

          <h1 className="text-lg font-bold">Tempat/Tanggal Lahir</h1>
          <div className="w-full flex gap-2 justify-between items-center">
            <Input
              placeholder="Tempat Lahir"
              type="text"
              required
              value={formCreateChild.placeOfBirth}
              onChange={(e) =>
                setFormCreateChild((prev) => ({
                  ...prev,
                  placeOfBirth: e.target.value,
                }))
              }
            />
            <Input
              placeholder="hr/bln/thn"
              type="date"
              required
              value={formCreateChild.dateOfBirth}
              onChange={(e) =>
                setFormCreateChild((prev) => ({
                  ...prev,
                  dateOfBirth: e.target.value,
                }))
              }
            />
          </div>
          <h1 className="text-lg font-bold">Jenis Kelamin</h1>
          <Select
            onValueChange={(value) => {
              setFormCreateChild((prev) => ({
                ...prev,
                gender: value,
              }));
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Jenis Kelamin" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Peran</SelectLabel>
                <SelectItem value="MALE">Laki - Laki</SelectItem>
                <SelectItem value="FEMALE">Perempuan</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <h1 className="text-lg font-bold">Foto Anak</h1>
          <div className="w-full border border-primary h-full rounded-lg border-dashed p-10">
            {!preview ? (
              <UploadsTrigger
                accept="image/*"
                multiple={false}
                onChange={(e) => onChangeAva(e)}
              >
                <Button
                  type="button"
                  variant={"ghost"}
                  className="w-full h-full flex flex-col"
                >
                  <ImagePlus size={200} />
                  <label className="text-lg font-semibold">
                    Upload Foto Category
                  </label>
                </Button>
              </UploadsTrigger>
            ) : (
              <div className="w-full flex justify-center flex-col items-center space-y-3">
                {preview && (
                  <UploadsTrigger
                    accept="image/*"
                    multiple={false}
                    onChange={(e) => onChangeAva(e)}
                  >
                    <Image
                      alt="preview"
                      src={preview}
                      width={150}
                      height={150}
                      className="aspect-square object-cover rounded-full "
                    />
                  </UploadsTrigger>
                )}
                <div className="w-full flex justify-center">
                  <Button
                    className="w-auto border-2 border-dashed "
                    variant={"ghost"}
                    onClick={() => onRemovePreview()}
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full  rounded-lg border flex flex-col  ">
        <div className="w-full p-2 bg-[#2979FF]  rounded-lg flex   items-center justify-start">
          <Icon
            icon="streamline-flex:health-care-2-remix"
            width="24"
            height="24"
            className="text-background"
          />
          <h1 className="text-lg text-background font-semibold">
            Profile Kesehatan Anak
          </h1>
        </div>
        <div className="w-full p-2 space-y-2 ">
          <div className="w-full flex gap-2 justify-between items-center">
            <div className="w-full flex flex-col justify-start items-start">
              <h1 className="text-lg font-bold">Berat Lahir</h1>
              <Input
                placeholder="kg"
                type="number"
                required
                value={formCreateChild.profileChild.birthWeightKg}
                onChange={(e) =>
                  setFormCreateChild((prev) => ({
                    ...prev,
                    profileChild: {
                      ...prev.profileChild,
                      birthWeightKg:
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                    },
                  }))
                }
              />
            </div>
            <div className="w-full flex flex-col justify-start items-start">
              <h1 className="text-lg font-bold">Tinggi Lahir</h1>
              <Input
                placeholder="cm"
                type="number"
                value={formCreateChild.profileChild.birthHeightCm}
                onChange={(e) =>
                  setFormCreateChild((prev) => ({
                    ...prev,
                    profileChild: {
                      ...prev.profileChild,
                      birthHeightCm:
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                    },
                  }))
                }
              />
            </div>
          </div>
          <h1 className="text-lg font-bold">Alergi Makanan</h1>
          <Input
            placeholder="Masukkan Alergi makanan anak (optional)"
            value={formCreateChild.profileChild.allergicFoods}
            onChange={(e) =>
              setFormCreateChild((prev) => ({
                ...prev,
                profileChild: {
                  ...prev.profileChild,
                  allergicFoods:
                    e.target.value === "" ? undefined : Array(e.target.value),
                },
              }))
            }
          />
          <p className="font-light text-sm">
            Pisahkan Dengan Tanda Koma (Contoh: susu, tepung, dll)
          </p>

          <h1 className="text-lg font-bold">Catatan Kesehatan</h1>
          <div className="w-full ">
            <Textarea
              placeholder="Masukan Catatan Kesehatan Anak"
              value={formCreateChild.profileChild.chronicConditions}
              onChange={(e) =>
                setFormCreateChild((prev) => ({
                  ...prev,
                  profileChild: {
                    ...prev.profileChild,
                    chronicConditions:
                      e.target.value === "" ? undefined : Array(e.target.value),
                  },
                }))
              }
            />
          </div>
          <h1 className="text-lg font-bold">Usia Kehamilan Saat Lahir</h1>
          <Input
            placeholder="minggu (contoh: 38)"
            type="number"
            value={formCreateChild.profileChild.pregnancyAgeWeeks ?? ""}
            onChange={(e) =>
              setFormCreateChild((prev) => ({
                ...prev,
                profileChild: {
                  ...prev.profileChild,
                  pregnancyAgeWeeks:
                    e.target.value === "" ? undefined : Number(e.target.value),
                },
              }))
            }
          />

          <div className="w-full grid grid-cols-2 grid-rows-1 gap-2  ">
            <div className="w-full">
              <h1 className="text-sm font-bold">Jenis Pemberian Makan</h1>
              <Select
                value={formCreateChild.profileChild.feedingType}
                onValueChange={(value) =>
                  setFormCreateChild((prev) => ({
                    ...prev,
                    profileChild: {
                      ...prev.profileChild,
                      feedingType: value,
                    },
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Jenis Pemberian Makan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="ASI">ASI</SelectItem>
                    <SelectItem value="SUSU_FORMULA">Susu Formula</SelectItem>
                    <SelectItem value="CAMPURAN">Campuran</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full">
              <h1 className="text-sm font-bold ">Tingkat Aktivitas Anak</h1>

              <Select
                value={formCreateChild.profileChild.activityLevel}
                onValueChange={(value) =>
                  setFormCreateChild((prev) => ({
                    ...prev,
                    profileChild: {
                      ...prev.profileChild,
                      activityLevel: value,
                    },
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Tingkat Aktivitas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="RENDAH">Rendah</SelectItem>
                    <SelectItem value="SEDANG">Sedang</SelectItem>
                    <SelectItem value="TINGGI">Tinggi</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full  rounded-lg border flex flex-col  ">
        <div className="w-full p-2 bg-[#00856C]  rounded-lg flex   items-center justify-start">
          <Icon
            icon="fa7-solid:child"
            width="28"
            height="28"
            className="text-background"
          />
          <h1 className="text-lg text-background font-semibold">
            Kondisi Sekarang
          </h1>
        </div>
        <div className="w-full p-4 space-y-4">
          <div className="w-full grid grid-cols-2 grid-rows-1 gap-2">
            <div className="w-full">
              <label className="text-lg font-bold">Berat Sekarang :</label>
              <Input
                placeholder="Kg"
                required
                value={formCreateChild.profileChild.baselineWeightKg}
                onChange={(e) =>
                  setFormCreateChild((prev) => ({
                    ...prev,
                    profileChild: {
                      ...prev.profileChild,
                      baselineWeightKg:
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                    },
                  }))
                }
              />
            </div>
            <div className="w-full">
              <label className="text-lg font-bold">Tinggi Sekarang :</label>
              <Input
                placeholder="cm"
                required
                value={formCreateChild.profileChild.baselineHeightCm}
                onChange={(e) =>
                  setFormCreateChild((prev) => ({
                    ...prev,
                    profileChild: {
                      ...prev.profileChild,
                      baselineHeightCm:
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                    },
                  }))
                }
              />
            </div>
          </div>
          <div className="w-full">
            <label htmlFor="IMT" className="text-lg font-bold">
              Indeks Massa Tubuh
            </label>
            <Input
              className="w-full"
              placeholder="kg/m"
              value={formCreateChild.profileChild.baselineBmi}
              onChange={(e) =>
                setFormCreateChild((prev) => ({
                  ...prev,
                  profileChild: {
                    ...prev.profileChild,
                    baselineBmi:
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                  },
                }))
              }
            />
          </div>
          <div className="w-full">
            <label htmlFor="IMT" className="text-lg font-bold">
              Skor Z Dasar
            </label>
            <Input
              className="w-full"
              placeholder="kg/m"
              value={formCreateChild.profileChild.baselineZscore}
              onChange={(e) =>
                setFormCreateChild((prev) => ({
                  ...prev,
                  profileChild: {
                    ...prev.profileChild,
                    baselineZscore:
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                  },
                }))
              }
            />
          </div>
        </div>
      </div>

      <div className="w-full h-full ">
        <Button
          onClick={() => onCreate()}
          className="w-full flex justify-center items-center "
          variant={"btn"}
          disabled={
            !formCreateChild.fullName ||
            !formCreateChild.gender ||
            !formCreateChild.dateOfBirth ||
            isPending
          }
        >
          <Icon icon="ix:success" width="28" height="28" />
          <h1 className="text-lg">
            {isPending ? <Spinner /> : "Simpan Data Anak"}
          </h1>
        </Button>
      </div>
    </div>
  );
};

export default FormCreateChildSection;
