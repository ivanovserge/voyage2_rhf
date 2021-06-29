import {
  CITIZENSHIP_RU,
  DOCUMENT_TYPE_RUSSIAN_PASSPORT_OPTION,
} from "./constants";

const defaultValues = {
  content: {
    contract: {
      beginDate: "",
      arrival: "",
      data: {
        inTrip: false,
      },
    },
    policyHolder: {
      citizenship: CITIZENSHIP_RU,
      lastName: "",
      firstName: "",
      middleName: "",
      dob: "",
      phone: "",
      email: "",
      emailConfirm: "",
      document: {
        type: DOCUMENT_TYPE_RUSSIAN_PASSPORT_OPTION,
      },
    },
    insConditions: {
      insVariant: {
        countries: [],
      },
    },
  },
};

export default defaultValues;
