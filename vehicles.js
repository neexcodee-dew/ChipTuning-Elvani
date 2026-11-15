/* =========================================================
   ChipTuning Elvani — baza e veturave
   Formati i motorit: "emri  XXXhp  XXXNm"  (vlerat e fabrikës, orientuese)
   Për të shtuar një motor/model: shto një rresht poshtë markës përkatëse.
   ========================================================= */
const SRC = {
  "Audi": {
    "A1": ["1.6 TDI 105hp 250Nm", "1.4 TFSI 125hp 200Nm"],
    "A3": ["1.6 TDI 116hp 250Nm", "2.0 TDI 150hp 340Nm", "2.0 TFSI 190hp 320Nm"],
    "A4": ["2.0 TDI 150hp 320Nm", "2.0 TDI 190hp 400Nm", "2.0 TFSI 252hp 370Nm"],
    "A6": ["2.0 TDI 190hp 400Nm", "3.0 TDI 272hp 600Nm"],
    "Q3": ["2.0 TDI 150hp 340Nm", "2.0 TFSI 220hp 350Nm"],
    "Q5": ["2.0 TDI 190hp 400Nm", "2.0 TFSI 252hp 370Nm"],
    "Q7": ["3.0 TDI 272hp 600Nm"],
    "RS3": ["2.5 TFSI 400hp 480Nm"]
  },
  "BMW": {
    "1 Series": ["118d 150hp 320Nm", "120d 190hp 400Nm"],
    "3 Series": ["318d 150hp 320Nm", "320d 190hp 400Nm", "330i 258hp 400Nm", "330d 258hp 560Nm"],
    "5 Series": ["520d 190hp 400Nm", "530d 265hp 620Nm", "530i 252hp 350Nm"],
    "X1": ["18d 150hp 330Nm", "20d 190hp 400Nm"],
    "X3": ["20d 190hp 400Nm", "30d 265hp 620Nm"],
    "X5": ["30d 265hp 620Nm", "40d 313hp 630Nm"],
    "M3": ["3.0 Twin Turbo 510hp 650Nm"]
  },
  "Mercedes-Benz": {
    "A-Class": ["A180d 116hp 260Nm", "A200 163hp 250Nm"],
    "C-Class": ["C220d 194hp 400Nm", "C300 258hp 370Nm"],
    "E-Class": ["E220d 194hp 400Nm", "E350d 258hp 620Nm"],
    "GLC": ["220d 194hp 400Nm", "300 258hp 370Nm"],
    "Vito": ["2.2 CDI 136hp 330Nm", "2.2 CDI 163hp 380Nm"]
  },
  "Volkswagen": {
    "Polo": ["1.6 TDI 95hp 250Nm", "1.0 TSI 95hp 175Nm"],
    "Golf": ["1.6 TDI 115hp 250Nm", "2.0 TDI 150hp 340Nm", "2.0 TSI GTI 245hp 370Nm"],
    "Passat": ["2.0 TDI 150hp 340Nm", "2.0 TDI 190hp 400Nm"],
    "Tiguan": ["2.0 TDI 150hp 340Nm", "2.0 TSI 220hp 350Nm"],
    "Touareg": ["3.0 TDI 262hp 580Nm"],
    "Caddy": ["2.0 TDI 102hp 250Nm", "2.0 TDI 122hp 320Nm"]
  },
  "Skoda": {
    "Fabia": ["1.4 TDI 90hp 230Nm"],
    "Octavia": ["2.0 TDI 150hp 340Nm", "2.0 TSI RS 245hp 370Nm"],
    "Superb": ["2.0 TDI 190hp 400Nm"],
    "Kodiaq": ["2.0 TDI 150hp 340Nm", "2.0 TDI 190hp 400Nm"]
  },
  "Seat": {
    "Ibiza": ["1.6 TDI 105hp 250Nm"],
    "Leon": ["2.0 TDI 150hp 340Nm", "2.0 TSI Cupra 300hp 400Nm"],
    "Ateca": ["2.0 TDI 150hp 340Nm"]
  },
  "Opel": {
    "Corsa": ["1.3 CDTI 95hp 190Nm", "1.4 Turbo 100hp 200Nm"],
    "Astra": ["1.6 CDTI 136hp 320Nm", "1.4 Turbo 150hp 245Nm"],
    "Insignia": ["2.0 CDTI 170hp 400Nm"],
    "Mokka": ["1.6 CDTI 136hp 320Nm"]
  },
  "Ford": {
    "Fiesta": ["1.5 TDCi 95hp 215Nm", "1.0 EcoBoost 125hp 170Nm"],
    "Focus": ["1.5 TDCi 120hp 270Nm", "2.0 TDCi 150hp 370Nm", "2.0 ST 250hp 360Nm"],
    "Mondeo": ["2.0 TDCi 150hp 370Nm"],
    "Kuga": ["2.0 TDCi 150hp 370Nm"],
    "Transit": ["2.2 TDCi 125hp 350Nm"]
  },
  "Renault": {
    "Clio": ["1.5 dCi 90hp 220Nm"],
    "Megane": ["1.5 dCi 110hp 260Nm", "1.6 dCi 130hp 320Nm"],
    "Captur": ["1.5 dCi 90hp 220Nm"],
    "Kadjar": ["1.6 dCi 130hp 320Nm"]
  },
  "Peugeot": {
    "208": ["1.5 BlueHDi 100hp 250Nm"],
    "308": ["1.6 HDi 115hp 270Nm", "2.0 BlueHDi 150hp 370Nm"],
    "3008": ["2.0 BlueHDi 150hp 370Nm"],
    "508": ["2.0 BlueHDi 160hp 400Nm"]
  },
  "Citroën": {
    "C3": ["1.6 HDi 92hp 230Nm"],
    "C4": ["1.6 HDi 115hp 270Nm"],
    "Berlingo": ["1.6 HDi 100hp 254Nm"]
  },
  "Fiat": {
    "500": ["1.3 Multijet 95hp 200Nm"],
    "Punto": ["1.3 Multijet 95hp 200Nm"],
    "Tipo": ["1.6 Multijet 120hp 320Nm"],
    "Ducato": ["2.3 Multijet 150hp 380Nm"]
  },
  "Toyota": {
    "Yaris": ["1.4 D-4D 90hp 205Nm"],
    "Auris": ["1.4 D-4D 90hp 205Nm"],
    "Avensis": ["2.0 D-4D 124hp 310Nm"],
    "RAV4": ["2.2 D-4D 150hp 340Nm"],
    "Hilux": ["2.4 D-4D 150hp 400Nm"]
  },
  "Honda": {
    "Civic": ["1.6 i-DTEC 120hp 300Nm", "1.5 VTEC Turbo 182hp 240Nm"],
    "CR-V": ["2.2 i-DTEC 150hp 350Nm"]
  },
  "Hyundai": {
    "i20": ["1.4 CRDi 90hp 220Nm"],
    "i30": ["1.6 CRDi 115hp 280Nm"],
    "Tucson": ["2.0 CRDi 136hp 373Nm", "2.0 CRDi 185hp 400Nm"]
  },
  "Kia": {
    "Ceed": ["1.6 CRDi 115hp 280Nm"],
    "Sportage": ["2.0 CRDi 136hp 373Nm"],
    "Sorento": ["2.2 CRDi 200hp 441Nm"]
  },
  "Mazda": {
    "3": ["2.2 Skyactiv-D 150hp 380Nm"],
    "6": ["2.2 Skyactiv-D 175hp 420Nm"],
    "CX-5": ["2.2 Skyactiv-D 175hp 420Nm"]
  },
  "Nissan": {
    "Juke": ["1.5 dCi 110hp 260Nm"],
    "Qashqai": ["1.5 dCi 110hp 260Nm", "1.6 dCi 130hp 320Nm"],
    "X-Trail": ["1.6 dCi 130hp 320Nm"]
  },
  "Volvo": {
    "S60": ["D3 150hp 320Nm", "D4 190hp 400Nm"],
    "V60": ["D4 190hp 400Nm"],
    "XC60": ["D4 190hp 400Nm", "D5 235hp 480Nm"]
  },
  "Dacia": {
    "Sandero": ["0.9 TCe 90hp 140Nm", "1.5 dCi 90hp 220Nm"],
    "Duster": ["1.5 dCi 110hp 260Nm"]
  },
  "Mini": {
    "Cooper D": ["1.5 116hp 270Nm"],
    "Cooper S": ["2.0 192hp 280Nm"]
  },
  "Porsche": {
    "Macan": ["2.0 Turbo 252hp 370Nm"],
    "Cayenne": ["3.0 TDI 262hp 580Nm"],
    "911 Carrera": ["3.0 Turbo 385hp 450Nm"]
  },
  "Land Rover": {
    "Range Rover Evoque": ["2.0 TD4 150hp 380Nm"],
    "Discovery Sport": ["2.0 TD4 180hp 430Nm"]
  },
  "Jeep": {
    "Renegade": ["2.0 Multijet 140hp 350Nm"],
    "Compass": ["2.0 Multijet 170hp 350Nm"]
  },
  "Alfa Romeo": {
    "Giulietta": ["2.0 JTDM 150hp 320Nm"],
    "Giulia": ["2.2 JTDM 190hp 450Nm"]
  },
  "Suzuki": {
    "Swift": ["1.0 Boosterjet 111hp 170Nm"],
    "Vitara": ["1.6 DDiS 120hp 320Nm"]
  },
  "Mitsubishi": {
    "Outlander": ["2.2 DI-D 150hp 360Nm"],
    "L200": ["2.4 DI-D 181hp 430Nm"]
  }
};

/* Kthen formatin që pret script.js: { engines, base_hp, base_tq } */
window.VEHICLES = Object.fromEntries(
  Object.entries(SRC).map(([brand, models]) => [
    brand,
    Object.fromEntries(
      Object.entries(models).map(([model, engines]) => {
        const m = engines[0].match(/(\d+)hp\s*(\d+)Nm/i);
        return [model, { engines, base_hp: +m[1], base_tq: +m[2] }];
      })
    )
  ])
);