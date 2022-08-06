import { FormControl, ValidatorFn } from "@angular/forms";

export function isValidIsraeliID(control: FormControl) {
  let id = String(control.value).trim();
  if (id.length > 9 || id.length < 5 || isNaN(Number(id))) return {
    isValidIsraeliID: {
      value: false
    }
  };

  // Pad string with zeros up to 9 digits
  id = id.length < 9 ? ("00000000" + id).slice(-9) : id;

  const isValid =
   Array
    .from(id, Number)
    .reduce((counter, digit, i) => {
      const step = digit * ((i % 2) + 1);
      return counter + (step > 9 ? step - 9 : step);
    }) % 10 === 0;
  return isValid ? null : {
    isValidIsraeliID: {
      value: false
    }
  }
}
