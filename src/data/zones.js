import MU900APdf from "../assets/drawings/m3north/plans/MU90/MU90.0/Zones/MU90.0A.pdf";
import MU900BPdf from "../assets/drawings/m3north/plans/MU90/MU90.0/Zones/MU90.0B.pdf";
import MU900CPdf from "../assets/drawings/m3north/plans/MU90/MU90.0/Zones/MU90.0C.pdf";
import MU900DPdf from "../assets/drawings/m3north/plans/MU90/MU90.0/Zones/MU90.0D.pdf";
import MU900EPdf from "../assets/drawings/m3north/plans/MU90/MU90.0/Zones/MU90.0E.pdf";
import MU900F1Pdf from "../assets/drawings/m3north/plans/MU90/MU90.0/Zones/MU90.0F1.pdf";
import MU900F2Pdf from "../assets/drawings/m3north/plans/MU90/MU90.0/Zones/MU90.0F2.pdf";
import MU900IPdf from "../assets/drawings/m3north/plans/MU90/MU90.0/Zones/MU90.0I.pdf";
import MU900KPdf from "../assets/drawings/m3north/plans/MU90/MU90.0/Zones/MU90.0K.pdf";

// MU90.1
import MU901BNPdf from "../assets/drawings/m3north/plans/MU90/MU90.1/Zones/MU90.1BN.pdf";
import MU901BSPdf from "../assets/drawings/m3north/plans/MU90/MU90.1/Zones/MU90.1BS.pdf";
import MU901CPdf from "../assets/drawings/m3north/plans/MU90/MU90.1/Zones/MU90.1C.pdf";
import MU901C1Pdf from "../assets/drawings/m3north/plans/MU90/MU90.1/Zones/MU90.1C1.pdf";
import MU901DPdf from "../assets/drawings/m3north/plans/MU90/MU90.1/Zones/MU90.1D.pdf";
import MU901EPdf from "../assets/drawings/m3north/plans/MU90/MU90.1/Zones/MU90.1E.pdf";
import MU901FPdf from "../assets/drawings/m3north/plans/MU90/MU90.1/Zones/MU90.1F.pdf";
import MU901GPdf from "../assets/drawings/m3north/plans/MU90/MU90.1/Zones/MU90.1G.pdf";
import MU901HPdf from "../assets/drawings/m3north/plans/MU90/MU90.1/Zones/MU90.1H.pdf";
import MU901IPdf from "../assets/drawings/m3north/plans/MU90/MU90.1/Zones/MU90.1I.pdf";
import MU901KPdf from "../assets/drawings/m3north/plans/MU90/MU90.1/Zones/MU90.1K.pdf";
import MU901LPdf from "../assets/drawings/m3north/plans/MU90/MU90.1/Zones/MU90.1L.pdf";
import MU901MPdf from "../assets/drawings/m3north/plans/MU90/MU90.1/Zones/MU90.1M.pdf";

// MU90.2 & MU90.R
import MU902Pdf from "../assets/drawings/m3north/plans/MU90/MU90.2/MU90.2.pdf";
import MU90RPdf from "../assets/drawings/m3north/plans/MU90/MU90.R/MU90.R.pdf";

