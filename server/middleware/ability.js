import { AbilityBuilder, createMongoAbility, subject } from "@casl/ability";

export const defineAbility = (user) => {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  if (user && user.role === "ADMIN") {
    can("manage", "all");
  } else if (user && user.role === "CUSTOMER") {
    can("read", "product");
    can("read", "order", { userId: user.id });
    can("create", "order");
    can(["create", "read", "delete", "update"], "cart", { userId: user.id });
  } else {
    can("read", "product");
  }

  return build();
};
