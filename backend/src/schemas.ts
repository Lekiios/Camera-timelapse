import { Type as t } from "@sinclair/typebox";

export const errorResponse = t.Object({ error: t.String() });
export const messageResponse = t.Object({ message: t.String() });

export const dataQuery = t.Object({
  deviceId: t.String(),
  timelapse: t.String(),
  lines: t.Optional(t.Number()),
});

export const dataResponse = t.Object({
  tempData: t.Array(t.Number()),
  humidityData: t.Array(t.Number()),
  timestamps: t.Array(t.String()),
});

export const timelapsesQuery = t.Object({ deviceId: t.String() });

export const timelapsesResponse = t.Object({ timelapses: t.Array(t.String()) });

export const timelapseQuery = t.Object({
  deviceId: t.String(),
  timelapse: t.String(),
});

export const uploadImageQuery = t.Object({
  deviceId: t.String(),
  timelapse: t.String(),
});

export const postDataQuery = t.Object({
  deviceId: t.String(),
  timelapse: t.String(),
});
export const postDataBody = t.Object({
  temp: t.Number(),
  humidity: t.Number(),
  timestamp: t.String(),
});

export const beginTimelapseQuery = t.Object({
  deviceId: t.String(),
  timelapse: t.String(),
});

export const endTimelapseQuery = t.Object({
  deviceId: t.String(),
  timelapse: t.String(),
});