export const ZONE_MAPPING = {
  "MU90.0": [
    {
      id: 1,
      name: "MU90.0A",
      className: "MU90_0A",
      pdf: MU900APdf,
      rooms: [
        { name: "S.903", className: "MU90_GF-ZoneMU90_0A-1" }
      ]
    },
    {
      id: 2,
      name: "MU90.0B",
      className: "MU90_0B",
      pdf: MU900BPdf,
      rooms: [
        { name: "S.917", className: "MU90_GF-ZoneMU90_0B-1" },
        { name: "TR92", className: "MU90_GF-ZoneMU90_0B-2" },
        { name: "S.915", className: "MU90_GF-ZoneMU90_0B-3" }
      ]
    },
    {
      id: 3,
      name: "MU90.0C",
      className: "MU90_0C",
      pdf: MU900CPdf,
      rooms: [
        { name: "S.937", className: "MU90_GF-ZoneMU90_0C-1" },
        { name: "S.929", className: "MU90_GF-ZoneMU90_0C-2" },
        { name: "S.921", className: "MU90_GF-ZoneMU90_0C-3" }
      ]
    },
    {
      id: 4,
      name: "MU90.0D",
      className: "MU90_0D",
      pdf: MU900DPdf,
      rooms: [
        { name: "S.953", className: "MU90_GF-ZoneMU90_0D-1" },
        { name: "S.950", className: "MU90_GF-ZoneMU90_0D-2" },
        { name: "S.941", className: "MU90_GF-ZoneMU90_0D-3" },
        { name: "S.945", className: "MU90_GF-ZoneMU90_0D-4" },
        { name: "S.942", className: "MU90_GF-ZoneMU90_0D-5" }
      ]
    },
    {
      id: 5,
      name: "MU90.0E",
      className: "MU90_0E",
      pdf: MU900EPdf,
      rooms: [
        { name: "S.928", className: "MU90_GF-ZoneMU90_0E-1" },
        { name: "S.916", className: "MU90_GF-ZoneMU90_0E-2" },
        { name: "S.908", className: "MU90_GF-ZoneMU90_0E-3" }
      ]
    },
    {
      id: 6,
      name: "MU90.0F1",
      className: "MU90_0F1",
      pdf: MU900F1Pdf,
      rooms: [
        { name: "S.904.2", className: "MU90_GF-ZoneMU90_0F1-1" },
        { name: "S.906.1", className: "MU90_GF-ZoneMU90_0F1-2" },
        { name: "S.906", className: "MU90_GF-ZoneMU90_0F1-3" },
        { name: "S.904.1", className: "MU90_GF-ZoneMU90_0F1-4" }
      ]
    },
    {
      id: 7,
      name: "MU90.0F2",
      className: "MU90_0F2",
      pdf: MU900F2Pdf,
      rooms: [
        { name: "S.910", className: "MU90_GF-ZoneMU90_0F2-1" },
        { name: "S.912", className: "MU90_GF-ZoneMU90_0F2-2" },
        { name: "S.902.3", className: "MU90_GF-ZoneMU90_0F2-3" },
        { name: "S.902.2", className: "MU90_GF-ZoneMU90_0F2-4" },
        { name: "S.902.4", className: "MU90_GF-ZoneMU90_0F2-5" },
        { name: "LI91", className: "MU90_GF-ZoneMU90_0F2-6" },
        { name: "S.902.1", className: "MU90_GF-ZoneMU90_0F2-7" },
        { name: "TE91", className: "MU90_GF-ZoneMU90_0F2-8" },
        { name: "S.902", className: "MU90_GF-ZoneMU90_0F2-9" },
        { name: "S.900", className: "MU90_GF-ZoneMU90_0F2-10" }
      ]
    },
    {
      id: 8,
      name: "MU90.0I",
      className: "MU90_0I",
      pdf: MU900IPdf,
      rooms: [
        { name: "S.934", className: "MU90_GF-ZoneMU90_0I-1" },
        { name: "S.924", className: "MU90_GF-ZoneMU90_0I-2" },
        { name: "S.918", className: "MU90_GF-ZoneMU90_0I-3" },
        { name: "S.914", className: "MU90_GF-ZoneMU90_0I-4" }
      ]
    },
    {
      id: 9,
      name: "MU90.0K",
      className: "MU90_0K",
      pdf: MU900KPdf,
      rooms: [
        { name: "TR93", className: "MU90_GF-ZoneMU90_0K-1" },
        { name: "S.904", className: "MU90_GF-ZoneMU90_0K-2" },
        { name: "S.901", className: "MU90_GF-ZoneMU90_0K-3" }
      ]
    }
  ],
  "MU90.1": [
    {
      id: 1,
      name: "MU90.1BN",
      className: "MU90_1BN",
      pdf: MU901BNPdf,
      rooms: [
        { name: "1.935", className: "MU90_1_VB-ZoneMU90_1BN-1" },
        { name: "1.931", className: "MU90_1_VB-ZoneMU90_1BN-2" },
        { name: "1.933", className: "MU90_1_VB-ZoneMU90_1BN-3" },
        { name: "1.923.1", className: "MU90_1_VB-ZoneMU90_1BN-4" },
        { name: "1.927", className: "MU90_1_VB-ZoneMU90_1BN-5" },
        { name: "1.929", className: "MU90_1_VB-ZoneMU90_1BN-6" },
        { name: "1.925", className: "MU90_1_VB-ZoneMU90_1BN-7" },
        { name: "1.919.5", className: "MU90_1_VB-ZoneMU90_1BN-8" },
        { name: "1.923", className: "MU90_1_VB-ZoneMU90_1BN-9" },
        { name: "1.921", className: "MU90_1_VB-ZoneMU90_1BN-10" },
        { name: "TR92", className: "MU90_1_VB-ZoneMU90_1BN-11" },
        { name: "1.915", className: "MU90_1_VB-ZoneMU90_1BN-12" },
        { name: "1.919.2", className: "MU90_1_VB-ZoneMU90_1BN-13" },
        { name: "1.919.1", className: "MU90_1_VB-ZoneMU90_1BN-14" },
        { name: "1.919.3", className: "MU90_1_VB-ZoneMU90_1BN-15" },
        { name: "S.903", className: "MU90_1_VB-ZoneMU90_1BN-16" },
        { name: "1.919.4", className: "MU90_1_VB-ZoneMU90_1BN-17" }
      ]
    },
    {
      id: 2,
      name: "MU90.1BS",
      className: "MU90_1BS",
      pdf: MU901BSPdf,
      rooms: [
        { name: "1.917", className: "MU90_1_VB-ZoneMU90_1BS-1" },
        { name: "1.913.5", className: "MU90_1_VB-ZoneMU90_1BS-2" },
        { name: "1.913.6", className: "MU90_1_VB-ZoneMU90_1BS-3" },
        { name: "1.913.3", className: "MU90_1_VB-ZoneMU90_1BS-4" },
        { name: "1.913.4", className: "MU90_1_VB-ZoneMU90_1BS-5" },
        { name: "1.913.2", className: "MU90_1_VB-ZoneMU90_1BS-6" },
        { name: "1.913", className: "MU90_1_VB-ZoneMU90_1BS-7" },
        { name: "1.911", className: "MU90_1_VB-ZoneMU90_1BS-8" },
        { name: "1.909", className: "MU90_1_VB-ZoneMU90_1BS-9" },
        { name: "1.913.1", className: "MU90_1_VB-ZoneMU90_1BS-10" },
        { name: "1.906.1", className: "MU90_1_VB-ZoneMU90_1BS-11" },
        { name: "1.906.2", className: "MU90_1_VB-ZoneMU90_1BS-12" },
        { name: "1.901", className: "MU90_1_VB-ZoneMU90_1BS-13" },
        { name: "1.906", className: "MU90_1_VB-ZoneMU90_1BS-14" },
        { name: "1.906.3", className: "MU90_1_VB-ZoneMU90_1BS-15" },
        { name: "1.906.4", className: "MU90_1_VB-ZoneMU90_1BS-16" },
        { name: "1.906.5", className: "MU90_1_VB-ZoneMU90_1BS-17" }
      ]
    },
    {
      id: 3,
      name: "MU90.1C1",
      className: "MU90_1C",
      pdf: MU901CPdf,
      rooms: [
        { name: "1.924", className: "MU90_1_VB-ZoneMU90_1C-1" }
      ]
    },
    {
      id: 4,
      name: "MU90.1C2",
      className: "MU90_1C2",
      pdf: MU901C1Pdf,
      rooms: [
        { name: "1.937", className: "MU90_1_VB-ZoneMU90_1C2-1" }
      ]
    },
    {
      id: 5,
      name: "MU90.1D",
      className: "MU90_1D",
      pdf: MU901DPdf,
      rooms: [
        { name: "1.947", className: "MU90_1_VB-ZoneMU90_1D-1" }
      ]
    },
    {
      id: 6,
      name: "MU90.1E",
      className: "MU90_1E",
      pdf: MU901EPdf,
      rooms: [
        { name: "1.951", className: "MU90_1_VB-ZoneMU90_1E-1" }
      ]
    },
    {
      id: 7,
      name: "MU90.1F",
      className: "MU90_1F",
      pdf: MU901FPdf,
      rooms: [
        { name: "1.952", className: "MU90_1_VB-ZoneMU90_1F-1" }
      ]
    },
    {
      id: 8,
      name: "MU90.1G",
      className: "MU90_1G",
      pdf: MU901GPdf,
      rooms: [
        { name: "1.950", className: "MU90_1_VB-ZoneMU90_1G-1" },
        { name: "1.944", className: "MU90_1_VB-ZoneMU90_1G-2" },
        { name: "1.940", className: "MU90_1_VB-ZoneMU90_1G-3" }
      ]
    },
    {
      id: 9,
      name: "MU90.1H",
      className: "MU90_1H",
      pdf: MU901HPdf,
      rooms: [
        { name: "1.928", className: "MU90_1_VB-ZoneMU90_1H-1" },
        { name: "1.920", className: "MU90_1_VB-ZoneMU90_1H-2" }
      ]
    },
    {
      id: 10,
      name: "MU90.1I",
      className: "MU90_1I",
      pdf: MU901IPdf,
      rooms: [
        { name: "1.914.4", className: "MU90_1_VB-ZoneMU90_1I-1" },
        { name: "1.914.3", className: "MU90_1_VB-ZoneMU90_1I-2" },
        { name: "1.914.2", className: "MU90_1_VB-ZoneMU90_1I-3" },
        { name: "1.914.1", className: "MU90_1_VB-ZoneMU90_1I-4" },
        { name: "1.912", className: "MU90_1_VB-ZoneMU90_1I-5" },
        { name: "1.914", className: "MU90_1_VB-ZoneMU90_1I-6" },
        { name: "1.918", className: "MU90_1_VB-ZoneMU90_1I-7" },
        { name: "1.916", className: "MU90_1_VB-ZoneMU90_1I-8" },
        { name: "1.910", className: "MU90_1_VB-ZoneMU90_1I-9" },
        { name: "1.908.1", className: "MU90_1_VB-ZoneMU90_1I-10" },
        { name: "1.908.2", className: "MU90_1_VB-ZoneMU90_1I-11" },
        { name: "1.908.3", className: "MU90_1_VB-ZoneMU90_1I-12" },
        { name: "1.908", className: "MU90_1_VB-ZoneMU90_1I-13" },
        { name: "1.904", className: "MU90_1_VB-ZoneMU90_1I-14" },
        { name: "1.900.1", className: "MU90_1_VB-ZoneMU90_1I-15" }
      ]
    },
    {
      id: 11,
      name: "MU90.1K",
      className: "MU90_1K",
      pdf: MU901KPdf,
      rooms: [
        { name: "1.941", className: "MU90_1_VB-ZoneMU90_1K-1" },
        { name: "TR93", className: "MU90_1_VB-ZoneMU90_1K-2" },
        { name: "1.930", className: "MU90_1_VB-ZoneMU90_1K-3" },
        { name: "1.922", className: "MU90_1_VB-ZoneMU90_1K-4" },
        { name: "LI91", className: "MU90_1_VB-ZoneMU90_1K-5" },
        { name: "TR91", className: "MU90_1_VB-ZoneMU90_1K-6" },
        { name: "1.900", className: "MU90_1_VB-ZoneMU90_1K-7" }
      ]
    },
    {
      id: 12,
      name: "MU90.1L",
      className: "MU90_1L",
      pdf: MU901LPdf,
      rooms: [
        { name: "1.938", className: "MU90_1_VB-ZoneMU90_1L-1" },
        { name: "1.939", className: "MU90_1_VB-ZoneMU90_1L-2" },
        { name: "1.942", className: "MU90_1_VB-ZoneMU90_1L-3" },
        { name: "1.936", className: "MU90_1_VB-ZoneMU90_1L-4" },
        { name: "1.934", className: "MU90_1_VB-ZoneMU90_1L-5" },
        { name: "1.932", className: "MU90_1_VB-ZoneMU90_1L-6" },
        { name: "1.922.1", className: "MU90_1_VB-ZoneMU90_1L-7" }
      ]
    },
    {
      id: 13,
      name: "MU90.1M",
      className: "MU90_1M",
      pdf: MU901MPdf,
      rooms: [
        { name: "1.922.1", className: "MU90_1_VB-ZoneMU90_1M-1" }
      ]
    }
  ],
  "MU90.2": [
    {
      id: 1,
      name: "MU90.2",
      className: "MU90_2",
      pdf: MU902Pdf,
      rooms: [
        { name: "2.900.2", className: "MU90_1_VB-ZoneMU90_2A-1" },
        { name: "2.900", className: "MU90_1_VB-ZoneMU90_2A-2" },
        { name: "LI91", className: "MU90_1_VB-ZoneMU90_2A-3" },
        { name: "TR91", className: "MU90_1_VB-ZoneMU90_2A-4" },
        { name: "2.900.1", className: "MU90_1_VB-ZoneMU90_2A-5" }
      ]
    }
  ],
  "MU90.R": [
    {
      id: 1,
      name: "MU90.R",
      className: "MU90_R",
      pdf: MU90RPdf,
      rooms: [
        { name: "90.RA", className: "MU90_1_VB-ZoneMU90_RA-1" },
        { name: "90.R.BW", className: "MU90_1_VB-ZoneMU90_R_BW-1" },
        { name: "90.R.BE", className: "MU90_1_VB-ZoneMU90_R_BE-1" }
      ]
    }
  ]
};