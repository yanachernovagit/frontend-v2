"use client";

import { Bell } from "lucide-react";

import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";

const HOURS = Array.from({ length: 17 }, (_, i) => {
  const hour = i + 6;
  return `${hour.toString().padStart(2, "0")}:00`;
});

const TOGGLE_OPTIONS = [
  {
    key: "exerciseReminder",
    label: "Recordatorio de ejercicios",
    description: "Recibe un recordatorio diario para hacer tus ejercicios",
  },
  {
    key: "weeklyReport",
    label: "Resumen semanal",
    description: "Resumen semanal de tu progreso",
  },
  {
    key: "inactivityReminder",
    label: "Recordatorio de inactividad",
    description: "Aviso cuando llevas varios días sin ejercitarte",
  },
  {
    key: "streakNotifications",
    label: "Notificaciones de racha",
    description: "Celebra tus rachas de días consecutivos",
  },
] as const;

type ToggleKey = (typeof TOGGLE_OPTIONS)[number]["key"];

type NotificationPreferences = {
  exerciseReminder: boolean;
  weeklyReport: boolean;
  inactivityReminder: boolean;
  streakNotifications: boolean;
  exerciseReminderTime: string;
};

type UseNotificationPreferencesResult = {
  preferences: NotificationPreferences | null;
  loading: boolean;
  error: string | null;
  updatePreference: (
    key: keyof NotificationPreferences,
    value: boolean | string,
  ) => void;
};

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-blue" : "bg-gray-300"
      } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export function NotificationSettings() {
  const { preferences, loading, error, updatePreference } =
    useNotificationPreferences() as UseNotificationPreferencesResult;

  if (loading) {
    return (
      <section className="flex min-h-[120px] items-center justify-center rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue border-r-transparent" />
      </section>
    );
  }

  if (!preferences && !error) return null;

  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center">
        <div className="mr-3 rounded-xl bg-magent-200 p-2">
          <Bell className="h-6 w-6 text-magent" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Notificaciones</h2>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl bg-red-50 p-3">
          <p className="text-sm font-medium text-red-500">{error}</p>
        </div>
      ) : null}

      <div className="mb-4 rounded-xl border border-magent/20 bg-magent-200/45 p-3">
        <p className="text-sm font-semibold text-magent">
          Estas configuraciones solo controlan las notificaciones de la app en
          tu teléfono.
        </p>
      </div>

      {preferences &&
        TOGGLE_OPTIONS.map((option, index) => (
          <div key={option.key}>
            <div className="flex items-center justify-between py-3">
              <div className="mr-4 flex-1">
                <p className="text-sm font-semibold text-gray-800">
                  {option.label}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {option.description}
                </p>
              </div>

              <Toggle
                checked={preferences[option.key]}
                onChange={(val) =>
                  updatePreference(option.key as ToggleKey, val)
                }
              />
            </div>

            {option.key === "exerciseReminder" &&
              preferences.exerciseReminder && (
                <div className="my-2">
                  <p className="mb-2 text-xs font-semibold text-gray-600">
                    Hora del recordatorio
                  </p>

                  <div className="no-scrollbar flex overflow-x-auto">
                    {HOURS.map((hour) => {
                      const isSelected =
                        preferences.exerciseReminderTime === hour;

                      return (
                        <button
                          key={hour}
                          type="button"
                          onClick={() =>
                            updatePreference("exerciseReminderTime", hour)
                          }
                          className={`mr-2 rounded-xl px-3 py-2 ${
                            isSelected ? "bg-blue" : "bg-gray-100"
                          } cursor-pointer`}
                        >
                          <span
                            className={`text-xs font-medium ${
                              isSelected ? "text-white" : "text-gray-700"
                            }`}
                          >
                            {hour}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            {index < TOGGLE_OPTIONS.length - 1 && (
              <div className="border-b border-gray-100" />
            )}
          </div>
        ))}
    </section>
  );
}
