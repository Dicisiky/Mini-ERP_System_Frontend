type RelationType = {
  relationid?: number;
  name: string;
  country: string;
  address: string;
  email: string;
  phonenumber: string;
  relationtype: RelationTypes;
  relationTypeDescription?: string;
};

export enum RelationTypes {
  S = "SUPPLIER",
  C = "CUSTOMER",
}

const RelationTypeDescription: Record<RelationTypes, string> = {
  [RelationTypes.S]: "Supplier",
  [RelationTypes.C]: "Customer",
};

export const relationTypeDescription = Object.values(RelationTypes).map(
  (value) => ({
    value,
    label: RelationTypeDescription[value],
  })
);

export default RelationType;
