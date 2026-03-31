import EmptyCard from "@/components/fallback/empty-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { FormRegisterDevice } from "@/types/form";
import { IotDeviceResponse } from "@/types/res";
import { Icon } from "@iconify/react/dist/iconify.js";

interface IotAdminSectionProps {
  service: {
    query: {
      isLoading: boolean;
      devices: IotDeviceResponse[];
      selectedToken: string;
      selectedDevice: IotDeviceResponse | null;
    };
    mutation: {
      isPending: boolean;
      onRegister: () => void;
      onUpdate: () => void;
      onDelete: () => void;
      onReboot: () => void;
    };
  };
  state: {
    setSelectedToken: React.Dispatch<React.SetStateAction<string>>;
    registerForm: FormRegisterDevice;
    setRegisterForm: React.Dispatch<React.SetStateAction<FormRegisterDevice>>;
    editForm: {
      deviceName: string;
      parentId: string;
      posyanduId: string;
      pairingToken: string;
      batteryLevel: string;
      firmwareVersion: string;
      ipAddress: string;
    };
    setEditForm: React.Dispatch<
      React.SetStateAction<{
        deviceName: string;
        parentId: string;
        posyanduId: string;
        pairingToken: string;
        batteryLevel: string;
        firmwareVersion: string;
        ipAddress: string;
      }>
    >;
  };
}

const IotAdminSection: React.FC<IotAdminSectionProps> = ({
  service,
  state,
}) => {
  const { devices, selectedToken, selectedDevice, isLoading } = service.query;

  if (isLoading) {
    return (
      <section className="w-full p-4 space-y-4">
        <div className="h-24 rounded-2xl bg-muted animate-pulse" />
        <div className="h-72 rounded-2xl bg-muted animate-pulse" />
      </section>
    );
  }

  return (
    <section className="w-full p-4 space-y-4">
      <Card className="w-full p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Manajemen IoT Admin</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Kelola perangkat, update metadata, reboot, dan hapus device.
            </p>
          </div>
          <div className="w-11 h-11 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Icon
              icon="fluent:iot-16-regular"
              width={24}
              height={24}
              className="text-primary"
            />
          </div>
        </div>
      </Card>

      <Card className="w-full p-4 space-y-3">
        <h2 className="text-lg font-bold">Pilih Device</h2>

        {devices.length === 0 ? (
          <EmptyCard message="Belum ada device terdaftar" />
        ) : (
          <Select
            value={selectedToken}
            onValueChange={(value) => state.setSelectedToken(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih device" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Semua Device</SelectLabel>
                {devices.map((item) => (
                  <SelectItem key={item.id} value={item.deviceToken}>
                    {item.deviceName} • {item.deviceToken} • {item.status}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="w-full p-4 space-y-3">
          <h2 className="text-lg font-bold">Register Device</h2>

          <Input
            placeholder="Device token"
            value={state.registerForm.token}
            onChange={(e) =>
              state.setRegisterForm((prev) => ({
                ...prev,
                token: e.target.value,
              }))
            }
          />
          <Input
            placeholder="Nama device"
            value={state.registerForm.name}
            onChange={(e) =>
              state.setRegisterForm((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
          <Input
            placeholder="Parent ID (opsional)"
            value={state.registerForm.parentId}
            onChange={(e) =>
              state.setRegisterForm((prev) => ({
                ...prev,
                parentId: e.target.value,
              }))
            }
          />
          <Input
            placeholder="Posyandu ID (opsional)"
            value={state.registerForm.posyanduId}
            onChange={(e) =>
              state.setRegisterForm((prev) => ({
                ...prev,
                posyanduId: e.target.value,
              }))
            }
          />
          <Input
            placeholder="Pairing token (opsional)"
            value={state.registerForm.pairingToken}
            onChange={(e) =>
              state.setRegisterForm((prev) => ({
                ...prev,
                pairingToken: e.target.value,
              }))
            }
          />

          <Button
            className="w-full"
            onClick={service.mutation.onRegister}
            disabled={service.mutation.isPending}
          >
            {service.mutation.isPending ? <Spinner /> : "Daftarkan Device"}
          </Button>
        </Card>

        <Card className="w-full p-4 space-y-3">
          <h2 className="text-lg font-bold">Update & Aksi Device</h2>

          {!selectedDevice ? (
            <EmptyCard message="Pilih device untuk melanjutkan" />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input
                  placeholder="Nama device"
                  value={state.editForm.deviceName}
                  onChange={(e) =>
                    state.setEditForm((prev) => ({
                      ...prev,
                      deviceName: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Battery level"
                  type="number"
                  value={state.editForm.batteryLevel}
                  onChange={(e) =>
                    state.setEditForm((prev) => ({
                      ...prev,
                      batteryLevel: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Parent ID"
                  value={state.editForm.parentId}
                  onChange={(e) =>
                    state.setEditForm((prev) => ({
                      ...prev,
                      parentId: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Posyandu ID"
                  value={state.editForm.posyanduId}
                  onChange={(e) =>
                    state.setEditForm((prev) => ({
                      ...prev,
                      posyanduId: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Pairing token"
                  value={state.editForm.pairingToken}
                  onChange={(e) =>
                    state.setEditForm((prev) => ({
                      ...prev,
                      pairingToken: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Firmware version"
                  value={state.editForm.firmwareVersion}
                  onChange={(e) =>
                    state.setEditForm((prev) => ({
                      ...prev,
                      firmwareVersion: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="IP address"
                  value={state.editForm.ipAddress}
                  onChange={(e) =>
                    state.setEditForm((prev) => ({
                      ...prev,
                      ipAddress: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Button
                  onClick={service.mutation.onUpdate}
                  disabled={service.mutation.isPending}
                >
                  Update Device
                </Button>
                <Button
                  variant="outline"
                  onClick={service.mutation.onReboot}
                  disabled={service.mutation.isPending}
                >
                  Reboot Device
                </Button>
                <Button
                  variant="destructive"
                  onClick={service.mutation.onDelete}
                  disabled={service.mutation.isPending}
                >
                  Hapus Device
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </section>
  );
};

export default IotAdminSection;
