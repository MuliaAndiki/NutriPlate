export const YOLO_CLASSES = [
  'ayam_bakar',
  'ayam_goreng',
  'bakso',
  'bakwan',
  'bihun',
  'capcay',
  'gado_gado',
  'ikan_goreng',
  'kerupuk',
  'martabak_telur',
  'mie',
  'nasi_goreng',
  'nasi_putih',
  'nugget',
  'opor_ayam',
  'pempek',
  'rendang',
  'roti',
  'sate',
  'sosis',
  'soto',
  'tahu',
  'telur',
  'tempe',
  'tumis_kangkung',
  'udang',
];

export const YOLO_TO_PANGANKU: Record<string, string[]> = {
  nasi_putih: ['nasi putih'],
  nasi_goreng: ['nasi putih'],

  ayam_goreng: ['ayam daging'],
  ayam_bakar: ['ayam daging'],
  opor_ayam: ['ayam daging'],

  rendang: ['daging sapi'],
  bakso: ['daging sapi'],
  sate: ['daging ayam', 'daging sapi'],

  ikan_goreng: ['ikan segar'],
  udang: ['udang segar'],

  tumis_kangkung: ['kangkung segar'],
  gado_gado: ['sayuran segar'],
  capcay: ['sayuran segar'],

  bakwan: ['tepung terigu'],
  mie: ['mie basah'],
  bihun: ['bihun'],
  kerupuk: ['kerupuk'],

  nugget: ['daging ayam olahan'],
  sosis: ['sosis'],
  roti: ['roti tawar'],
  pempek: ['ikan segar'],

  martabak_telur: ['tepung terigu', 'telur ayam'],
  tahu: ['tahu'],
  tempe: ['tempe'],
  telur: ['telur ayam'],
};
