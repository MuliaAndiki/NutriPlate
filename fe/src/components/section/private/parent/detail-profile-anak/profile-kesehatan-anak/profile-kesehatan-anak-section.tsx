import { Icon } from "@iconify/react/dist/iconify.js";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormUpdateProfileChild } from "@/types/form/child.form";

interface ProfileKesehatanAnakSectionProps {
  router: AppRouterInstance;
  formUpdateProfileChild: FormUpdateProfileChild | null;
  setFormUpdateProfileChild: React.Dispatch<
    React.SetStateAction<FormUpdateProfileChild | null>
  >;
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdate: () => void;
}
const ProfileKesehatanAnakHeroSection: React.FC<
  ProfileKesehatanAnakSectionProps
> = ({
  router,
  formUpdateProfileChild,
  setFormUpdateProfileChild,
  isEdit,
  setIsEdit,
  onUpdate,
}) => {
  return (
    <div className="w-full min-h-screen flex justify-start items-center flex-col p-2 space-y-2">
      <div className="w-full flex justify-start items-center">
        <ChevronLeft className="scale-120" onClick={() => router.back()} />
        <h1 className="text-2xl font-bold">Profile Kesehatan Anak</h1>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onUpdate();
        }}
        className="w-full h-auto"
      >
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
                  disabled={!isEdit}
                  value={formUpdateProfileChild?.profileChild.birthWeightKg}
                  onChange={(e) =>
                    setFormUpdateProfileChild((prev) => {
                      if (!prev) return prev;
                      return {
                        ...prev,
                        profileChild: {
                          ...prev.profileChild,
                          birthWeightKg:
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                        },
                      };
                    })
                  }
                />
              </div>
              <div className="w-full flex flex-col justify-start items-start">
                <h1 className="text-lg font-bold">Tinggi Lahir</h1>
                <Input
                  placeholder="cm"
                  type="number"
                  disabled={!isEdit}
                  value={formUpdateProfileChild?.profileChild.birthHeightCm}
                  onChange={(e) =>
                    setFormUpdateProfileChild((prev) => {
                      if (!prev) return prev;
                      return {
                        ...prev,
                        profileChild: {
                          ...prev.profileChild,
                          birthHeightCm:
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                        },
                      };
                    })
                  }
                />
              </div>
            </div>
            <h1 className="text-lg font-bold">Alergi Makanan</h1>
            <Input
              placeholder="Masukkan Alergi makanan anak (optional)"
              value={formUpdateProfileChild?.profileChild.allergicFoods}
              disabled={!isEdit}
              onChange={(e) =>
                setFormUpdateProfileChild((prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    profileChild: {
                      ...prev.profileChild,
                      allergicFoods:
                        e.target.value === ""
                          ? undefined
                          : Array(e.target.value),
                    },
                  };
                })
              }
            />

            <h1 className="text-lg font-bold">Catatan Kesehatan</h1>
            <div className="w-full ">
              <Textarea
                placeholder="Masukan Catatan Kesehatan Anak"
                disabled={!isEdit}
                value={formUpdateProfileChild?.profileChild.chronicConditions}
                onChange={(e) =>
                  setFormUpdateProfileChild((prev) => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      profileChild: {
                        ...prev.profileChild,
                        chronicConditions:
                          e.target.value === ""
                            ? undefined
                            : Array(e.target.value),
                      },
                    };
                  })
                }
              />
            </div>
            <h1 className="text-lg font-bold">Usia Kehamilan Saat Lahir</h1>
            <Input
              placeholder="minggu (contoh: 38)"
              type="number"
              disabled={!isEdit}
              value={
                formUpdateProfileChild?.profileChild.pregnancyAgeWeeks ?? ""
              }
              onChange={(e) =>
                setFormUpdateProfileChild((prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    profileChild: {
                      ...prev.profileChild,
                      pregnancyAgeWeeks:
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                    },
                  };
                })
              }
            />

            <div className="w-full grid grid-cols-2 grid-rows-1 gap-2  ">
              <div className="w-full">
                <h1 className="text-sm font-bold">Jenis Pemberian Makan</h1>
                <Select
                  disabled={!isEdit}
                  key={formUpdateProfileChild?.profileChild.feedingType ?? ""}
                  value={formUpdateProfileChild?.profileChild.feedingType ?? ""}
                  onValueChange={(value) =>
                    setFormUpdateProfileChild((prev) => {
                      if (!prev) return prev;
                      return {
                        ...prev,
                        profileChild: {
                          ...prev.profileChild,
                          feedingType: value,
                        },
                      };
                    })
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
                  disabled={!isEdit}
                  key={formUpdateProfileChild?.profileChild.activityLevel ?? ""}
                  value={
                    formUpdateProfileChild?.profileChild.activityLevel ?? ""
                  }
                  onValueChange={(value) =>
                    setFormUpdateProfileChild((prev) => {
                      if (!prev) return prev;
                      return {
                        ...prev,
                        profileChild: {
                          ...prev.profileChild,
                          activityLevel: value,
                        },
                      };
                    })
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
                  disabled={!isEdit}
                  value={formUpdateProfileChild?.profileChild.baselineWeightKg}
                  onChange={(e) => {
                    setFormUpdateProfileChild((prev) => {
                      if (!prev) return prev;
                      return {
                        ...prev,
                        profileChild: {
                          ...prev.profileChild,
                          baselineWeightKg:
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                        },
                      };
                    });
                  }}
                />
              </div>
              <div className="w-full">
                <label className="text-lg font-bold">Tinggi Sekarang :</label>
                <Input
                  placeholder="cm"
                  required
                  disabled={!isEdit}
                  value={formUpdateProfileChild?.profileChild.baselineHeightCm}
                  onChange={(e) =>
                    setFormUpdateProfileChild((prev) => {
                      if (!prev) return prev;
                      return {
                        ...prev,
                        profileChild: {
                          ...prev.profileChild,
                          baselineHeightCm:
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                        },
                      };
                    })
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
                disabled={!isEdit}
                value={formUpdateProfileChild?.profileChild.baselineBmi}
                onChange={(e) =>
                  setFormUpdateProfileChild((prev) => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      profileChild: {
                        ...prev.profileChild,
                        baselineBmi:
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value),
                      },
                    };
                  })
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
                disabled={!isEdit}
                value={formUpdateProfileChild?.profileChild.baselineZscore}
                onChange={(e) =>
                  setFormUpdateProfileChild((prev) => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      profileChild: {
                        ...prev.profileChild,
                        baselineZscore:
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value),
                      },
                    };
                  })
                }
              />
            </div>
          </div>
        </div>
        <div className="w-full">
          {!isEdit ? (
            <Button
              className="w-full h-auto "
              variant={"btn"}
              type="button"
              onClick={() => setIsEdit(true)}
            >
              Edit Profile
            </Button>
          ) : (
            <div className="w-full grid grid-cols-2 grid-rows-1 gap-2">
              <Button
                className=""
                type="button"
                variant={"destructive"}
                onClick={() => setIsEdit(false)}
              >
                Batalkan
              </Button>
              <Button variant={"btn"} type="submit">
                Simpan
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileKesehatanAnakHeroSection;
