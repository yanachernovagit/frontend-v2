"use client";

import { useEffect, useState } from "react";

interface Section {
  id: string;
  label: string;
}

interface SectionNavProps {
  sections: Section[];
}

export default function SectionNav({ sections }: SectionNavProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    const handleScroll = () => {
      const offset = 130;
      const scrollPos = window.scrollY + offset;

      let currentId = sections[0]?.id ?? "";

      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          currentId = id;
        }
      }

      setActiveId(currentId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="sticky top-16 z-40 w-full bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="px-6 md:px-[10%] overflow-x-auto no-scrollbar">
        <ul className="flex gap-1 py-2 w-max md:w-auto">
          {sections.map(({ id, label }) => (
            <li key={id}>
              <button
                onClick={() => handleClick(id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  activeId === id
                    ? "bg-magent text-white shadow-sm scale-105"
                    : "text-black-400 hover:bg-magent-200 hover:text-magent"
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
