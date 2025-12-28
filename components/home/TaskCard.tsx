"use client";

import { useRouter } from "next/navigation";
import { Task } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function TaskCard({ title, description, icon, disabled, linkTo }: Task) {
  const router = useRouter();

  const handlePress = () => {
    if (linkTo && !disabled) {
      router.push(linkTo);
    }
  };

  return (
    <Card
      className="flex flex-row items-start justify-between w-full min-h-[110px] bg-magent-200 rounded-2xl p-4 border border-gray-200 shadow"
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <div className="flex flex-row items-center mb-4 w-3/4">
        <div className="bg-magent p-2 rounded-full">{icon}</div>
        <div className="ml-4 flex-1">
          <h3 className="text-base font-semibold text-black">{title}</h3>
          <p className="text-gray-600 text-sm mt-1">{description}</p>
        </div>
      </div>

      <Button
        disabled={disabled}
        onClick={handlePress}
        variant="outline_magent"
        className="px-6"
      >
        Ir
      </Button>
    </Card>
  );
}
