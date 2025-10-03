const buildingData = {
  "Main building right wing": {
    2: Array.from(
      { length: 12 },
      (_, i) => `R2${(i + 1).toString().padStart(2, "0")}`
    ),
    3: Array.from(
      { length: 12 },
      (_, i) => `R3${(i + 1).toString().padStart(2, "0")}`
    ),
    4: Array.from(
      { length: 12 },
      (_, i) => `R4${(i + 1).toString().padStart(2, "0")}`
    ),
  },
  "Main building left wing": {
    2: Array.from(
      { length: 12 },
      (_, i) => `L2${(i + 1).toString().padStart(2, "0")}`
    ),
    3: Array.from(
      { length: 12 },
      (_, i) => `L3${(i + 1).toString().padStart(2, "0")}`
    ),
    4: Array.from(
      { length: 12 },
      (_, i) => `L4${(i + 1).toString().padStart(2, "0")}`
    ),
  },
  "PAGCOR Building": {
    1: Array.from(
      { length: 5 },
      (_, i) => `L1${(i + 1).toString().padStart(2, "0")}`
    ),
    2: Array.from(
      { length: 5 },
      (_, i) => `L2${(i + 1).toString().padStart(2, "0")}`
    ),
    3: Array.from(
      { length: 5 },
      (_, i) => `L3${(i + 1).toString().padStart(2, "0")}`
    ),
    4: Array.from(
      { length: 5 },
      (_, i) => `L4${(i + 1).toString().padStart(2, "0")}`
    ),
  },
};

export default buildingData;
