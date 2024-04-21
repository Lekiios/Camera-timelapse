import { Type as t } from "@sinclair/typebox";

export const errorResponse = t.Object({ error: t.String() });

export const dataQuery = t.Object({
  deviceId: t.String(),
  timelapseId: t.String(),
  lines: t.Number(),
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
export const uploadImageResponse = t.Object({ message: t.String() });
