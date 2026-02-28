import {
  NotificationSettings,
  PersonalInfo,
  ProfileCard,
} from "@/components/profile";

export default function PerfilPage() {
  return (
    <div className="flex w-full flex-col gap-6 px-2 pb-6">
      <ProfileCard />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <PersonalInfo />
        </div>
        <NotificationSettings />
      </div>
    </div>
  );
}
