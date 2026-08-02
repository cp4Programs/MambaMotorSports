import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Booking: a
    .model({
      name: a.string().required(),
      phone: a.string().required(),
      email: a.email().required(),
      make: a.string().required(),
      model: a.string().required(),
      year: a.string().required(),
      serviceType: a.string().required(),
      date: a.string().required(),
      time: a.string().required(),
      issue: a.string().required(),
      status: a.string().required(),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["create"]),
      allow.authenticated().to(["read", "update", "delete"]),
    ]),

  ContactMessage: a
    .model({
      name: a.string().required(),
      phone: a.string(),
      email: a.email().required(),
      vehicle: a.string(),
      message: a.string().required(),
      status: a.string().required(),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["create"]),
      allow.authenticated().to(["read", "update", "delete"]),
    ]),

  Invoice: a
    .model({
      number: a.string().required(),
      customer: a.string().required(),
      vehicle: a.string().required(),
      itemsJson: a.string().required(),
      tax: a.float().required(),
      total: a.float().required(),
      status: a.string().required(),
      stripeSessionId: a.string(),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.authenticated().to(["create", "read", "update", "delete"]),
    ])
    .secondaryIndexes((index) => [index("number")]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});
