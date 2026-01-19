export function getMacroTargets(ageMonths: number) {
  // cari nanti data resminya
  if (ageMonths < 12) {
    return {
      proteinGram: 15,
      carbGram: 95,
      fatGram: 30,
      fiberGram: 5,
    };
  }

  if (ageMonths < 36) {
    return {
      proteinGram: 20,
      carbGram: 130,
      fatGram: 35,
      fiberGram: 10,
    };
  }

  return {
    proteinGram: 30,
    carbGram: 150,
    fatGram: 40,
    fiberGram: 15,
  };
}
