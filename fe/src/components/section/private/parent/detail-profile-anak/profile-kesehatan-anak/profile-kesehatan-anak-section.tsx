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
  namespace: {
    router: AppRouterInstance;
  };
  service: {
    mutation: {
      onUpdate: () => void;
    };
  };
  state: {
    formUpdateProfileChild: FormUpdateProfileChild | null;
    setFormUpdateProfileChild: React.Dispatch<
      React.SetStateAction<FormUpdateProfileChild | null>
    >;
    isEdit: boolean;
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  };
}
const ProfileKesehatanAnakHeroSection: React.FC<
  ProfileKesehatanAnakSectionProps
> = ({ namespace, service, state }) => {
  return (
    <div className="w-full min-h-screen flex justify-start items-center flex-col p-2 space-y-2">
      <div className="w-full flex justify-start items-center">
        <ChevronLeft
          className="scale-120"
          onClick={() => namespace.router.back()}
        />
        <h1 className="text-2xl font-bold">Profile Kesehatan Anak</h1>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          service.mutation.onUpdate();
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
                  disabled={!state.isEdit}
                  value={
                    state.formUpdateProfileChild?.profileChild.birthWeightKg
                  }
                  onChange={(e) =>
                    state.setFormUpdateProfileChild((prev) => {
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
                  disabled={!state.isEdit}
                  value={
                    state.formUpdateProfileChild?.profileChild.birthHeightCm
                  }
                  onChange={(e) =>
                    state.setFormUpdateProfileChild((prev) => {
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
              value={state.formUpdateProfileChild?.profileChild.allergicFoods}
              disabled={!state.isEdit}
              onChange={(e) =>
                state.setFormUpdateProfileChild((prev) => {
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
                disabled={!state.isEdit}
                value={
                  state.formUpdateProfileChild?.profileChild.chronicConditions
                }
                onChange={(e) =>
                  state.setFormUpdateProfileChild((prev) => {
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
              disabled={!state.isEdit}
              value={
                state.formUpdateProfileChild?.profileChild.pregnancyAgeWeeks ??
                ""
              }
              onChange={(e) =>
                state.setFormUpdateProfileChild((prev) => {
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
                  disabled={!state.isEdit}
                  key={
                    state.formUpdateProfileChild?.profileChild.feedingType ?? ""
                  }
                  value={
                    state.formUpdateProfileChild?.profileChild.feedingType ?? ""
                  }
                  onValueChange={(value) =>
                    state.setFormUpdateProfileChild((prev) => {
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
                  disabled={!state.isEdit}
                  key={
                    state.formUpdateProfileChild?.profileChild.activityLevel ??
                    ""
                  }
                  value={
                    state.formUpdateProfileChild?.profileChild.activityLevel ??
                    ""
                  }
                  onValueChange={(value) =>
                    state.setFormUpdateProfileChild((prev) => {
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

        <div className="w-full">
          {!state.isEdit ? (
            <Button
              className="w-full h-auto "
              variant={"btn"}
              type="button"
              onClick={() => state.setIsEdit(true)}
            >
              Edit Profile
            </Button>
          ) : (
            <div className="w-full grid grid-cols-2 grid-rows-1 gap-2">
              <Button
                className=""
                type="button"
                variant={"destructive"}
                onClick={() => state.setIsEdit(false)}
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
