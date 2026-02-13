"use client";

import DetailProgramPosyanduSection from "@/components/section/private/posyandu/program/detail-program/detail-program-section";
import { useAppSelector } from "@/hooks/dispatch/dispatch";
import useService from "@/hooks/mutation/prop.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { FormCreateProgram } from "@/types/form/program.form";
import { IProgram } from "@/types/schema";
import { parsePayload } from "@/utils/parse.format";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const DetailProgramPosyanduContainer = () => {
  const namespace = useAppNameSpace();
  const service = useService();
  const { programID } = useParams<{ programID: string }>();
  const selector = useAppSelector((state) => state.posyandu);

  //program by id
  const programByIdQuery = service.program.query.getProgramById(programID);
  const programByIdData = programByIdQuery.data?.data ?? null;

  const childQuery = service.user.query.childAll({
    role: selector.role!,
    posyanduId: selector.posyanduId!,
  });
  const childData = childQuery.data?.data ?? [];

  //mutation
  const deleteProgramMutation = service.program.mutation.deleteProgram();
  const updateProgramMutation = service.program.mutation.updateProgram();

  //state
  const [showUpdate, setShowUpdate] = useState<boolean>(false);
  const [showChildSelect, setShowChildSelect] = useState<boolean>(false);
  const [formUpdateProgram, setFormUpdateProgram] =
    useState<FormCreateProgram | null>(null);

  const normalizeProgram = (program: IProgram): FormCreateProgram => ({
    name: program.name,
    description: program.description,
    durationRegister: program.durationRegister
      ? program.durationRegister.split("T")[0]
      : "",
    endPrograms: program.endPrograms ? program.endPrograms.split("T")[0] : "",
    activity: program.activity ?? [],
    benefit: program.benefit ?? [],
  });

  useEffect(() => {
    if (!programByIdData) return;
    const nextForm = normalizeProgram(programByIdData);
    setFormUpdateProgram((prev) => {
      if (prev && JSON.stringify(prev) === JSON.stringify(nextForm)) {
        return prev;
      }
      return nextForm;
    });
  }, [programByIdData?.id]);

  //handler
  const handlerDeleteProgram = () => {
    if (!programID) return null;
    deleteProgramMutation.mutate(programID);
  };

  const handlerUpdateProgram = () => {
    if (!programID || !programByIdData || !formUpdateProgram) return null;
    const original = normalizeProgram(programByIdData);
    const payload = parsePayload(original, formUpdateProgram);

    if (Object.keys(payload).length === 0) {
      namespace.alert.toast({
        title: "info",
        message: "tidak ada perubahan",
        icon: "info",
      });
      return;
    }

    updateProgramMutation.mutate(
      { payload, id: programID },
      {
        onSuccess: () => {
          setShowUpdate(false);
        },
      },
    );
  };

  const handleSelectChild = (childId: string) => {
    if (!childId || !programID) return;
    namespace.router.push(
      `/posyandu/program/detail/${programID}/task/${childId}`,
    );
  };

  return (
    <main className="w-full">
      <DetailProgramPosyanduSection
        namespace={{
          router: namespace.router,
          alert: namespace.alert,
        }}
        service={{
          query: {
            isLoading: programByIdQuery.isLoading || childQuery.isLoading,
            program: programByIdData ?? null,
            children: childData ?? [],
          },
          mutation: {
            deleteProgram: handlerDeleteProgram,
            isPendingDelete: deleteProgramMutation.isPending,
            updateProgram: handlerUpdateProgram,
            isPendingUpdate: updateProgramMutation.isPending,
          },
        }}
        handler={{
          onSelectChild: handleSelectChild,
          onOpenChildSelect: () => setShowChildSelect(true),
          onCloseChildSelect: () => setShowChildSelect(false),
        }}
        state={{
          showUpdate: showUpdate,
          setShowUpdate: setShowUpdate,
          formUpdateProgram: formUpdateProgram,
          setFormUpdateProgram: setFormUpdateProgram,
          showChildSelect: showChildSelect,
          setShowChildSelect: setShowChildSelect,
        }}
      />
    </main>
  );
};

export default DetailProgramPosyanduContainer;
