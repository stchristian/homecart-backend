export enum OrderState {
  POSTED = "POSTED",
  ASSIGNED = "ASSIGNED",
  PURCHASED = "PURCHASED",
  COMPLETED = "COMPLETED",
  EXPIRED = "EXPIRED",
}

export enum AmountType {
  MASS = "MASS",
  PIECE = "PIECE",
  LENGTH = "LENGTH",
  AREA = "AREA",
}

export enum UserRoles {
  ADMIN = "ADMIN",
  COURIER = "COURIER",
}

export enum CourierApplicationState {
  APPLIED = "APPLIED",
  REJECTED = "REJECTED",
  ACCEPTED = "ACCEPTED",
}
